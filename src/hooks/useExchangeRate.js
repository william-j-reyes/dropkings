import { useEffect, useState } from 'react';

const useExchangeRate = (from, to) => {  
    const [rate, setRate] = useState(0)
    useEffect(() => {
        const getData = async () =>{
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
              };
              try{
                const response = await fetch(`https://api.coinbase.com/v2/exchange-rates?currency=${from}`, requestOptions);
                const text = await response.text()
                const obj = JSON.parse(text)
                const currency = obj['data']['rates'][to]
                setRate(currency)
              }catch(e){
                  console.log(e)
                  return 0
              }
        }
        getData();
    }, [from, to]);
    return parseFloat(rate);
};
export {useExchangeRate}
