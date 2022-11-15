import React from 'react';
import { Container, Table, Segment, Header } from 'semantic-ui-react';
import { ethers } from 'ethers';
import '../css/NewGiveaway.css';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { cleanFloat } from '../helpers/cleanFloat';


export default function GiveawaysWon({ wins }) {
    const rate = useSelector((state) => state.wallet.toUSD);

    const Feed = () =>{
        if (wins.length){
            const Items = wins.map( (item, key) => {
                const prize = parseFloat(ethers.utils.formatEther(item._prize, 18)).toFixed(4)
                const unix = ethers.utils.formatUnits(item._date, 0);
                const date = new Date(unix * 1000)
                return(
                    <Table.Row key={key}>
                        <Table.Cell>
                            <Link to={`/Giveaways/id=${item._contract}`}> 
                                {item._contract}
                            </Link>
                        </Table.Cell>
                        <Table.Cell><p>{date.toLocaleString()}</p></Table.Cell>
                        <Table.Cell><p>${cleanFloat(prize * rate, 2)}</p></Table.Cell>
                    </Table.Row>
                )
            })
            return(<Table.Body>{Items}</Table.Body>)
        }
    }
    
    return (
        <Container>
            <Segment>
                <Header as='h1'>
                    <div style={{color:'#E9AE0B'}}>
                        <i aria-hidden="true" className="trophy icon" style={{color:'#E9AE0B'}}></i>
                        {`${wins.length}`}
                    </div>
                </Header>
                <div className='container__table'>
                    <Table unstackable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Address</Table.HeaderCell>
                                <Table.HeaderCell>Date</Table.HeaderCell>
                                <Table.HeaderCell>Prize</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Feed/>
                    </Table>
                </div>
            </Segment>
        </Container>
    );
}
