import React from "react";
import { Link } from "react-router-dom";
import ConnectWallet from "./ConnectWallet";
import { Menu, Icon, Sidebar, Container } from 'semantic-ui-react'

export default function SidebarNavigation({setVisible, visible}){
    return(
        <Sidebar
            as={Menu}
            animation='overlay'
            onHide={() => setVisible(false)}
            vertical
            visible={visible}
            width='wide'>
            <div style={{textAlign:'center'}}>
                <ConnectWallet/>
            </div>
            <Menu.Item>
                <Link to="/">
                    <Container fluid>
                    Home
                    <Icon name='home' style={{float:'right'}}/>
                    </Container>
                </Link>
            </Menu.Item>
 
            <Menu.Item>
                <Link to="/Giveaways">
                    <Container fluid>
                    Drops
                    <Icon name='diamond' style={{float:'right'}}/>
                    </Container>
                </Link>
            </Menu.Item>
            <Menu.Item>
                <Link to="/About">
                    <Container>
                        About
                        <Icon name='desktop' style={{float:'right'}}/>
                    </Container>
                </Link>
            </Menu.Item>
            <Menu.Item>
                <Link to="/Profile">
                    <Container>
                        Profile
                        <Icon name='user' style={{float:'right'}}/>
                    </Container>
                </Link>
            </Menu.Item>
            <Menu.Item>
                <Link to="/Create">
                    <Container>
                        Create
                        <Icon name='plus' style={{float:'right'}}/>
                    </Container>
                </Link>
            </Menu.Item>
        </Sidebar>
    )
}
