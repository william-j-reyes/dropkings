import { useEffect, useState,  } from 'react';
import { useSelector } from 'react-redux';

const useWalletNFTs = () => {
    const address = useSelector((state) => state.wallet.address);
    const chainId = useSelector((state) => state.wallet.network.chainIdHex);
    const [nfts, setNfts] = useState(null);

    useEffect( ()=>{
      const getWalletNFTs = async () =>{
          // const baseurl = "http://localhost:5001/giveaways-29ebd/us-central1/app"
          const baseurl = "https://us-central1-giveaways-29ebd.cloudfunctions.net/app";
          if(address && chainId){
            var requestOptions = {
              method: 'GET',
              redirect: 'follow'
            };
  
            try{
              const url = `${baseurl}/moralis/WalletNFTs/${chainId}/${address}`
              const response = await fetch(url, requestOptions);
              const json = await response.json();
              const result = json['nfts'].filter(nft => nft.contractType === "ERC721");
 
              setNfts({'nfts': result})
            }catch(e){ console.log(e) }
          }
        }
    getWalletNFTs()
    }, [address, chainId])
  return nfts
};

export {useWalletNFTs}
