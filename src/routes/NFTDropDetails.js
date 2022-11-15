import '../css/GiveAwayDetails.css'
import React, {useState, useEffect} from 'react';
import { Container, Button, Segment, Icon, Message, Menu, Image } from 'semantic-ui-react'
import Layout from '../components/Layout';
import NotFound from '../components/NotFound';
import ParticipantsNFT from '../components/ParticipantsNFT';
import { useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import CountdownTimer from '../components/countdown/CountdownTimer';
import { ethers } from 'ethers';
import NFTDrop_ABI from "../ABI/NFTDrop_ABI";
import NFTDropFactory_ABI from "../ABI/NFTDropFactory_ABI";
import {useContract} from '../hooks/useContract';
import {useNFTMetadata} from '../hooks/useNFTMetadata';
// import { useTheme } from '@mui/material/styles';
import {cleanIPFS} from '../helpers/cleanIPFS';
import { useAbi } from '../hooks/useAbi';

export default function NFTDropDetails() {
  // const theme = useTheme();
  const params = useParams();
  const chainId = useSelector((state) => state.wallet.network.chainIdHex);
  const factoryAddress = useSelector((state) => state.wallet.network.nftFactoryAddress)
  const isConnected = useSelector((state) => state.wallet.isConnected); 
  const address = useSelector((state) => state.wallet.address);
  const [msg, setMsg] = useState({});
  const [approve, setApprove] = useState(false);
  const [hideMsg, setHide] = useState(true);
  const [image, setImage] = useState('');
  const [nft, setNft] = useState({});
  const contractAddress = params.id;
  const abi = useAbi(nft.nft, chainId);
  const ERC721 = useContract(nft.nft, abi, false, address);
  const contract = useContract(contractAddress, NFTDrop_ABI);
  const metadata = useNFTMetadata(nft.nft, nft.tokenId);
  const factory = useContract(factoryAddress, NFTDropFactory_ABI, false, address);

  useEffect(() => {
    const getNFT = async () => {
      let response = await contract.getNFTDrop();
      let tmp = {...response};
      tmp['closingTime'] = ethers.utils.formatUnits(tmp.closingTime, 0) * 1000;
      tmp['closingDate'] = new Date(tmp.closingTime).toLocaleString();
      console.log(tmp)

      setNft(tmp);
    }

    if(contract){
      try{
        getNFT()
      }catch(e){}
    }
  }, [contract]);

  useEffect( () =>{
    const getApproval = async () =>{
      const approved = await ERC721.getApproved(nft.tokenId)
      if (approved === contractAddress)
        setApprove("APPROVED")
    }
    if (nft.tokenId && ERC721){
      try{
        getApproval()
      }catch{}
    }
  }, [nft, contractAddress, ERC721])

  useEffect(() => {
    if(metadata){
      const image = metadata.metadata.image
      setImage(image)
    }
  }, [metadata]);

  const _selectWinner = async () =>{
    try{
      const result = await factory.selectWinner(contractAddress);
      if(result){
        const tmp = await contract.winner()
        setNft(...nft, {winner:tmp})
        setHide(false)
      }
    }catch(e){
      console.log(e)
    }
  }

  const OwnerControls = () => {
    if(isConnected && address === nft.owner && nft.winner === ethers.constants.AddressZero){
      return(
        <Menu widths={3}>
          <Menu.Item onClick={_selectWinner}><p className='select-winner'>Select Winner</p></Menu.Item>
          <Menu.Item icon={<Icon name="plus"/>}/>
          <Menu.Item ><p className='refund'>Cancel</p></Menu.Item>
        </Menu>
      )
    }
  }

  const EnterGiveaway = () => {
    if(nft.open && address !== nft.owner){
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
    if(isConnected && address !== nft.owner && approve){
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
      <div style={{margin:'auto', width:'50%', paddingTop:'5%'}}>
          <Image rounded src={cleanIPFS(image)} size='huge'/>
      </div>
    )
  }

  if (ethers.utils.isAddress(contractAddress))
    return (
      <Layout>
        <div className='container'> 
          <Container>
            <ShowDetails/>
            <OwnerControls/>
            <Segment>
              <h2>Winner Selected @ {nft.closingDate}</h2>
              <CountdownTimer targetDate={nft.closingTime} winner={nft.winner} status={nft.open}/>
              <EnterGiveaway/>
            </Segment>
            <p>Handler: {nft.owner}</p>
            <div className='participants-seg'>
              <Segment >
                <ParticipantsNFT contractAddress={contractAddress}/>
              </Segment>
            </div>
          </Container>
        </div>
      </Layout>
    );
  else
      return(<NotFound/>)
}
