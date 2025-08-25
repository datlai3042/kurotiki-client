import { TCloudinaryImage } from '../../Customer/Sell/types/cloudinary.typs'
import { ShopResponse } from '../shop.type'
import { TRegisterFormBook } from './product.book.type'
import { IProductFood, ProductFoodForm } from './product.food.type'

export type ProductType = 'Book' | 'Food'
export type ProductForm = TRegisterFormBook | ProductFoodForm

export type TProductFull =
      | {
            _id: string
            shop_id: string
            product_name: string
            product_price: number
            product_thumb_image: {
                  secure_url: string
                  public_id: string
            }

            product_desc_image: {
                  secure_url: string
                  public_id: string
            }[]
            product_state: boolean
            isProductFull?: boolean
            expireAt?: Date
            product_type: string
            attribute: IProductBook
      }
      | undefined

export type TProductDetail = {
      _id: string
      product_name: string
      product_price: number
      product_thumb_image: {
            secure_url: string
            public_id: string
      }
      product_available: number
      product_votes: number
      product_desc_image: TCloudinaryImage[]
      product_state: boolean
      product_is_select: boolean
      product_date_create: Date

      product_is_bought: number
      product_type: ProductType
      attribute: IProductBook | IProductFood
      shop_id: ShopResponse
}

export type TypeBook = 'Novel' | 'Manga' | 'Detective'
export type TypeFood = 'Fast food' | 'Canned Goods' | 'Drinks'

export type IProductBook = {
      type: TypeBook
      publishing: string
      author: string
      page_number: number
      description: string
}

// export type TFormProduct = {
//       product_name: string

//       product_price: number | null
//       product_thumb_image: { secure_url: string; public_id: string }
//       product_image_desc: string[]
//       product_id: string
// }

export type TFormBook = {
      publishing: string
      author: string
      page_number: number
      description: string
}

//@type upload 1 hình
export type TProfileImage = {
      isUploadImage: boolean
      FileName: string
      FileLength: number
      info: {
            secure_url: string
            public_id: string
      }
}

//@type upload 1 mảng
export type UploadImages = {
      // secure_url: string
      // public_id: string
}
export type TChekUploadImage = {
      isUploadImage: boolean
}

export type TCheckDescriptionImage = TChekUploadImage & {
      numberImage: number
      info: {
            secure_url: string
            public_id: string
      }[]
}

export type TProductFormCommon = {
      product_id: string
      product_name: string
      product_price: number | null
      product_available: number
}

export interface ProductAttributeObject {
      [key: string]: string | number
}
