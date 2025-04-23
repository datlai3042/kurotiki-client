import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { TToast } from '../component/Context/ToastContext'

const toastSlice = createSlice({
      name: 'toast',
      initialState: {
            toast: [] as TToast[],
            timerToast: 5,
      },
      reducers: {
            addToast: (state, payload: PayloadAction<TToast>) => {
                  state.toast.push(payload.payload)
            },
            removeToast: (state, payload: PayloadAction<{ id: string }>) => {
                  state.toast = state.toast.filter((t) => t.id !== payload.payload.id)
            },
      },
})

export const { addToast, removeToast } = toastSlice.actions

export default toastSlice.reducer
