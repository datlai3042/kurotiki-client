import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export type AddressType = 'Home' | 'Company' | 'Private'

export type CartCurrent = {
      cart_current_address_type: AddressType
      cart_current_address: string
      cart_current_address_ward: {
            code: string
            text: string
      }
      cart_current_address_district: {
            code: string
            text: string
      }

      cart_current_address_province: {
            code: string
            text: string
      }
      _id?:string
      cart_current_product_id: string
      cart_current_address_id: string
     cart_current_address_receiver_name: string,
      cart_current_address_receiver_tel: string,
      cart_current_address_email_vat?: string,
}

const cart_current: CartCurrent = {
      cart_current_address_type: 'Home',
      cart_current_address: '',
      cart_current_address_receiver_name: '',
      cart_current_address_receiver_tel: '',
      cart_current_address_email_vat: '',
      cart_current_address_ward: { code: '', text: '' },
      cart_current_address_district: { code: '', text: '' },
      cart_current_address_province: { code: '', text: '' },

      cart_current_product_id: '',
      cart_current_address_id: '',
}

const initialState = {
      cart_current,
}

const cartSlice = createSlice({
      name: 'cart',
      initialState,
      reducers: {
            setAddressProduct: (state, payload: PayloadAction<CartCurrent>) => {
                  state.cart_current.cart_current_address = payload.payload.cart_current_address
                  state.cart_current.cart_current_address_type = payload.payload.cart_current_address_type || 'Home'
                  state.cart_current.cart_current_product_id = payload.payload.cart_current_product_id
                  state.cart_current.cart_current_address_id = payload.payload.cart_current_address_id
                  state.cart_current.cart_current_address_ward = payload.payload.cart_current_address_ward
                  state.cart_current.cart_current_address_district = payload.payload.cart_current_address_district
                  state.cart_current.cart_current_address_province = payload.payload.cart_current_address_province
                  state.cart_current.cart_current_address_receiver_name = payload.payload?.cart_current_address_receiver_name
                  state.cart_current.cart_current_address_receiver_tel = payload.payload?.cart_current_address_receiver_tel
                  state.cart_current.cart_current_address_email_vat = payload.payload?.cart_current_address_email_vat



            },

            resetAddressProduct: (state) => {
                  state.cart_current = cart_current
            },
      },
})

export const { setAddressProduct, resetAddressProduct } = cartSlice.actions

export default cartSlice.reducer
