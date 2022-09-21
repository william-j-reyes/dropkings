import React, {useEffect, useState} from 'react';
import { Container, Table, Segment } from 'semantic-ui-react'
import GiveawayFactory_ABI from "../ABI/GiveawayFactory_ABI";
import { ethers } from 'ethers';
import { useSelector } from 'react-redux';
import { useExchangeRate } from '../hooks/useExchangeRate';
import { useContract } from '..//hooks/useContract';



export default function NewWinners() {
    const rate = useExchangeRate('ETH', 'USD');
    const factoryAddress = useSelector((state) => state.wallet.factoryAddress);
    const factory = useContract(factoryAddress, GiveawayFactory_ABI, true)
    
    useEffect(() => {
        console.log(factory)
        factory.on("0xf52e902e45107aa19b113cb6fdd0b10043399676121edb7ff484e1dccd69c5ed", (owner, contractAddress, title, prizePool) => {
            console.log("New Winner!!!")
            const tmp = {
                owner, 
                contractAddress, 
                title, 
                prizePool: ethers.utils.formatUnits(prizePool, 18)
            }
            console.log(tmp)
        });
        
    }, [factory]);      
    
    return (
        <Container>
            <Segment>
                <h1>New Winners</h1>
                <div className='container__table'>
                    {/* <Table fixed>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Winner</Table.HeaderCell>
                                <Table.HeaderCell>Prize</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Feed/>
                    </Table> */}
                </div>
            </Segment>
        </Container>
    );
}
