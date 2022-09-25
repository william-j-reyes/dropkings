
const cleanIPFS = (url) => {  
  return (url.replace("ipfs://", "https://ipfs.moralis.io:2053/ipfs/"));
};
export {cleanIPFS}
