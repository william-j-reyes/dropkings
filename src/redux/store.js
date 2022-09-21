import { configureStore } from '@reduxjs/toolkit'
import walletReducer from './wallet'

export default configureStore({
  reducer: {
    wallet: walletReducer,
  },
})
