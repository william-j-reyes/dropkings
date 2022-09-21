import React from 'react';
import NewGiveaways from '../components/NewGiveaways';
import Summary from '../components/Summary';
import background from "../assets/banner.jpeg";
import { Container, Image } from 'semantic-ui-react';
import Layout from '../components/Layout'

function Home() {
    return (
      <Layout>
        <Container>
          <div style={{ backgroundImage: `url(${background})`, height:'500%'}}>
              <Image rounded src={background}/>
          </div>
          <Summary/>
          <div style={{paddingBottom:'10%'}}>
            <NewGiveaways/>
          </div>
        </Container>
      </Layout>
    );
}

export default Home;
