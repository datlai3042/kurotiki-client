import { ModeForm } from '../component/BoxUi/BoxShopForm'
import { TResponseApi } from '../types/axiosResponse'
import { CartProduct, CartResponse } from '../types/cart.type'
import { Order } from '../types/order.type'
import { ProductType, TProductDetail } from '../types/product/product.type'
import { ShopResponse } from '../types/shop.type'
import { UserResponse } from '../types/user.type'
import axiosCustom from './http'

export type StateFile = 'Full' | 'no-file'

type ImageCloudinary = {
      secure_url: string
      public_id: string
}

export type TShopAvatarReturn = {
      shop_id: string
      shop_avatar: ImageCloudinary
}

export interface IUploadImageAvatar extends FormData {
      append(name: 'image', value: string | Blob, fileName?: string): void
}

export interface IPublicIdImage extends FormData {
      append(name: 'public_id', value: string | Blob, fileName?: string): void
}

export interface RegisterShop extends FormData {
      append(name: 'file' | 'shop_name' | 'shop_description', value: string | Blob, fileName?: string): void
}

class ShopApi {
      static async registerShop(data: RegisterShop, state: StateFile, mode: ModeForm) {
            return axiosCustom.post<{ metadata: { shop: ShopResponse; user: UserResponse } }>(
                  `v1/api/shop/register-shop?state=${state}&mode=${mode}`,

                  data,
                  {
                        headers: { 'content-Type': 'multipart/form-data' },
                  },
            )
      }

      static async uploadAvatar(formData: IUploadImageAvatar) {
            return axiosCustom.post<{ metadata: TShopAvatarReturn }>('v1/api/shop/upload-avatar-shop', formData, {
                  headers: { 'content-Type': 'multipart/form-data' },
            })
      }

      static async deleteAvatar({ shop_id, public_id }: { shop_id: string; public_id: string }) {
            return axiosCustom.post<{ metadata: TShopAvatarReturn }>(`v1/api/shop/delete-avatar-shop`, { shop_id, public_id })
      }

      static async getShopName() {
            return axiosCustom.get<any>(`v1/api/shop/get-shop-name`)
      }

      static async getMyShop() {
            return axiosCustom.get<{ metadata: { shop: ShopResponse } }>('v1/api/shop/get-my-shop')
      }

      static async getProductMyShop({ page, limit, shop_id }: { page: number; limit: number; shop_id: string }) {
            return axiosCustom.get<{ metadata: { shop: ShopResponse } }>('v1/api/shop/get-product-my-shop', {
                  params: { page, limit, shop_id },
            })
      }

      static async getMyOrderShop({ page, limit, shop_id }: { page: number; limit: number; shop_id: string }) {
            return axiosCustom.get<{ metadata: { orderShop: CartProduct[] } }>('v1/api/shop/get-my-order-shop', {
                  params: { page, limit, shop_id },
            })
      }

      static async foundShopHasProductType({ product_type }: { product_type: ProductType }) {
            return axiosCustom.get<TResponseApi<{ shops: ShopResponse[] }>>(
                  `/v1/api/shop/get-shop-has-product?product_type=${product_type}`,
            )
      }

      static async getShopInfoOfProduct({ shop_id, product_id }: { shop_id: string; product_id: string }) {
            return axiosCustom.get<TResponseApi<{ shop: ShopResponse }>>('/v1/api/shop/get-shop-product', {
                  params: { shop_id, product_id },
            })
      }

      static async getShopId({ shop_id }: { shop_id: string }) {
            return axiosCustom.get<TResponseApi<{ shop: ShopResponse }>>('/v1/api/shop/get-shop-id', { params: { shop_id } })
      }

      static async getShopAdmin() {
            return axiosCustom.get<TResponseApi<{ shopAdmin: ShopResponse }>>('/v1/api/shop/get-shop-admin')
      }

      static async getProductFilter({
            shop_id,
            sort,
            page,
            limit,
            inc,
      }: {
            shop_id: string
            sort: keyof TProductDetail
            page: number
            limit: number
            inc: number
      }) {
            return axiosCustom.get<TResponseApi<{ shop: ShopResponse }>>('/v1/api/shop/get-product-best-seller', {
                  params: { shop_id, sort, page, limit, inc },
            })
      }
}

export default ShopApi
