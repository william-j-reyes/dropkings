import { useEffect, useState } from 'react';

const useAbi = (address, chain) => {
    const [abi, setAbi] = useState('');
      
    useEffect( ()=>{
      const baseurl = "https://us-central1-giveaways-29ebd.cloudfunctions.net/app";
      const polygon = new Set(['0x13881'])
      const ethereum = new Set(['0x1', '0x5'])
      let api;

      if (polygon.has(chain))
        api = `${baseurl}/polyscan/abi`
      else if (ethereum.has(chain))
        api = `${baseurl}/etherscan/abi`

      const getAbi = async () => {
        if(api && address){
          console.log(api)
          var requestOptions = {
            method: 'GET',
            redirect: 'follow'
          };

          try{
            const url = `${api}/${address}`
            const response = await fetch(url, requestOptions);
            if(response.status === 200){
              const json = await response.json();
              setAbi(json['result'])
            }
          }catch(e){}
        }
      }

      getAbi();
    }, [address, chain])
    return abi
};

export {useAbi}
