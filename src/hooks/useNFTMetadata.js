import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const useNFTMetadata = (address, tokenId) => {
    const chainId = useSelector((state) => state.wallet.network.chainIdHex);
    const [meta, setMeta] = useState(null)
    useEffect( ()=>{
      const getNFTMetadata = async () =>{
          // const baseurl = "http://localhost:5001/giveaways-29ebd/us-central1/app"
          const baseurl = "https://us-central1-giveaways-29ebd.cloudfunctions.net/app";
          if(address && chainId && tokenId !== null){
            var requestOptions = {
              method: 'GET',
              redirect: 'follow'
            };
  
            try{
              const url = `${baseurl}/moralis/NFTMetadata/${chainId}/${address}/${tokenId}`
              const response = await fetch(url, requestOptions);
              const json = await response.json();
              setMeta(json)
            }catch(e){ console.log("Caught:", e) }
          }
        }
      getNFTMetadata()
    }, [chainId, address, tokenId])
  return meta
};

export {useNFTMetadata}
