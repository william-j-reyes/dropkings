import '../css/WalletNFTs.css'
import React, { useState } from 'react';
import { Segment, Card, Pagination } from 'semantic-ui-react';
import { cleanIPFS } from '../helpers/cleanIPFS';
import { useTheme } from '@mui/material/styles';

const blank = require("../assets/white-image.png")

export default function WalletNFTs({walletNFTs, setNft}) {

  const theme = useTheme();
  let nftsPerPage = 5;
  const isTabletOrMobile = theme.name === 'mobile';
  const [page, setPage] = useState(1);
  let numPages = 1
  let nfts;
  if(walletNFTs){
    nfts = walletNFTs.nfts;
    numPages = (parseInt(nfts.length / nftsPerPage) + nfts.length % nftsPerPage)
  }

  if(isTabletOrMobile)
    nftsPerPage = 3;

  const onClickHandler = (e, props) =>{
    const nft = props.nft;
    setNft(nft);
  }

  const DisplayNFTs = ({pageNumber}) =>{

    if(nfts){
      let first;
      let last;
      if(pageNumber === 1){
        first = 0
        last = nftsPerPage
      }else{
        first = (pageNumber - 1) * nftsPerPage
        last = first + nftsPerPage
      }
      const slice = nfts.slice(first, last);
      const Items = slice.map((nft, key)=>{
        const image = cleanIPFS(nft.metadata.image);
        return( 
          <Card key={key} nft={nft} raised image={<img ui="false" wrapped="false" alt={blank} src={image} height={"100%"} width={'100%'}/>} onClick={onClickHandler}/>
        )
      })
      return(<Card.Group itemsPerRow={nftsPerPage}>{Items}</Card.Group>)
    }else
    return(<div></div>)
  }

  const pageHandler = async (e, props) =>{
    setPage(props.activePage)
  }

  return(
      <Segment>
        <Pagination 
          secondary 
          pointing 
          defaultActivePage={1} 
          totalPages={numPages} 
          onPageChange={pageHandler}/>
        <DisplayNFTs pageNumber={page}/>
      </Segment>
  );
}