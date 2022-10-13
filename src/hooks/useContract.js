import { useMemo } from 'react';
import { ethers } from 'ethers';
import { useSelector } from 'react-redux';

const useContract = (address, abi, ws=false, signer=false) => {  
    let network = useSelector((state) => state.wallet.network);
    const wss = network.wss;
    const https = network.https;

    const contract = useMemo(() => {
        let provider;
        try{
            if(signer){
                provider =  new ethers.providers.Web3Provider(window.ethereum);
                const signature = provider.getSigner(signer);
                return new ethers.Contract(address, abi, signature)
            }
            else if(ws)
                provider =  new ethers.providers.getDefaultProvider(wss);
            else
                provider =  new ethers.providers.getDefaultProvider(https);

            return new ethers.Contract(address, abi, provider);
        }catch (e){
            console.log(e)
            return null;
        }
        
    }, [address, abi, signer, ws, wss, https]);
    return contract
};
export {useContract}
