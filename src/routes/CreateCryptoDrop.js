import React, {useEffect, useState} from 'react';
import Layout from '../components/Layout'
import { Container, Form, Checkbox, Button, Message, Input, Segment, Popup, Step, Icon } from 'semantic-ui-react'
import { useSelector } from 'react-redux';
import '../css/Create.css'; 
import CryptoDropFactory_ABI from "../ABI/CryptoDropFactory_ABI";
import { ethers } from 'ethers';
import { useContract } from '../hooks/useContract';
import { cleanFloat } from '../helpers/cleanFloat';
import { useTip } from '../hooks/useTip';
import { useTheme } from '@mui/material/styles';


export default function CreateCryptoDrop() {
    const theme = useTheme();
    const rate = useSelector((state) => state.wallet.toUSD);
    const balance = useSelector((state) => state.wallet.balance);
    const currency = useSelector((state) => state.wallet.network.currency); 
    const address = useSelector((state) => state.wallet.address);
    const isConnected = useSelector((state) => state.wallet.isConnected);
    const factoryAddress = useSelector((state) => state.wallet.network.factoryAddress);
    const factory = useContract(factoryAddress, CryptoDropFactory_ABI, false, address);

    const minPrize = useTip(0);
    const defaultTip = useTip(0.2);
    const [tip, setTip] = useState(defaultTip);
    const [prize, setPrize] = useState(0);
    const [total, setTotal] = useState(0);
    const [dropCreated, setDropCreated] = useState('active');
    const [dropIcon, setDropIcon] = useState('box');

    const [endDate, setEndDate] = useState(null);
    const [txPending, setTxPending] = useState(false);
    const [txSuccess, setTxSuccess] = useState(false);

    const [txMessage, setTxMessage] = useState('');
    const [show, setShow] = useState(false)
    const [tos, setTos] = useState(false)


    useEffect( () =>{
        if(prize && tip)
            setTotal(parseFloat(tip) + parseFloat(prize))

    }, [prize, tip])

    const checkSubmission = () =>{
        if (!isConnected){
            setTxMessage('Wallet Not Connected')
            return false
        }
        else if(prize < minPrize){
            setTxMessage('Minimum prize amount is $5')
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
        else if (total > balance){
            setTxMessage(`Not enough ${currency}... Your balance ${balance} ${currency}`)
            return false
        }
        return true
    }

    const createDrop = async () => {
        try{
            const provider = factory.signer.provider

            const date = new Date(endDate)
            const unixTimestamp = Math.floor(date.getTime() / 1000);
            const value = ethers.utils.parseUnits(total.toString(), "ether")
            const _ethTip = ethers.utils.parseUnits(tip.toString(), "ether")
            const createReceipt = await factory.createDrop(unixTimestamp, _ethTip, {value: value});
            setTxMessage("Waiting For Transaction to Complete...")
            const created = await provider.waitForTransaction(createReceipt.hash);

            // Listen for CryptoDropCreation Event
            const eventFilter = factory.filters.NewCryptoDrop(address);
            const response = await factory.queryFilter(eventFilter);
            const event = response.pop();
            if (created.blockHash === event.blockHash){
                setDropCreated('completed')
                setDropIcon('circle notch')
                setTxMessage("Transaction Complete! Drop Created...")
                setTxPending(false)
                setTxSuccess(true);
            }
        }catch(err){
            console.log("ERROR:", err)
            setTxMessage("Transaction Failed...")
            setShow(true)
            setDropIcon('x red')
        }
 
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const submissionPasses = checkSubmission()
        if (submissionPasses){
            // Create and Submit Transaction
            setTxPending(true)
            setDropIcon('circle notch loading')
            createDrop();
        }else
            setShow(true);
    }

    const LoadingButton = () =>{
        if(!txSuccess)
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

    const Steps = () =>{
        return(
        <Step.Group fluid>
            <Step className={dropCreated}>
            <Icon className={dropIcon} />
            <Step.Content>
                <Step.Title>Create</Step.Title>
            </Step.Content>
            </Step>
        </Step.Group>
    )
    }
    return (
        <Layout>
            <Container className="Main_container">
                <ErrorMessage/>
                
                <Segment className="Main_content" style={{margin:'auto', width:'50%'}}>
                    <h1 style={{color: theme.palette.primary.main}}>Crypto Drop</h1>
                    <Steps/>
                    <Form>
                        
                        <Form.Field>
                        <label>Prize Amount</label>
                        <Popup
                            trigger={<Input fluid 
                                value={prize}
                                min={minPrize}
                                step={minPrize}
                                type='number' 
                                label={currency} 
                                labelPosition='right' 
                                placeholder={minPrize}
                                onChange={(e)=>{setPrize(e.target.value)}}/>}
                            content={`~$${cleanFloat(prize * rate, 2)} USD`}
                            on='focus'
                        />
                        </Form.Field>
                        <Form.Field>
                            <label>End Date</label>
                            <Form.Input type='datetime-local' placeholder='' onChange={(e)=>{setEndDate(e.target.value)}}/>
                        </Form.Field>
                        <Form.Field>
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
                        </Form.Field>
                        
                        <Popup
                            trigger={<Segment><label>Total: {(cleanFloat(total, 5))} {currency} </label></Segment>}
                            content={`~$${cleanFloat(total * rate, 2)} USD + Gas Fee`}
                            on='hover'/>
                        <hr/>
                        <Checkbox checked={tos} onChange={(event) =>{setTos(!tos)}} label="I agree to the "/>
                        <a href='https://www.termsfeed.com/live/87ed3717-a76b-41f0-b001-cc1ecbeba188'> Terms and Conditions</a>
                        <br/>
                        <br/>
                        <LoadingButton/>
                    </Form>
                </Segment>
            </Container>
        </Layout>
    );
}
