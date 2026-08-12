import { ProductCart } from '../pages/product/ProductPay'
import { Address } from '../types/address.type'
import { CartProduct, CartResponse } from '../types/cart.type'
import axiosCustom from './http'

export type TModeChangeQuantityProductCart = {
      product_id?: string
      mode: 'INCREASE' | 'DECREASE' | 'INPUT'
      quantity: number,
      cart_item_id?: string
}

class CartService {
      static async addCart({ cart }: { cart: ProductCart }) {
            return axiosCustom.post<{ metadata: CartResponse }>('v1/api/cart/add-cart', { product: cart })
      }

      static async getCountProductCart() {
            return axiosCustom.get<{ metadata: { count: number } }>('v1/api/cart/cart-get-count-product')
      }

      static async getMyCart() {
            return axiosCustom.get<{ metadata: { cart: CartResponse } }>('v1/api/cart/cart-get-my-cart')
      }

      static async changeQuantityProductCart(data: TModeChangeQuantityProductCart) {
            return axiosCustom.post<{ metadata: { quantity: number } }>('v1/api/cart/cart-change-quantity', data)
      }

      static async selectAllCart(value: boolean) {
            return axiosCustom.post<{ metadata: { cart: CartResponse } }>('/v1/api/cart/cart-change-select-all', { select: value })
      }

      static async selectCartOne({ value, product_id }: { value: boolean; product_id: string }) {
            return axiosCustom.post<{ metadata: { cartUpdateItem: { product_id: string; isSelect: boolean } } }>(
                  '/v1/api/cart/cart-change-select-one',
                  { value, product_id },
            )
      }

      static async calculatorPrice() {
            return axiosCustom.get<{ metadata: { carts: CartResponse } }>('/v1/api/cart/cart-pay')
      }

      static async deleteCart({ product_id, cart_item_id }: { product_id: string, cart_item_id: string }) {
            return axiosCustom.delete<{ metadata: { message: string } }>(`/v1/api/cart/cart-delete/${product_id}`)
      }

      static async updateAddresCart({ product_id, address_full }: { product_id: string; address_full: Address }) {
            return axiosCustom.post<{ metadata: { message: string } }>('/v1/api/cart/cart-update-address-cart', {
                  payload: { product_id, address_full },
            })
      }
}

export default CartService
