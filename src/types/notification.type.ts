import { TProductFull } from "./product/product.type"
import { UserResponse } from "./user.type"

export type Notification = {
      notification_count: number
      notifications_message: [NotificationMessage]
}

export type NotificationMessage = {
      notification_isRead: boolean
      notification_attribute: NotificationAttribute
      notification_creation_time: Date
      new: boolean,
      _id: string
}

interface NotificationSystem {
      notification_type: 'SYSTEM'
      notification_content: string
}

interface NotificationUser {
      notification_type: 'USER'
      notification_content: string
}

export type NotificationProduct = {
      notification_type: 'PRODUCT'
      product_id: TProductFull,
      notification_content: string
      product_name: string
      product_quantity: number

      order_id: string
}

export type NotificationShop = {
      notification_type: 'SHOP'
      notification_content: string
      product_name: string
      product_quantity: number
      product_image: string
      order_id: string
      order_product_id: string
      user_buy_id: string
      buyer_info: UserResponse
}

export type NotificationAdmin = {
      notification_type: 'ADMIN'
      notification_content: string
      notification_sender: string
}

export type NotificationAttribute = NotificationSystem | NotificationProduct | NotificationAdmin | NotificationShop | NotificationUser
