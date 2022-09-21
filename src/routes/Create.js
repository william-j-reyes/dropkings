import React from 'react';
import Layout from '../components/Layout'
import { Container, Card, Image } from 'semantic-ui-react'

export default function Create() {
    const eth = 'https://i.seadn.io/gae/nIjALi8j6DhXPvMYabBk_GlY8AlcJo1hikFFctEkpXKoxQxBHUyYzEJduivT88evqocc0F1e7vpZZ9CIYCBMvnpG26X4l704pihWlOI?auto=format';
    const nft = 'https://i.seadn.io/gae/7B0qai02OdHA8P_EOVK672qUliyjQdQDGNrACxs7WnTgZAkJa_wWURnIFKeOh5VTf8cfTqW3wQpozGedaC9mteKphEOtztls02RlWQ?auto=format';
    return (
        <Layout>
            <Container className="Main_container" style={{height:'100vh', overflowY:'auto'}}>
                <Container style={{margin:'auto', width:'50%', paddingTop:'5%'}}>
                    <Card.Group itemsPerRow={2} stackable>
                        <Card raised
                            href='/Create/Crypto'
                            image={<Image src={nft}/>}
                            header="Create NFT Drop"
                        />
                        <Card raised
                            href='/Create/Crypto'
                            image={<Image src={eth}/>}
                            header="Create Crypto Drop"
                        />
                    </Card.Group>
                </Container>
            </Container>
        </Layout>
    );
}