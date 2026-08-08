import { TCloudinaryImage } from '../Customer/Sell/types/cloudinary.typs'
import { CartProduct } from './cart.type'
import { TProductDetail } from './product/product.type'
import { UserResponse } from './user.type'

export type ShopResponse = {
      _id: string
      owner: UserResponse
      __v: number
      createdAt: Date
      shop_avatar: TCloudinaryImage
      shop_avatar_default: string
      shop_avatar_used: TCloudinaryImage[]
      shop_name: string
      shop_vote: number
      shop_count_total_vote: number
      updatedAt: string
      shop_products: TProductDetail[]
      shop_description: string
      shop_count_product: number
      shop_order: CartProduct[],
      shop_order_count: number
}
