import React, {useEffect, useState} from 'react';
import Layout from '../components/Layout';
import Entered from '../components/Entered';
import Created from '../components/Created';
import GiveawaysWon from '../components/GiveawaysWon';

import { useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import { Container, Segment, Card, Menu, Icon } from 'semantic-ui-react';
import { useContract } from '../hooks/useContract';
import CryptoDropFactory_ABI from "../ABI/CryptoDropFactory_ABI";
import NFTDropFactory_ABI from "../ABI/NFTDropFactory_ABI";

import { ethers } from 'ethers';
import { cleanFloat } from '../helpers/cleanFloat';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';


export default function Profile() {
    const theme = useTheme();
    const walletAddress = useSelector((state) => state.wallet.address)
    const params = useParams();
    const id = params['id'];
    const [activeItem, setActive] = useState('crypto');
    const [address, setAddress] = useState('');
    const [created, setCreated] = useState([]);
    const [createdNFTs, setCreatedNFTs] = useState([]);
    const [enteredNFTDrops, setEnteredNFTDrops] = useState([]);
    const [entered, setEntered] = useState([]);
    const [wins, setWins] = useState([]);
    const [totalWinnings, setTotalWinnings] = useState(0);
    const [feedIndex, setFeedIndex] = useState(0);

    const rate = useSelector((state) => state.wallet.toUSD);
    const factoryAddress = useSelector((state) => state.wallet.network.factoryAddress);
    const nftFactoryAddress = useSelector((state) => state.wallet.network.nftFactoryAddress);
    const factory = useContract(factoryAddress, CryptoDropFactory_ABI, true);
    const nftFactory = useContract(nftFactoryAddress, NFTDropFactory_ABI, true);

    // Check if searching for a profile or own profile
    useEffect( ()=>{
        if(id){
            setAddress(id)
        }else{
            setAddress(walletAddress)
        }
    }, [walletAddress, id])

    // Created NFT Drops
    useEffect( ()=>{
        const getCreatedNFTDrops = async () =>{
            if(address){
                try{
                    const eventFilter = nftFactory.filters.NewNFTDrop(address)
                    const response = await nftFactory.queryFilter(eventFilter)
                    const events = response.map( (item) =>{return item.args})
                    setCreatedNFTs(events.slice().reverse())
                  }catch(e){
                    console.log(e)
                }
            }
        }
        getCreatedNFTDrops()
        return () =>{
            setCreatedNFTs([]);
            nftFactory.removeListener('NewNFTDrop');
        }
        
    }, [address, nftFactory])
    // Entered NFT Drops
    useEffect( ()=>{
        const getEntered = async () =>{
            if(address){
                try{
                    const eventFilter = nftFactory.filters.NewParticipant(address)
                    const response = await nftFactory.queryFilter(eventFilter)
                    const events = response.map( (item) =>{return item.args})
                    setEnteredNFTDrops(events.slice().reverse())
                    console.log(events)
                  }catch(e){
                    console.log(e)
                }
            }
        }
        getEntered()
        return () =>{
            setEnteredNFTDrops([]);
            nftFactory.removeListener('NewParticipant')
        }
    }, [address, nftFactory])
    // Created Crypto Drops
    useEffect( ()=>{
        const getCreatedGiveaways = async () =>{
            if(address){
                try{
                    const eventFilter = factory.filters.NewCryptoDrop(address)
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
            factory.removeListener('NewCryptoDrop');
        }
    }, [address, factory])

    // Entered Crypto Drops
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

    // Won Crypto Drops
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
            </Container>)

    }
    
    const NFTSummary = ()=>{
        return(
            <Container className='summary-container'>
                <Card.Group itemsPerRow={3}>
                    <Card raised onClick={summaryHandler} name='created' index={3}>    
                        <div style={{textAlign:'center'}}>
                            <Card.Header>
                                <Typography style={{fontSize:theme.summary.fontSize}} className='totalGiveaways'>
                                    {createdNFTs.length}
                                </Typography>
                            </Card.Header>
                            <Card.Meta>
                                <span>Drops</span>
                            </Card.Meta>
                        </div>  
                    </Card>
                    <Card raised onClick={summaryHandler} name='entered' index={4}>    
                        <div style={{textAlign:'center'}}>
                            <Card.Header>
                                <Typography style={{fontSize:theme.summary.fontSize}} className='usd'>
                                    {enteredNFTDrops.length}
                                </Typography>
                            </Card.Header>
                            <Card.Meta>
                                <span>Entered</span>
                            </Card.Meta>
                        </div>  
                    </Card>
                </Card.Group>
            </Container>)
    }
    const Feeds = () =>{
        switch(feedIndex){
            case 0:
                return(<Created created={created} activeItem={activeItem}/>)
            case 1:
                return(<Entered entered={entered} activeItem={activeItem}/>)
            case 2:
                return(<GiveawaysWon wins={wins} activeItem={activeItem}/>)
            default:
                return(<Created created={created} activeItem={activeItem}/>)
        }
    }

    const NFTFeeds = () =>{
        switch(feedIndex){
            case 3:
                return(<Created created={createdNFTs} activeItem={activeItem}/>)
            case 4:
                return(<Entered entered={enteredNFTDrops} activeItem={activeItem}/>)
            default:
                return(<Created created={createdNFTs} activeItem={activeItem}/>)
        }
    }

    const MenuTab = () =>{
        return(
            <Menu compact pointing icon='labeled'>
                <Menu.Item
                    name='crypto'
                    active={activeItem === 'crypto'}
                    onClick={() => {setActive('crypto')}}
                >
                    <Icon name='dollar sign' />
                    Crypto
                </Menu.Item>

                <Menu.Item
                    name='NFT'
                    active={activeItem === 'NFT'}
                    onClick={() => {setActive('NFT')}}
                >
                    <Icon name='gem' />
                    NFTs
                </Menu.Item>
            </Menu>
        )
    }

    const ProfileSummary = () =>{
        if (activeItem === 'crypto')
            return (
                <Segment>
                    <Summary/>
                    <Feeds/>
                </Segment>
            )
        else
            return (
                <Segment>
                    <NFTSummary/>
                    <NFTFeeds/>
                </Segment>
            )  
    }

    const ProfileHeader = () =>{
        if (id)
            return(
                <Segment>
                    <p>{id}</p>
                </Segment>
            )
        else
            return(<div></div>)
    }
    return (
        <Layout>
            <Container>
                <ProfileHeader/>
                <MenuTab/>
                <ProfileSummary/>
            </Container>
        </Layout>
    );
}
