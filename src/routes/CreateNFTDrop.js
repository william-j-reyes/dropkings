import React, {useState} from 'react';
import Layout from '../components/Layout'
import WalletNFTs from '../components/WalletNFTs'
import { Container, Segment, Grid, Form, Popup, Input, Button, Checkbox, Message, Card, Step, Icon } from 'semantic-ui-react'
import { useTip } from '../hooks/useTip';
import { useTheme } from '@mui/material/styles';
import { cleanFloat } from '../helpers/cleanFloat';
import { cleanIPFS } from '../helpers/cleanIPFS';
import { useSelector } from 'react-redux';
import { useContract } from '../hooks/useContract';
import { useAbi } from '../hooks/useAbi';
import { useWalletNFTs } from '../hooks/useWalletNFTs';
import NFTDropFactory_ABI from "../ABI/NFTDropFactory_ABI";
import { ethers } from 'ethers';


export default function CreateNFTDrop() {
    const theme = useTheme();
    const isConnected = useSelector((state) => state.wallet.isConnected);
    const address = useSelector((state) => state.wallet.address);
    const rate = useSelector((state) => state.wallet.toUSD);
    const currency = useSelector((state) => state.wallet.network.currency);
    const chainId = useSelector((state) => state.wallet.network.chainIdHex);
    const nftFactoryAddress = useSelector((state) => state.wallet.network.nftFactoryAddress);
    
    const [txMessage, setTxMessage] = useState('');
    const [dropCreated, setDropCreated] = useState('active');
    const [transfer, setTransfer] = useState('');

    const [show, setShow] = useState(false);
    const [txPending, setTxPending] = useState(false);
    const [txSuccess, setTxSuccess] = useState(false);
    const [tos, setTos] = useState(false);

    const walletNFTs = useWalletNFTs();
    const [nft, setNft] = useState({tokenAddress:'', tokenId:''});
    const abi = useAbi(nft.tokenAddress, chainId);
    const ERC721 = useContract(nft.tokenAddress, abi, false, address);
    const dropFactory = useContract(nftFactoryAddress, NFTDropFactory_ABI, false, address);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [endDate, setEndDate] = useState(null);
    const defaultTip = useTip(0.01);
    const [tip, setTip] = useState(defaultTip);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const submissionPasses = checkSubmission();
        if (submissionPasses){
            setTxPending(true);
            // Two transactions required
            const provider = dropFactory.signer.provider
            // 1) Create the Drop
            console.log(ERC721)
            const date = new Date(endDate)
            const unixTimestamp = Math.floor(date.getTime() / 1000);
            const big_tip = ethers.utils.parseUnits(tip.toString(), "ether")
            const createReceipt = await dropFactory.createDrop(nft.tokenAddress, parseInt(nft.tokenId), title,  unixTimestamp, description, {value: big_tip});
            const created = await provider.waitForTransaction(createReceipt.hash)
            if(created){
                setDropCreated('completed')
            // 2) Send nft to the deployed Drop
                // const transferReceipt = await ERC721.callStatic.transferFrom(address, nftFactoryAddress, nft.tokenId);
                const transferReceipt = await ERC721.transferFrom(address, nftFactoryAddress, nft.tokenId);
                const transfered = await provider.waitForTransaction(transferReceipt.hash);
                if (transfered){
                    setTransfer('completed')
                    setTxPending(false)
                    setTxSuccess(true)
                }
            }
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
        else if(!ethers.utils.isAddress(nft.tokenAddress)){
            setTxMessage('Not a valid NFT Address')
            return false
        }
        else if(!nft.tokenAddress && !nft.tokenId){
            setTxMessage('NFT not selected')
            return false
        }
        return true
    }

    const LoadingButton = () =>{
        if(txPending)
            return(<Button loading fluid inverted color='green' type='submit'/>)
        else if (txSuccess)
            return(<Button fluid inverted color='green' type='submit'>{'DONE'}</Button>)
        else
            return(<Button fluid inverted color='green' type='submit' onClick={handleSubmit}>{'Create'}</Button>)
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

    const Steps = () =>{
        return(
        <Step.Group fluid>
            <Step className={dropCreated}>
            <Icon name='box' />
            <Step.Content>
                <Step.Title>Create Drop</Step.Title>
            </Step.Content>
            </Step>
        
            <Step className={transfer}>
            <Icon name='send' color='black'/>
            <Step.Content>
                <Step.Title>Transfer NFT</Step.Title>
            </Step.Content>
            </Step>
        </Step.Group>
    )
    }

    return (
        <Layout>
            <Container className="Main_container">
                <ErrorMessage/>
                <h1 style={{color: theme.palette.primary.main}}>Create An NFT Drop</h1>
                <Segment className="Main_content">
                    <Steps/>
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
                            <Message>
                                <Message.Header>How It Works</Message.Header>
                                <p>Creating an NFT Drop requires the following 2 transactions to be signed:</p>
                                <Message.List as='ol'>
                                    <Message.Item>The creation of the Drop</Message.Item>
                                    <Message.Item>The transfer of the NFT to the Drop</Message.Item>
                                </Message.List>
                            </Message>
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
                <WalletNFTs walletNFTs={walletNFTs} setNft={setNft}/>
            </Container>
        </Layout>
    );
}
