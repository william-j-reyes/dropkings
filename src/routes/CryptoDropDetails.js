import '../css/GiveAwayDetails.css'
import React, {useState, useEffect} from 'react';
import { Container, Button, Segment, Icon, Message, Menu } from 'semantic-ui-react'
import Layout from '../components/Layout'
import Participants from '../components/Participants'
import { useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import CountdownTimer from '../components/countdown/CountdownTimer';
import { ethers } from 'ethers';
import CryptoDrop_ABI from "../ABI/CryptoDrop_ABI";
import CryptoDropFactory_ABI from "../ABI/CryptoDropFactory_ABI";
import {useContract} from '../hooks/useContract';
import { cleanFloat } from '../helpers/cleanFloat';
import { useTheme } from '@mui/material/styles';

export default function GiveAwayDetails() {
  const theme = useTheme();
  const params = useParams();
  const rate = useSelector((state) => state.wallet.toUSD);
  const currency = useSelector((state) => state.wallet.network.currency)

  const factoryAddress = useSelector((state) => state.wallet.network.factoryAddress)
  const isConnected = useSelector((state) => state.wallet.isConnected); 
  const address = useSelector((state) => state.wallet.address);
  const [giveaway, setGiveaway] = useState({prizePool: 0});
  const [msg, setMsg] = useState({});
  const [hideMsg, setHide] = useState(true);
  
  const contractAddress = params.id;
  const contract = useContract(contractAddress, CryptoDrop_ABI, false, address);
  const factory = useContract(factoryAddress, CryptoDropFactory_ABI, false, address);

  useEffect(() => {
    const getData = async ()=>{
      let response = await contract.getCryptoDrop();
      let tmp = {...response};
      tmp['prizePool'] = parseFloat(ethers.utils.formatUnits(tmp.prizePool, 18));
      tmp['closingTime'] = ethers.utils.formatUnits(tmp.closingTime, 0) * 1000;
      tmp['closingDate'] = new Date(tmp.closingTime).toLocaleString();
      setGiveaway(tmp)
    }
    getData()
  }, [contract]);

  const _selectWinner = async () =>{
    try{
      const result = await factory.selectWinner(contractAddress);
      if(result){
        const tmp = await contract.winner()
        setGiveaway(...giveaway, {winner:tmp})
        setHide(false)
      }
    }catch(e){
      console.log(e)
    }
  }

  const _refund = async () =>{
    try{
      await contract.refund()
      setGiveaway(...giveaway, {prizePool:0})

    }catch(e){
      console.log(e)
    }
  }

  const OwnerControls = () => {
    if(isConnected && address === giveaway.owner && giveaway.winner === ethers.constants.AddressZero){
      return(
        <Menu widths={3}>
          <Menu.Item onClick={_selectWinner}><p className='select-winner'>Select Winner</p></Menu.Item>
          <Menu.Item icon={<Icon name="plus"/>}/>
          <Menu.Item onClick={_refund}><p className='refund'>Refund</p></Menu.Item>
        </Menu>
      )
    }
  }

  const EnterGiveaway = () => {
    if(giveaway.open && address !== giveaway.owner){
      return(
        <div>
            <Message color={msg.color} hidden={hideMsg}>
              <Message.Header>{msg.header}</Message.Header>
              {msg.message}
            </Message>
            <Button fluid onClick={enter} positive>ENTER</Button>
        </div>
      )
    }
  }

  const enter = async () => {
    let message = {
      'header': "Waiting on Transaction Success",
      'message': "May take a moment...",
      'color':'yellow'}
    setMsg(message)
    setHide(false)
    if(isConnected && address !== giveaway.owner){
      const isEntered = await contract.entryStatus(address);
      if(!isEntered){
        try{
          await factory.enterDrop(contractAddress);
          setHide(true);
          message['header'] = "You have entered the Giveaway!"
          message['message'] = "Sit tight and wait for the winner to be selected"
          message['color'] = 'green'
          setMsg(message)
        }catch(e){
          const error = {'header': 'Error', 'message': e}
          setMsg(error)
        }
      }
      else{
        setHide(true)
        const info = await contract.entryInfo(address);
        const unix = ethers.utils.formatUnits(info.entryTime, 0);
        const entryDate = new Date(unix * 1000);
        const date_str = entryDate.toLocaleString();
        message['header'] = "You are Set!"
        message['message'] = "You have previously entered the giveaway on: " + date_str
        message['color'] = 'yellow'
        setHide(false)
      }
    }else{
      message['header'] = "Wallet not Connected!"
      message['message'] = "Connect wallet in the menu bar"
      message['color'] = 'red'
      setMsg(message)
    }
}

  const ShowDetails = () =>{
    return(
      <div className="win-header">
        <div className={`prize-${giveaway.open}`}>
          <p>${cleanFloat(giveaway.prizePool * rate, 2)}</p>
        </div>
      </div>
    )
  }

  return (
    <Layout>
      <div className='container'> 
        <Container>
          <ShowDetails/>
          <OwnerControls/>
          <Segment>
            <h2>Winner Selected @ {giveaway.closingDate}</h2>
            <CountdownTimer targetDate={giveaway.closingTime} winner={giveaway.winner} status={giveaway.open}/>
            <EnterGiveaway/>
          </Segment>
          <h1 style={{color:theme.palette.primary.main}}>{giveaway.title}</h1>
          <p>Prize Pool Amount: {cleanFloat(giveaway.prizePool, 4)} {currency}</p>
          <p>Handler: {giveaway.owner}</p>
          <p style={{fontSize:'150%'}}>{giveaway.description}</p>
          <div className='participants-seg'>
            <Segment >
              <Participants contractAddress={contractAddress}/>
            </Segment>
          </div>
        </Container>
      </div>
    </Layout>
  );
}
