import React, {useEffect, useState} from "react";
import Navigation from './Navigation';
import SidebarNavigation from './SidebarNavigation';
import { useDispatch, useSelector } from 'react-redux';
import { setToUSD, setToCrypto } from '../redux/wallet'
import {useExchangeRate} from '../hooks/useExchangeRate';
import { Sidebar } from 'semantic-ui-react';
import { useTheme } from '@mui/material/styles';

function Layout(props) {
    const theme = useTheme();
    const isTabletOrMobile = theme.name === 'mobile';
    const currency = useSelector((state) => state.wallet.network.currency);
    const dispatch = useDispatch();
    const toUSD = useExchangeRate(currency, 'USD');
    const toCrypto = useExchangeRate('USD', currency);
    const [visible, setVisible] = useState(false);

    useEffect(()=>{
      dispatch(setToUSD(toUSD))
      dispatch(setToCrypto(toCrypto))
    },[dispatch, toUSD, toCrypto])

    if (isTabletOrMobile){
        return(
            <div>
                <Navigation mobile={true} setVisible={setVisible} visible={visible}/>
                <Sidebar.Pushable>
                    <SidebarNavigation setVisible={setVisible} visible={visible}/>
                    <Sidebar.Pusher>
                        {props.children}
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            </div>
        )
    }else{
        return(
            <div>
                <Navigation mobile={false}/>
                {props.children}
            </div>
        )
    }
}
export default Layout;
