import { useEffect, useState } from 'react';

const useWalletNFTs = (address, chain) => {
    const [nfts, setNFTs] = useState([]);

    useEffect( ()=>{

      const getWalletNFTs = async () => {
        if(address && chain){

          var requestOptions = {
            method: 'GET',
            redirect: 'follow'
          };

          try{
            // const local = "http://localhost:5001/giveaways-29ebd/us-central1/app";
            const http = "https://us-central1-giveaways-29ebd.cloudfunctions.net/app";
            const url = `${http}/moralis/WalletNFTs/${chain}/${address}`
            const response = await fetch(url, requestOptions);
            const json = await response.json();
            setNFTs(json)
          }catch(e){ console.log(e) }
        }
      }

    getWalletNFTs();
    }, [address, chain])
    return nfts
};

export {useWalletNFTs}
