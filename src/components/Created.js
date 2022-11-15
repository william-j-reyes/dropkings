import React from 'react';
import { Container, Table, Segment, Header, Image } from 'semantic-ui-react'
import { ethers } from 'ethers';
import '../css/NewGiveaway.css';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { cleanIPFS } from '../helpers/cleanIPFS';

export default function Created({ created, activeItem }) {
    const rate = useSelector((state) => state.wallet.toUSD);

    const Feed = () =>{
        if (created.length){
            const Items = created.map( (item, key) => {
                const prize = parseFloat(ethers.utils.formatUnits(item._prize, 18) * rate).toFixed(2)
                const unix = ethers.utils.formatUnits(item._expiry, 0);
                const date = new Date(unix * 1000)
                return(
                    <Table.Row key={key}>
                        <Table.Cell>
                            <Link to={`/Giveaways/id=${item._contract}`}> 
                                {item._contract}
                            </Link>
                        </Table.Cell>
                        <Table.Cell><p>{date.toLocaleString()}</p></Table.Cell>
                        <Table.Cell><p>${prize}</p></Table.Cell>
                    </Table.Row>
                )
            })
            return(<Table.Body>{Items}</Table.Body>)
        }
    }

    const NFTFeed = () =>{
        if (created.length){
            const Items = created.map( (item, key) => {
                const unix = ethers.utils.formatUnits(item.expiry, 0);
                const date = new Date(unix * 1000)
                return(
                    <Table.Row key={key}>
                        <Table.Cell><Image src={cleanIPFS(item.tokenURI)} size='tiny'/></Table.Cell>
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
                        <div style={{color:'#009FD4'}}>
                            <i aria-hidden="true" className="gift icon" style={{color:'#009FD4'}}></i>
                            {`${created.length}`}
                        </div>
                    </Header>
                    <div className='container__table'>
                        <Table unstackable>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Address</Table.HeaderCell>
                                    <Table.HeaderCell>End Date</Table.HeaderCell>
                                    <Table.HeaderCell>Prize (USD)</Table.HeaderCell>
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
                    <div style={{color:'#009FD4'}}>
                        <i aria-hidden="true" className="gift icon" style={{color:'#009FD4'}}></i>
                        {`${created.length}`}
                    </div>
                </Header>
                <div className='container__table'>
                    <Table unstackable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Prize</Table.HeaderCell>
                                <Table.HeaderCell>Address</Table.HeaderCell>
                                <Table.HeaderCell>End Date</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <NFTFeed/>
                    </Table>
                </div>
            </Segment>
        </Container>
        );
}
