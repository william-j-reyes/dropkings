import React, {useEffect, useState} from 'react';
import { Container, Segment, Card } from 'semantic-ui-react'
import CryptoDropFactory_ABI from "../ABI/CryptoDropFactory_ABI";
import { ethers } from 'ethers';
import { useSelector } from 'react-redux';
import '../css/Summary.css';
import { useContract } from '..//hooks/useContract';
import { cleanFloat } from '../helpers/cleanFloat';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function Summary() {
    const theme = useTheme();
    const [totalGiveaways, setTotalGiveaways] = useState(0);
    const [totalEth, setTotalEth] = useState(0);
    const currency = useSelector((state) => state.wallet.network.currency);
    const decimal = useSelector((state) => state.wallet.network.decimal);
    const rate = useSelector((state) => state.wallet.toUSD);
    const factoryAddress = useSelector((state) => state.wallet.network.factoryAddress);
    const factory = useContract(factoryAddress, CryptoDropFactory_ABI, false);
    // Get All Participants
    useEffect( () => {
        const getData = async () => {
            try{
                let res = await factory.totalDrops();
                setTotalGiveaways(parseInt(ethers.utils.formatUnits(res, 0)));
                res = await factory.totalPrize();
                setTotalEth(parseFloat(ethers.utils.formatEther(res)));
            }catch (e){
                console.log(factory)
                console.log(e)
            }
        }
        getData();
    }, [factory])

    return (
        <Container className='summary-container'>
            <Segment>
                <Card.Group itemsPerRow={3}>
                    <Card raised>
                        <div style={{textAlign:'center'}}>
                            <Card.Header>
                                <Typography className='totalGiveaways' style={{fontSize:theme.summary.fontSize}}>
                                    {cleanFloat(totalGiveaways)}
                                </Typography>
                            </Card.Header>
                            <Card.Meta style={{fontSize:theme.typography.fontSize}}>
                                <span>Giveaways</span>
                            </Card.Meta>
                        </div>  
                    </Card>
                    <Card raised>    
                        <div style={{textAlign:'center'}}>
                        <Card.Header>
                            <Typography className='usd' style={{fontSize:theme.summary.fontSize}}>
                                ~${cleanFloat(totalEth * rate, 2)}
                            </Typography>
                        </Card.Header>
                        <Card.Meta style={{fontSize:theme.typography.fontSize}}>
                            <Typography style={{fontSize:theme.typography.fontSize}}><span>USD</span></Typography>
                        </Card.Meta>
                        </div>  
                    </Card>
                    <Card raised>    
                        <div style={{textAlign:'center'}}>
                        <Card.Header>
                            <Typography className='eth' style={{fontSize:theme.summary.fontSize}}>
                                ~{cleanFloat(totalEth, decimal)}
                            </Typography>
                        </Card.Header>
                        <Card.Meta style={{fontSize:theme.typography.fontSize}}>
                            <span>{currency}</span>
                        </Card.Meta>
                        </div>  
                    </Card>
                </Card.Group>
            </Segment>
        </Container>
    );
}
