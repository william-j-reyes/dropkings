import React, {useState, useEffect} from 'react';
import Layout from '../components/Layout'
import { Container, Pagination, Header, Table } from 'semantic-ui-react'
import {Link} from "react-router-dom";
import CryptoDropFactory_ABI from "../ABI/CryptoDropFactory_ABI";
import { ethers } from 'ethers';
import { useSelector } from 'react-redux';
import { useContract } from '../hooks/useContract';
import { useCountdown } from '../hooks/useCountdown';
import '../css/Giveaway.css';
import { cleanFloat } from '../helpers/cleanFloat';

export default function Giveaways() {
    const [giveaways, setGiveaways] = useState([]);
    const [totalGiveAways, setTotalGiveaways] = useState(0);

    const factoryAddress = useSelector((state) => state.wallet.network.factoryAddress);
    const factory = useContract(factoryAddress, CryptoDropFactory_ABI, true)
    const rate = useSelector((state) => state.wallet.toUSD);

    const [_page, setPage] = useState(0);
    const [numPages, setNumPages] = useState(1);
    const giftsPerPage = 3;
    
    useEffect(()=>{
        const getNumPages = async () => {
            const total = await factory.totalDrops();
            setTotalGiveaways(parseInt(ethers.utils.formatUnits(total,0)))
            setNumPages(Math.ceil(total/giftsPerPage));
        }
        getNumPages();
    }, [factory, giftsPerPage])

    useEffect( () =>{
        const getPaginatedGifts = async (page) =>{
            let start = 0;
            let end = 1;
            if(page > numPages)
                return []
    
            if(!page){
                end = totalGiveAways;
                start = end - giftsPerPage;
            }else{
                end = totalGiveAways - (giftsPerPage * page)
                start = end - giftsPerPage
            }
            if(start < 0)
                start = 0;
            if(start !== end)
                return await factory.getSlicedDrops(start, end);
            else
                return []
        }

        const getGiveaways = async () =>{
            try{
                const addresses = await getPaginatedGifts(_page)
                console.log(addresses)
                if(addresses.length > 0){
                    const eventFilter = factory.filters.NewCryptoDrop(null, addresses)
                    const response = await factory.queryFilter(eventFilter)
                    const events = response.map( (item) =>{
                        return item.args})
                    setGiveaways(events.slice().reverse());
                }

                }catch(e){
                console.log(e)
            }
        }
        getGiveaways();
    }, [factory, giftsPerPage, totalGiveAways, _page, numPages])


    const Cell = ({item})=>{
        const prize = parseFloat(ethers.utils.formatEther(item._prize))
        const closingDate = parseFloat(ethers.utils.formatUnits(item._expiry, 0)) * 1000
        let [days, hours, minutes, seconds] = useCountdown(closingDate);
        let status;
        let positive = true;
        let negative = true;
        if(days + hours + minutes + seconds <= 0){
            status = 'CLOSED'
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
            positive = false;
        }
        else{
            status = 'OPEN'
            negative = false;
        }
        return(
            <Table.Row>
                <Table.Cell>
                    <h1 style={{color:'green'}}>${cleanFloat(prize * rate, 2)}</h1>
                </Table.Cell>
                <Table.Cell>
                    <Link to={`/Giveaways/id=${item._contract}`}>
                        {item._contract}
                    </Link>
                </Table.Cell>
                <Table.Cell positive={positive} negative={negative}>{status}</Table.Cell>
                <Table.Cell positive={positive}>
                    {`${days} days : ${hours} hrs : ${minutes} mins`}
                    </Table.Cell>
            </Table.Row>
        )
    }
    const TableGiveaways = () =>{
        if (giveaways){
            const Items = giveaways.map( (item, key) =>{
                return(<Cell item={item} key={key}/>)
            })

            return(
                <Table unstackable>
                    <Table.Header>
                        <Table.Row>
                        <Table.HeaderCell>Prize</Table.HeaderCell>
                        <Table.HeaderCell>Adress</Table.HeaderCell>
                        <Table.HeaderCell>Status</Table.HeaderCell>
                        <Table.HeaderCell>Time Left</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>{Items}</Table.Body>
                </Table>)
        }
    }
   

    const pageHandler = async (e, props) =>{
        setPage(props.activePage - 1)
    }

    return (
        <Layout>
            <Container>
                <div>
                    <Header as='h1' style={{color:'#1BA39C'}}>
                        <p style={{textAlign:'center', fontSize:'200%'}}>Crypto Drop Board</p>
                    </Header>
                </div>
                <div style={{textAlign:'right', paddingBottom:'4%'}}>
                    <Pagination 
                        secondary 
                        pointing 
                        defaultActivePage={1} 
                        totalPages={numPages} 
                        onPageChange={pageHandler}/>
                </div>
                <div className='container__table'>
                    <TableGiveaways/>
                </div>
            </Container>
        </Layout>
    );
}
