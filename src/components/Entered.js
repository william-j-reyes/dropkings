import React from 'react';
import { Container, Table, Segment, Header } from 'semantic-ui-react';
import { ethers } from 'ethers';
import '../css/NewGiveaway.css';
import { Link } from "react-router-dom";

export default function Entered({ entered, activeItem }) {
    const Feed = () =>{
        if (entered.length){
            const Items = entered.map( (item, key) => {
                const unix = ethers.utils.formatUnits(item._entryTime, 0);
                const date = new Date(unix * 1000)
                return(
                    <Table.Row key={key}>
                        <Table.Cell>
                            <Link to={`/Giveaways/id=${item._contract}`}> 
                                {item._title}
                            </Link>
                        </Table.Cell>
                        <Table.Cell><p>{item._contract}</p></Table.Cell>
                        <Table.Cell><p>{date.toLocaleString()}</p></Table.Cell>
                    </Table.Row>
                )
            })
            return(<Table.Body>{Items}</Table.Body>)
        }
    }
    const NFTFeed = () =>{
        if (entered.length){
            const Items = entered.map( (item, key) => {
                const unix = ethers.utils.formatUnits(item.entryTime, 0);
                const date = new Date(unix * 1000)
                return(
                    <Table.Row key={key}>
                        <Table.Cell>
                            <Link to={`/NftDrop/id=${item.contractAddress}`}>
                                {item.contractAddress}
                            </Link>
                        </Table.Cell>
                        <Table.Cell><p>{date.toLocaleString()}</p></Table.Cell>
                    </Table.Row>
                )
            })
            return(<Table.Body>{Items}</Table.Body>)
        }
    }

    if (activeItem === 'crypto')
        return (
            <Container>
                <Segment>
                    <Header as='h1'>
                        <div style={{color:'#57C478'}}>
                            <i aria-hidden="true" className="ticket icon" style={{color:'#57C478'}}></i>
                            {`${entered.length}`}
                        </div>
                    </Header>
                    <div className='container__table'>
                        <Table unstackable>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Prize</Table.HeaderCell>
                                    <Table.HeaderCell>Address</Table.HeaderCell>
                                    <Table.HeaderCell>Entry Date</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Feed/>
                        </Table>
                    </div>
                </Segment>
            </Container>
        );
    else if (activeItem === 'NFT')
    return (
        <Container>
            <Segment>
                <Header as='h1'>
                    <div style={{color:'#57C478'}}>
                        <i aria-hidden="true" className="ticket icon" style={{color:'#57C478'}}></i>
                        {`${entered.length}`}
                    </div>
                </Header>
                <div className='container__table'>
                    <Table unstackable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Address</Table.HeaderCell>
                                <Table.HeaderCell>Entry Date</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <NFTFeed/>
                    </Table>
                </div>
            </Segment>
        </Container>
    );
}
