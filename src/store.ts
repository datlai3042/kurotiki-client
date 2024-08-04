import { combineReducers, configureStore } from '@reduxjs/toolkit'
import authSlice from './Redux/authSlice'

import authenticationSlice from './Redux/authenticationSlice'
import cartSlice from './Redux/cartSlice'
import categorySlice from './Redux/category.slice'
import commentSlice from './Redux/comment.slice'
import toast from './Redux/toast'
import uiSlice from './Redux/uiSlice'

// const authPersistConfig = {
//   key: 'auth',
//   storage: storage,
//   blacklist: ['']
// }

// const cartPersistConfig = {
//   key: 'cart',
//   storage: storage,
//   blacklist: ['']
// }

const rootReducer = combineReducers({
      cartSlice: cartSlice,
      auth: authSlice,
      uiSlice: uiSlice,
      authentication: authenticationSlice,
      toast: toast,
      category: categorySlice,
      commentSlice: commentSlice,
})

export const store = configureStore({
      reducer: rootReducer,
})

export type RootState = ReturnType<typeof store.getState>

export default store
