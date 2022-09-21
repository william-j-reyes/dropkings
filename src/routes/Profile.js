import React, {useEffect, useState} from 'react';
import Layout from '../components/Layout';
import Entered from '../components/Entered';
import Created from '../components/Created';
import GiveawaysWon from '../components/GiveawaysWon';

import { useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import { Container, Segment, Card } from 'semantic-ui-react';
import { useContract } from '../hooks/useContract';
import GiveawayFactory_ABI from "../ABI/GiveawayFactory_ABI";
import { ethers } from 'ethers';
import { cleanFloat } from '../helpers/cleanFloat';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';


export default function Profile() {
    const theme = useTheme();
    const walletAddress = useSelector((state) => state.wallet.address)
    const params = useParams();
    const id = params['id'];
    const [address, setAddress] = useState('');
    const [created, setCreated] = useState([]);
    const [entered, setEntered] = useState([]);
    const [wins, setWins] = useState([]);
    const [totalWinnings, setTotalWinnings] = useState(0);
    const [feedIndex, setFeedIndex] = useState(0);

    const rate = useSelector((state) => state.wallet.toUSD);
    const factoryAddress = useSelector((state) => state.wallet.network.factoryAddress);
    const factory = useContract(factoryAddress, GiveawayFactory_ABI, true);
    
    // Check if searching for a profile or own profile
    useEffect( ()=>{
        if(id){
            setAddress(id)
        }else{
            setAddress(walletAddress)
        }
    }, [walletAddress, id])

    useEffect( ()=>{
        const getCreatedGiveaways = async () =>{
            if(address){
                try{
                    const eventFilter = factory.filters.NewGiveaway(address)
                    const response = await factory.queryFilter(eventFilter)
                    const events = response.map( (item) =>{return item.args})
                    setCreated(events.slice().reverse())
                  }catch(e){
                    console.log(e)
                }
            }
        }
        getCreatedGiveaways();
        return () =>{
            setCreated([]);
            factory.removeListener('NewGiveaway');
        }
    }, [address, factory])

    useEffect( ()=>{
        const getEntered = async () =>{
            if(address){
                try{
                    const eventFilter = factory.filters.NewParticipant(address)
                    const response = await factory.queryFilter(eventFilter)
                    const events = response.map( (item) =>{return item.args})
                    setEntered(events.slice().reverse())
                  }catch(e){
                    console.log(e)
                }
            }
        }
        getEntered()
        return () =>{
            setEntered([]);
            factory.removeListener('NewParticipant')
        }
    }, [address, factory])

    useEffect( ()=>{
        const getWinnings = async () =>{
            if(address){
                try{
                    const eventFilter = factory.filters.NewWinner(address)
                    const response = await factory.queryFilter(eventFilter)
                    const events = response.map( (item) =>{return item.args})
                    setWins(events.slice().reverse())
                    let total = 0
                    for (const event of events){
                        const eth = parseFloat(ethers.utils.formatEther(event._prize))
                        total += eth
                    }
                    setTotalWinnings(total)
                  }catch(e){
                    console.log(e)
                }
            }
        }
        getWinnings()
        return () =>{
            setWins([]);
            factory.removeListener('NewWinner')
        }
    }, [address, factory])

    const summaryHandler = (e, props)=>{
        setFeedIndex(props.index)
    }

    const Summary = ()=>{
        return(
        <Container className='summary-container'>
            <Card.Group itemsPerRow={3}>
                <Card raised onClick={summaryHandler} name='created' index={0}>    
                    <div style={{textAlign:'center'}}>
                        <Card.Header>
                            <Typography style={{fontSize:theme.summary.fontSize}} className='totalGiveaways'>
                                {created.length}
                            </Typography>
                        </Card.Header>
                        <Card.Meta>
                            <span>Drops</span>
                        </Card.Meta>
                    </div>  
                </Card>
                <Card raised onClick={summaryHandler} name='entered' index={1}>    
                    <div style={{textAlign:'center'}}>
                        <Card.Header>
                            <Typography style={{fontSize:theme.summary.fontSize}} className='usd'>
                                {entered.length}
                            </Typography>
                        </Card.Header>
                        <Card.Meta>
                            <span>Entered</span>
                        </Card.Meta>
                    </div>  
                </Card>
                <Card raised onClick={summaryHandler} name='winnings' index={2}>    
                    <div style={{textAlign:'center'}}>
                        <Card.Header>
                            <Typography style={{fontSize:theme.summary.fontSize}} className='eth'>
                                <span>${cleanFloat(totalWinnings * rate, 2)}</span>
                            </Typography>
                        </Card.Header>
                        <Card.Meta>
                            <span>Winnings</span>
                        </Card.Meta>
                    </div>  
                </Card>
            </Card.Group>
        </Container>
        )}
    
    const Feeds = () =>{
        switch(feedIndex){
            case 0:
                return(<Created created={created}/>)
            case 1:
                return(<Entered entered={entered}/>)
            case 2:
                return(<GiveawaysWon wins={wins}/>)
            default:
        }
    }

    return (
        <Layout>
            <Container>
                <Segment>
                    <Summary/>
                    <Feeds/>
                </Segment>
            </Container>
        </Layout>
    );
}
