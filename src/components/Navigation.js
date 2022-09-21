import React from "react";
import { Link } from "react-router-dom";
import ConnectWallet from "./ConnectWallet";
import { Menu, Icon, Header } from 'semantic-ui-react';
import { useTheme } from '@mui/material/styles';

export default function Navigation({mobile, setVisible, visible}){
    const theme = useTheme();

    const color = '#4B6A88';
    const fontsize = '120%';
    if (mobile){
        return(
            <Menu widths={2}>
                <Menu.Item onClick={() =>{setVisible(!visible)}} style={{width:'20%'}}>
                    <Icon name='bars' size='large' />
                </Menu.Item>
                <Menu.Item style={{width:'80%'}}>
                    <Header as='h2' style={{color:theme.palette.primary.main, textAlign:'center' }}>
                        <Icon name='gift' size='small'/>
                        <Header.Content>DropKings</Header.Content>
                    </Header>
                </Menu.Item>
            </Menu>
        )
    }else{
        return(
            <Menu className="ui six item menu">
                <Menu.Item>
                    <Link to="/">
                    <Header as='h2' style={{color:theme.palette.primary.main, textAlign:'center' }}>
                    <Icon name='gift' size='small'/>
                    <Header.Content>DropKings</Header.Content>
                    </Header>
                    </Link>
                </Menu.Item>
                <Menu.Item>
                    <Link to="/Giveaways" style={{fontSize:fontsize, color:color}}>Drops</Link>
                </Menu.Item>
                <Menu.Item>
                    <Link to="/About" style={{fontSize:fontsize, color:color}}>About</Link>
                </Menu.Item>
                <Menu.Item>
                    <Link to="/Create" style={{fontSize:fontsize, color:color}}>Create</Link>
                </Menu.Item>
                <Menu.Item>
                    <Link to="/Profile" style={{fontSize:fontsize, color:color}}>Profile</Link>
                </Menu.Item>
                <ConnectWallet/>
            </Menu>)
    }
}
