import React, {useEffect, useState} from 'react';
import { Table, Icon } from 'semantic-ui-react'
import { ethers } from 'ethers';
import '../css/Participants.css'
import CryptoDropFactory_ABI from "../ABI/CryptoDropFactory_ABI";
import { useContract } from '..//hooks/useContract';
import { useSelector } from 'react-redux';

export default function Participants({contractAddress}) {
    const factoryAddress = useSelector((state) => state.wallet.network.factoryAddress);
    const contractWS = useContract(factoryAddress, CryptoDropFactory_ABI, true)
    const [participants, setParticipants] = useState([])
    
    // New Participants
    useEffect( () => {
      contractWS.on("NewParticipant", (_owner, _contractAddress, _title, _entryTime, _prizePool) => {
        console.log("New Participant!!")
        const tmp = {_owner, _contractAddress, _title, _entryTime, _prizePool}
        setParticipants( participants => [tmp, ...participants]);
      })
      // Cleanup
      return () =>{
        contractWS.removeListener("NewParticipant");
      }
    }, [contractWS])

    // Get All Current Participants Events
    useEffect( () => {
      const getParticipants = async () => {
        try{
          const eventFilter = contractWS.filters.NewParticipant(null, contractAddress)
          const response = await contractWS.queryFilter(eventFilter)
          const events = response.map( (item) =>{
            return item.args
          })
          setParticipants(events.slice().reverse())
        }catch(e){
          console.log(e)
        }
      }
      getParticipants();
      return () =>{
        setParticipants([]);
      }
  }, [contractWS, contractAddress])
    
    const Details = () =>{
        if(participants){
            // const tmp =[...Array(50).keys()]
            const Items = participants.map( (item, key) => {
                const unix = ethers.utils.formatUnits(item._entryTime, 0)
                // const entries = item.entries;
                const date = new Date(unix * 1000)
                const date_str = date.toLocaleString()
                return(
                    <Table.Row key={key}>
                        <Table.Cell>{item._owner}</Table.Cell>
                        <Table.Cell>{date_str}</Table.Cell>
                        {/* <Table.Cell>{entries}</Table.Cell> */}
                    </Table.Row>
                )
            })
        return(<Table.Body>{Items}</Table.Body>)
        }
    }
    return (
      <div>
        <h2><Icon name='users'/> {participants.length} Participants</h2>
        <div className='container__table'>
          <Table striped unstackable>
              <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Participant Address</Table.HeaderCell>
                    <Table.HeaderCell>Entry Date</Table.HeaderCell>
                    {/* <Table.HeaderCell># of Entries</Table.HeaderCell> */}
                </Table.Row>
              </Table.Header>
              <Details/>
          </Table>
        </div>
      </div>

    );
}
