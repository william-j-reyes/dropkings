import { createSlice } from '@reduxjs/toolkit'
const data = require('../assets/web3.json');

export const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    address: false,
    isConnected: false,
    balance: 1000,
    toUSD: 0,
    toCrypto: 0,
    networks: data,
    network: data['default'],
  },
  reducers: {
    setAddress: (state, action) => {
      state.address = action.payload
    },
    setIsConnected: (state, action) => {
      state.isConnected = action.payload
    },
    setBalance: (state, action) => {
      state.balance = action.payload
    },
    setToUSD: (state, action) => {
      state.toUSD = action.payload
    },
    setToCrypto: (state, action) => {
      state.toCrypto = action.payload
    },
    setNetwork: (state, action) => {
      state.network = {...action.payload}
    }
  },
  
})

// Action creators are generated for each case reducer function
export const { setAddress, setIsConnected, setBalance, setToUSD,
  setToCrypto, setNetwork } = walletSlice.actions
export default walletSlice.reducer
