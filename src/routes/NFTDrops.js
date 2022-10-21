import React, {useState, useEffect} from 'react';
import Layout from '../components/Layout'
import { Container, Pagination, Header, Table, Image } from 'semantic-ui-react'
import {Link} from "react-router-dom";
import NFTDropFactory_ABI from "../ABI/NFTDropFactory_ABI";
import { ethers } from 'ethers';
import { useSelector } from 'react-redux';
import { useContract } from '../hooks/useContract';
import { cleanIPFS } from '../helpers/cleanIPFS';
import { useCountdown } from '../hooks/useCountdown';
import '../css/Giveaway.css';

export default function NFTDrops() {
    const [drops, setDrops] = useState([]);
    const [totalDrops, setTotalDrops] = useState(0);

    const factoryAddress = useSelector((state) => state.wallet.network.nftFactoryAddress);
    const factory = useContract(factoryAddress, NFTDropFactory_ABI)

    const [_page, setPage] = useState(0);
    const [numPages, setNumPages] = useState(1);
    const dropsPerPage = 3;
    
    useEffect(()=>{
      const getNumPages = async () => {
          const total = await factory.totalGiveaways();
          setTotalDrops(parseInt(ethers.utils.formatUnits(total,0)))
          setNumPages(Math.ceil(total/dropsPerPage));
        }
      if(factory)
        getNumPages();
    }, [factory])

    useEffect( () =>{
      const getPaginatedGifts = async (page) =>{
        let start = 0;
        let end = 1;
        if(page > numPages)
            return []

        if(!page){
            end = totalDrops;
            start = end - dropsPerPage;
        }else{
            end = totalDrops - (dropsPerPage * page)
            start = end - dropsPerPage
        }
        if(start < 0)
            start = 0;
        if(start !== end)
            return await factory.getSlicedDrops(start, end);
            // return  ['0xf283a20ceEA52024F5942eD78b8f1Aa63c92Bb96']
        else
            return []
    }
      const getDrops = async () =>{
          try{
              const addresses = await getPaginatedGifts(_page)
              if(addresses.length > 0){
                  const eventFilter = factory.filters.NewNFTDrop(null, addresses)
                  const response = await factory.queryFilter(eventFilter)
                  const events = response.map( (item) =>{return item.args})
                  setDrops(events.slice().reverse());
                  }
              }catch(e){
              console.log(e)
          }
      }
      getDrops();
  }, [factory, _page, numPages, totalDrops])

    const Cell = ({item})=>{
        const closingDate = parseFloat(ethers.utils.formatUnits(item.expiry, 0)) * 1000
        let [days, hours, minutes, seconds] = useCountdown(closingDate);
        let status;
        let positive = true;
        let negative = true;
        let image = cleanIPFS(item.tokenURI);
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
                <Table.Cell><Image src={image} size='tiny'/></Table.Cell>
                <Table.Cell>
                    <Link to={`/NftDrop/id=${item.contractAddress}`}>
                        {item.contractAddress}
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
        if (drops){
            const Items = drops.map( (item, key) =>{
                return(<Cell item={item} key={key}/>)
            })

            return(
                <Table unstackable>
                    <Table.Header>
                        <Table.Row>
                        <Table.HeaderCell>NFT</Table.HeaderCell>
                        <Table.HeaderCell>Address</Table.HeaderCell>
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
                      <p style={{textAlign:'center', fontSize:'200%'}}>NFT Drop Board</p>
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
