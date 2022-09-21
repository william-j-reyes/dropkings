import { ethers } from 'ethers';

// This hook takes in a float, sets the decimal amount and commifys
// Returns a string
const cleanFloat = (amount, decimal) => {  
    let f = ethers.utils.commify(amount.toFixed(decimal))
    const num_commas = f.split(",").length - 1
    if (num_commas >= 2){
        const comma = f.indexOf(',');
        const whole = f.slice(0, comma)
        const dec = f.slice(comma+1, comma + 3)
        let value;
        if (dec === '00')
            value = whole
        else
            value = `${whole}.${dec}`
        if(num_commas === 2)
            return `${value}M`
        else if (num_commas === 3)
            return `${value}B`
        else if (num_commas === 4)
            return `${value}T`
    }
    return f;
};
export {cleanFloat}
