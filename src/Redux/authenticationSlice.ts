import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { UserResponse } from '../types/user.type'
// const userDefault: TRegisterResponse = {
//       email: '',
//       verify_email: false,
//       gender: 'Male',
//       sercel_url: '',
//       _id: '',
//       bob: Date.now()
// }

type InitialState = {
      user: UserResponse | undefined
      isOpenBoxLogin: boolean
      isLoading: boolean
}

const initialState: InitialState = {
      user: undefined,
      isOpenBoxLogin: false,
      isLoading: false,
}

const authSlice = createSlice({
      name: 'authentication',
      initialState,
      reducers: {
            fetchUser: (state, payload: PayloadAction<{ user: UserResponse | undefined }>) => {
                  state.user = payload.payload.user
                  state.isLoading = false
            },

            onLoading: (state) => {
                  state.isLoading = true
            },

            endLoading: (state) => {
                  state.isLoading = false
            },

            doLogout: (state) => {
                  state.user = undefined
                  // state.isLoading = false
            },
            doOpenBoxLogin: (state) => {
                  state.isOpenBoxLogin = true
                  state.user = undefined
            },
            doCloseBoxLogin: (state) => {
                  state.isOpenBoxLogin = false
            },
      },
})

export const { fetchUser, doLogout, doOpenBoxLogin, doCloseBoxLogin, onLoading, endLoading } = authSlice.actions

export default authSlice.reducer
