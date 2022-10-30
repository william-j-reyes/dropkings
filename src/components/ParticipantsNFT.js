import React, {useEffect, useState} from 'react';
import { Table, Icon } from 'semantic-ui-react'
import { ethers } from 'ethers';
import '../css/Participants.css'
import NFTDropFactory_ABI from "../ABI/NFTDropFactory_ABI";
import { useContract } from '..//hooks/useContract';
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";


export default function ParticipantsNFT({contractAddress}) {
    const factoryAddress = useSelector((state) => state.wallet.network.nftFactoryAddress);
    const contractWS = useContract(factoryAddress, NFTDropFactory_ABI, true);
    const [participants, setParticipants] = useState([]);
    
    // New Participants
    useEffect( () => {
      contractWS.on("NewParticipant", (owner, contractAddress, entryTime) => {
        const tmp = {owner, contractAddress, entryTime}
        setParticipants( participants => [tmp, ...participants]);
      })
      // Cleanup
      return () =>{
        contractWS.removeListener("NewParticipant");
      }
    }, [contractWS]);

    // Get All Current Participants Events
    useEffect( () => {
      const getParticipants = async () => {
        try{
          const eventFilter = contractWS.filters.NewParticipant(null, contractAddress)
          const response = await contractWS.queryFilter(eventFilter)
          const events = response.map( (item) =>{
            return {contractAddress: item.args.contractAddress, entryTime: item.args.entryTime, owner: item.args.owner}
          })
          console.log(events)
          setParticipants(events.slice().reverse())
        }catch(e){
          console.log(e)
        }
      }
      getParticipants();
      return () =>{
        setParticipants([]);
      }
  }, [contractWS, contractAddress]);
    
    const Details = () =>{
        if(participants){
            const Items = participants.map( (item, key) => {
                const unix = ethers.utils.formatUnits(item.entryTime, 0)
                const date = new Date(unix * 1000)
                const date_str = date.toLocaleString()
                return(
                    <Table.Row key={key}>
                        <Table.Cell>
                          <Link to={`/profile/id=${item.owner}`}>{item.owner}</Link>
                        </Table.Cell>
                        <Table.Cell>{date_str}</Table.Cell>
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
                </Table.Row>
              </Table.Header>
              <Details/>
          </Table>
        </div>
      </div>

    );
}
