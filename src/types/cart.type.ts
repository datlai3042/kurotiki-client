import { Address } from './address.type'
import { TProductDetail } from './product/product.type'
import { ShopResponse } from './shop.type'

export interface CartForm {
      product_id: string
      quantity: number
      price: number
}

export interface CartFormData extends FormData {
      append(name: keyof CartForm, value: string | Blob, fileName?: string): void
}

export type CartProductRef = Pick<TProductDetail, '_id' | 'product_thumb_image' | 'product_price' | 'product_name' | 'product_state'>
export type CartShopRef = Pick<ShopResponse, '_id' | 'shop_name' | 'shop_avatar' | 'shop_avatar_used' | 'shop_avatar_default'>

export interface CartProduct {
      _id: string
      product_id: CartProductRef
      shop_id: CartShopRef
      cart_state: 'active' | 'pending' | 'complete'
      price: number,
      quantity: number
      new_quantity: number
      isSelect: boolean
      cart_date: Date
      cart_address: Address
}

export type CartResponse = {
      _id: string
      shop_id: CartShopRef
      cart_products: CartProduct[]
      cart_state: 'active' | 'pending' | 'complete'
      cart_select_all: boolean
      quantity: number
      new_quantity: number
      isSelect: boolean
}
