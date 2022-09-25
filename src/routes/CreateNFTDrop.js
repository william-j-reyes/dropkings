import React, {useState} from 'react';
import Layout from '../components/Layout'
import WalletNFTs from '../components/WalletNFTs'

import { Container, Segment, Grid, Form, Popup, Input, Button, Checkbox, Message, Card } from 'semantic-ui-react'
import { useTip } from '../hooks/useTip';
import { useTheme } from '@mui/material/styles';
import { cleanFloat } from '../helpers/cleanFloat';
import { cleanIPFS } from '../helpers/cleanIPFS';
import { useSelector } from 'react-redux';
import { useContract } from '../hooks/useContract';


export default function CreateNFTDrop() {
    const theme = useTheme();
    const isConnected = useSelector((state) => state.wallet.isConnected);
    const address = useSelector((state) => state.wallet.address);
    const rate = useSelector((state) => state.wallet.toUSD);
    const currency = useSelector((state) => state.wallet.network.currency);
    const chainId = useSelector((state) => state.wallet.network.chainIdHex);
    const nftFactoryAddress = useSelector((state) => state.wallet.network.nftFactoryAddress);
    
    const [txMessage, setTxMessage] = useState('');
    const [show, setShow] = useState(false);
    const [txPending, setTxPending] = useState(false);
    const [txSuccess, setTxSuccess] = useState(false);
    const [tos, setTos] = useState(false);

    const [nft, setNft] = useState({tokenAddress:'', tokenId:''});
    const nftContract = useContract(nft.tokenAddress, '');

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [endDate, setEndDate] = useState(null);
    const defaultTip = useTip(2);
    const [tip, setTip] = useState(defaultTip);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const submissionPasses = checkSubmission()
        if (submissionPasses){
            setTxPending(true)
            // Two transactions required
            // 1) Approve the transaction to be managed by factory
            // 2) Send nft to the deployed contract
            // Approve the NFT to be managed by the factory
            const approve = await nftContract.approve(nftFactoryAddress, nft.tokenAddress);
            if (approve){
                console.log(description)
            }
            // Create and Submit Transaction
            // createGiveaway();
            setTxSuccess(true)
        }else
            setShow(true);
    }

    const checkSubmission = () =>{
        if (!isConnected){
            setTxMessage('Wallet Not Connected')
            return false
        }
        else if(!endDate){
            setTxMessage('"End Date" is empty')
            return false
        }
        else if(!tos){
            setTxMessage('"Terms and Conditions" not accepted')
            return false
        }
        else if(tip < defaultTip){
            setTxMessage('Minimum gratuity is $2')
            return false
        }
        return true
    }

    const LoadingButton = () =>{
        if(!txSuccess)
            return(<Button fluid positive type='submit' onClick={handleSubmit}>Create</Button>)
        else if(txPending)
            return(<Button fluid positive type='submit' loading>Create</Button>)
        else
            return(<Button fluid positive type='submit' onClick={handleSubmit}>Create</Button>)
    }

    const ErrorMessage = () => {
        let color = 'red'
        if(txSuccess)
            color = 'green'
        else if (txPending)
            color = 'yellow'

        if(show)
            return(
            <Segment>
                <Message color={color}>
                    <Message.Header>{txMessage}</Message.Header>
                </Message>
            </Segment>)
        else if (txSuccess){
            return(
                <Segment>
                    <Message positive>
                        <Message.Header>{txMessage}</Message.Header>
                    </Message>
                </Segment>)
        }
            return(<div></div>)
    }

    const SelectedNFT = () =>{
        const daniel = require("../assets/white-image.png")
        if(nft.metadata){
            const image = cleanIPFS(nft.metadata.image);
            return(
            <div style={{margin:"auto", width:"50%"}}>
                <Card
                    image={image}
                />
            </div>
            )
        }else{
            return(
            <div style={{margin:"auto", width:"50%"}}>
                <Card
                    image={daniel}
                />
            </div>)
        }
      }

    return (
        <Layout>
            <Container className="Main_container">
                <ErrorMessage/>
                <h1 style={{color: theme.palette.primary.main}}>Create An NFT Drop</h1>
                <Segment className="Main_content">
                    <Grid>
                        <Grid.Column width={8}>
                            <Form>
                                <Form.Field>
                                    <label>Title</label>
                                    <Form.Input
                                        maxLength="25"
                                        type='text'
                                        value={title}
                                        placeholder='Drop Name (25 Char Limit)' 
                                        onChange={(e) => {setTitle(e.target.value)}}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>End Date</label>
                                    <Form.Input type='datetime-local' placeholder='' onChange={(e)=>{setEndDate(e.target.value)}}/>
                                </Form.Field>
                                    <Form.TextArea 
                                        maxLength="280" 
                                        label='Description' 
                                        placeholder='Tell us about the giveaway (100 Char Limit)'
                                        onChange={(e) =>{ setDescription(e.target.value) }}
                                    />
                            </Form>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <div className='payment-col'>
                                <Form>
                                    <Form.Field>
                                        <label>NFT Address</label>
                                        <Form.Input
                                            type='text'
                                            value={nft.tokenAddress}
                                            onChange={(e) => {setNft({...nft, tokenAddress: e.target.value} )} }
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Token Id</label>
                                        <Form.Input
                                            min='0'
                                            type='number'
                                            value={nft.tokenId}
                                            onChange={(e) => {setNft({...nft, tokenId: e.target.value})}}
                                        />
                                    </Form.Field>
                                </Form>
                                <Popup
                                    trigger={<div>
                                        <label>Gratuity</label>
                                        <Input fluid 
                                            value={tip}
                                            min={defaultTip}
                                            step="0.0001"
                                            type='number'  
                                            label={currency} 
                                            labelPosition='right' onChange={(e)=>{setTip(e.target.value)}}/>
                                        </div>}
                                    content={`~$${cleanFloat(tip * rate, 2)} USD`}
                                    on='focus'/>
                                <br/>
                                <Form.Field>
                                    <SelectedNFT/>
                                </Form.Field>
                                <br/>
                                <Checkbox checked={tos} onChange={(event) =>{setTos(!tos)}} label="I agree to the "/>
                                <a href='https://www.termsfeed.com/live/87ed3717-a76b-41f0-b001-cc1ecbeba188'> Terms and Conditions</a>
                                <br/>
                                <br/>
                                <LoadingButton/>
                            </div>
                        </Grid.Column>
                    </Grid>
                </Segment>
                <WalletNFTs address={address} chain={chainId} setNft={setNft} />
            </Container>
        </Layout>
    );
}
