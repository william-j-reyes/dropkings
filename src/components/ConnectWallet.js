import React , { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setAddress, setIsConnected, setBalance, setNetwork } from '../redux/wallet';
import { Button, Menu, Dropdown, Icon } from 'semantic-ui-react'
import { ethers } from 'ethers';
import { useTheme } from '@mui/material/styles';

export default function ConnectWallet() {
    const theme = useTheme();
    const [provider, setProvider] = useState(null);
    const dispatch = useDispatch();

    const isConnected = useSelector((state) => state.wallet.isConnected);
    const network = useSelector((state) => state.wallet.network);
    const networks = useSelector((state) => state.wallet.networks);

    const isTabletOrMobile = theme.name === 'mobile';

    useEffect( ()=>{
      // When a Provider makes its initial connection, it emits a "network"
      // event with a null oldNetwork along with the newNetwork. So, if the
      // oldNetwork exists, it represents a changing network
      const handleNetworkChange = (chainId) =>{
        try{
          window.location.reload();
        }catch{
          console.log("Chain not compatible")
        }
      }
      if(provider){
        provider.on("chainChanged", handleNetworkChange);
        return () => {
          provider.removeListener("chainChanged", handleNetworkChange);
        };
      }
    },[provider])
  
    useEffect( ()=>{
      // Handle account change on, should disconnect and reset states
      const handleAccountChange = (accounts)=>{
        dispatch(setAddress(false));
        dispatch(setIsConnected(false));
        dispatch(setBalance(0));
      }
      if(provider){
        provider.on('accountsChanged', handleAccountChange);
        return () => {
          provider.removeListener("accountsChanged", handleAccountChange);
        };
      }

    }, [provider, dispatch])

    const connectWallet = async () => {
      // Check if has metamask
      // Check if network matches
      // Set Address, balance, and is connected
      let _provider;
      try{
        if(window.ethereum){
          const { ethereum } = window;
          if (ethereum && ethereum.isMetaMask) {
            _provider = new ethers.providers.Web3Provider(window.ethereum)
            setProvider(_provider)
          }else
            console.log('Install Metamask')
        }
      }catch(e){
        console.log(e)
      }

      try {
        const provider_chainid = (await _provider.getNetwork()).chainId.toString()
        if(provider_chainid === network.chainId){
          const accounts = await _provider.listAccounts();
          // Convert to Checksum address
          const address = ethers.utils.getAddress(accounts[0])
          let balance = await _provider.getBalance(address);
          let bal = ethers.utils.formatEther(balance).substring(0, 7);

          dispatch(setAddress(address));
          dispatch(setBalance(bal))
          dispatch(setIsConnected(true));
          console.log("Wallet Connected!")
        }else{
          console.log("Change Metamask Network!!!")
        }
      }catch (error) {
        console.log(error)
      }
    };

    const disconnectWallet = () => {
      try {
          if (isConnected) {
              dispatch(setAddress(false));
              dispatch(setIsConnected(false));
              dispatch(setBalance(0));
          }
          }catch (error) {
              console.log(error);
          }
      };
    
    const Wallet = () =>{
      if(!isConnected){
        return(
            <Button inverted color='orange' onClick={connectWallet}>
              Connect
            </Button>
            )
      }
      return(
        <Button inverted color='blue' onClick={disconnectWallet}>Disconnect</Button>
      )
    }

    if(isTabletOrMobile)
      return(
        <Menu.Item>
          <Dropdown
              style={{width:'100%', textAlign:'center', background:'white', color:theme.palette.primary.main}}
              button
              className='icon inverted'
              icon={<Icon name='world' style={{paddingLeft:'2%'}}/>}
  
              options={[{key:'Ethereum', text:'Ethereum', value:'5'}, {key:'Polygon', text:'Polygon', value:'80001'}]}
              text={network.name}
              onChange={(event, button)=>{
                dispatch(setNetwork(networks[button.value]))
              }}
          />
      </Menu.Item>
      )
    else
      return(
        <Menu.Item>
          <div >
            <Wallet/>
          </div>
          <div style={{paddingLeft:'10%'}}>
            <Dropdown
              style={{width:'100%', background:'white', color:theme.palette.primary.main}}
              button
              className='icon'
              icon={<Icon name='world' style={{paddingLeft:'2%'}}/>}
              options={[{key:'Ethereum', text:'Ethereum', value:'5'}, {key:'Polygon', text:'Polygon', value:'80001'}]}
              text={network.name}
              onChange={(event, button)=>{
                dispatch(setIsConnected(false))
                dispatch(setNetwork(networks[button.value]))
              }}
            />
          </div>
        </Menu.Item>
      )
}
