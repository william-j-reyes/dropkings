import React, {useState} from 'react';
import Layout from '../components/Layout'
import { Container, Segment, Accordion, Icon, Header } from 'semantic-ui-react'
import data from '../assets/faq.json'


export default function About() {
    const [activeIndex, setActiveIndex] = useState(0)
    const handleClick = (e, titleProps) => {
        const { index } = titleProps
        const newIndex = activeIndex === index ? -1 : index    
        setActiveIndex(newIndex)
    }
    const FAQ = ()=>{
        if(data){
            const Items = [];
            for( var key in data){
                const item = data[key];
                const el = (
                    <div key={key}>
                        <Accordion.Title active={activeIndex === key} index={key} onClick={handleClick}>
                            <Icon name='dropdown' />
                            {item['q']}
                        </Accordion.Title>

                        <Accordion.Content active={activeIndex === key}>
                            {item['a']}
                        </Accordion.Content>
                    </div>
                )
                Items.push(el)
            }
            return( <Accordion fluid styled>{Items}</Accordion>)
        }

    }
    return (
        <Layout>
            <Container>
                <Segment>
                    <p style={{fontSize:'200%'}}>Welcome to DropKings!</p> 
                    <p>The only platform where anyone can create a Drop to giveaway. Drop entry is absolutely <b>FREE</b>.
                        The best place for communities to give back. You can support the site by leaving a <b>tip</b> when you create 
                        a Drop.
                    </p>
                <Segment>
                    <Header>Frequently Asked Questions</Header>
                    <FAQ/> 
                </Segment>
                </Segment>
            </Container>
        </Layout>
    );
}
