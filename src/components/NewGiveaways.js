import React, {useEffect, useState} from 'react';
import { Container, Table, Segment } from 'semantic-ui-react'
import GiveawayFactory_ABI from "../ABI/GiveawayFactory_ABI";
import Giveaway_ABI from "../ABI/Giveaway_ABI";
import { Link } from "react-router-dom";
import { ethers } from 'ethers';
import { useSelector } from 'react-redux';
import '../css/NewGiveaway.css';
import { useExchangeRate } from '../hooks/useExchangeRate';
import { useContract } from '..//hooks/useContract';
import { cleanFloat } from '../helpers/cleanFloat';
import { Typography, useTheme } from '@mui/material';

export default function NewGiveaways() {
    const theme = useTheme();
    const isTabletOrMobile = theme.name === 'mobile';

    const [giveaways, setGiveAways] = useState([]);
    const currency = useSelector((state) => state.wallet.network.currency);
    const network = useSelector((state) => state.wallet.network.https);

    const rate = useExchangeRate(currency, 'USD');
    const factoryAddress = useSelector((state) => state.wallet.network.factoryAddress);
    const factory = useContract(factoryAddress, GiveawayFactory_ABI, true);

    // Get All Participants
    useEffect( () => {
        const getLastGiveaways = async () => {
            const provider =  new ethers.providers.getDefaultProvider(network);
            try{
                const total = await factory.totalGiveaways();
                let upperbound = 4;
                if(total < upperbound)
                    upperbound = total;
                let i = 1;
                while(i <= upperbound){
                    const address = await factory.deployedGiveaways(total - i)
                    const contract =  new ethers.Contract(address, Giveaway_ABI, provider)
                    const [title, closingTime, prizePool, owner] = await Promise.all([
                        contract.title(), contract.closingTime(), contract.prizePool(), contract.owner()])
                    const tmp = {title, contractAddress: address, closingTime, 
                        prizePool: ethers.utils.formatUnits(prizePool, 18), owner}
                    setGiveAways( giveaways => [...giveaways, tmp]);
                    i += 1;
                }
            }catch(e){console.log(e)}
        }
        getLastGiveaways();
        // cleanup
        return () =>{
            setGiveAways([]);
        }
    }, [factory, network])
    
    useEffect(() => {
        factory.on("NewGiveaway", (owner, contractAddress, title, closingTime, prizePool) => {
            console.log("New Giveaway!!!")
            const tmp = {
                owner, 
                contractAddress, 
                title, 
                closingTime, 
                prizePool: ethers.utils.formatUnits(prizePool, 18), 
                winner: ethers.constants.AddressZero,
                participants:[],
                status: true,
                totalEntries: 0
            }
            setGiveAways( giveaways => [tmp, ...giveaways]);
        });
        return () =>{
            factory.removeListener("NewGiveaway");
        }
    }, [factory]);
        

    const Feed = ({mobile}) =>{
        let fontSize;
        if(mobile)
            fontSize = '80%'
        else
            fontSize = '100%'
        if (giveaways){
            const Items = giveaways.map( (item, key) => {
                const _prize = item.prizePool * rate;
                const unix = ethers.utils.formatUnits(item.closingTime, 0);
                const date = new Date(unix * 1000)
                return(
                    <Table.Row key={key}>
                        <Table.Cell>
                            <Link to={`/Giveaways/id=${item.contractAddress}`} > 
                                <p style={{fontSize:fontSize}}> {item.title} </p>
                            </Link>
                        </Table.Cell>
                        <Table.Cell><p className='prize-cell' style={{fontSize:fontSize}}>${cleanFloat(_prize, 2)}</p></Table.Cell>
                        <Table.Cell><p style={{fontSize:fontSize}}>{date.toLocaleString()}</p></Table.Cell>
                    </Table.Row>
                )
            })
            return(<Table.Body>{Items}</Table.Body>)
        }
    }
    
    return (
        <Container>
            <Segment>
                <Typography variant='h1' style={{color:theme.palette.primary.main, fontSize:theme.summary.fontSize}}>
                    Newest Drops
                </Typography>
                <div className='container__table'>
                    <Table unstackable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Title</Table.HeaderCell>
                                <Table.HeaderCell>Prize</Table.HeaderCell>
                                <Table.HeaderCell>Closes @</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Feed mobile={isTabletOrMobile}/>
                    </Table>
                </div>
            </Segment>
        </Container>
    );
}
