import '../css/WalletNFTs.css'
import React, { useEffect, useState } from 'react';
import { useWalletNFTs } from '../hooks/useWalletNFTs';
import { Segment, Card, Pagination } from 'semantic-ui-react';
import { cleanIPFS } from '../helpers/cleanIPFS';
const blank = require("../assets/white-image.png")

export default function WalletNFTs({address, chain, setNft}) {
  const nftsPerPage = 5;
  const wallet = useWalletNFTs(address, chain);
  const [numPages, setNumPages] = useState(1);
  const [page, setPage] = useState(1);

  useEffect(()=>{
    if(wallet.nfts)
      setNumPages(parseInt(wallet.nfts.length / nftsPerPage) + wallet.nfts.length % nftsPerPage)
    
  },[wallet])

  const onClickHandler = (e, props) =>{
    const nft = props.nft;
    setNft(nft);
  }

  const DisplayNFTs = ({pageNumber}) =>{
    if(wallet.nfts){
      let first;
      let last;
      if(pageNumber === 1){
        first = 0
        last = nftsPerPage
      }else{
        first = (pageNumber - 1) * nftsPerPage
        last = first + nftsPerPage
      }
      const nfts = wallet.nfts.slice(first, last);
      const Items = nfts.map((nft, key)=>{
        const image = cleanIPFS(nft.metadata.image);
        return( 
          <Card key={key} nft={nft} raised image={<img alt={blank} id="card" src={image} height={"100%"} width={'100%'}/>} onClick={onClickHandler}/>
        )
      })
      return(<Card.Group itemsPerRow={5}>{Items}</Card.Group>)
    }else
    return(<div></div>)
  }

  const pageHandler = async (e, props) =>{
    setPage(props.activePage)
  }

  return(
    <div>
      <Segment>
        <Pagination 
          secondary 
          pointing 
          defaultActivePage={1} 
          totalPages={numPages} 
          onPageChange={pageHandler}/>
        <DisplayNFTs pageNumber={page}/>
      </Segment>

    </div>
  );
}