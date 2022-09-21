import { useMemo } from 'react';
import { useSelector } from 'react-redux';

const useTip = (amount) => {  
    const rate = useSelector((state) => state.wallet.toCrypto);
    const tip = useMemo(()=>{return (amount * rate).toFixed(5)}, [amount, rate]);
    return tip;
};
export {useTip}
