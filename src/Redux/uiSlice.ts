import { PayloadAction, createSlice } from '@reduxjs/toolkit'

const initialUi = {
      showSideBar: false,
      showOverload: false,
}

const uiSlice = createSlice({
      name: 'ui',
      initialState: initialUi,

      reducers: {
            toDoShowSideBar: (state) => {
                  state.showSideBar = true
            },
            toDoHideSideBar: (state) => {
                  state.showSideBar = false
            },

            onShowSideBar: (state, payload: PayloadAction<{ showSideBar: boolean }>) => {
                  state.showSideBar = payload.payload.showSideBar
            },
            onShowOverload: (state, payload: PayloadAction<{ overload: boolean }>) => {
                  state.showOverload = payload.payload.overload
            },
      },
})

export const { toDoHideSideBar, toDoShowSideBar, onShowOverload, onShowSideBar } = uiSlice.actions

export default uiSlice.reducer
