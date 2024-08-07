import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
      name: 'auth',
      initialState: {
            isAuthencation: false,
            userCurrent: null, // chưa học back-end nên setup fake data hơi lubu...
            isOpenBoxLogin: false,
      },
      reducers: {
            doOpenBoxLogin: (state) => {
                  state.isOpenBoxLogin = true
            },
            doCloseBoxLogin: (state) => {
                  state.isOpenBoxLogin = false
            },
            userLogin: (state, action: any) => {
                  state.userCurrent = action.payload
                  state.isAuthencation = true
            },

            userLogout: (state) => {
                  state.isAuthencation = false
                  state.userCurrent = null
            },
      },
})

export const { doOpenBoxLogin, doCloseBoxLogin, userLogin, userLogout } = authSlice.actions

export default authSlice.reducer
