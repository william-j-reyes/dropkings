import React from 'react';
import Layout from '../components/Layout'
import { Container, Card, Image } from 'semantic-ui-react'
import { Link } from "react-router-dom";

export default function Create() {
    const eth = 'https://i.seadn.io/gae/nIjALi8j6DhXPvMYabBk_GlY8AlcJo1hikFFctEkpXKoxQxBHUyYzEJduivT88evqocc0F1e7vpZZ9CIYCBMvnpG26X4l704pihWlOI?auto=format';
    const nft = require("../assets/Classic_Jersey_emote.png")
    return (
        <Layout>
            <Container fluid className="Main_container" style={{height:'100vh', overflowY:'auto', paddingTop:'5%'}}>
                    <Card.Group itemsPerRow={2} stackable centered doubling>
                        <Link to='/Nft' style={{padding:'1%'}}>
                            <Card raised
                                image={<Image src={nft}/>}
                                header="NFT Drop"
                            />
                        </Link>
                        <Link to='/Crypto' style={{padding:'1%'}}>
                            <Card raised
                                image={<Image src={eth}/>}
                                header="Crypto Drop"
                            />
                        </Link>
                    </Card.Group>
            </Container>
        </Layout>
    );
}
