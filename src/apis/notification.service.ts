import { limitNotification } from '../constant/notification.constant'
import { TResponseApi } from '../types/axiosResponse'
import { CartProduct } from '../types/cart.type'
import { Notification } from '../types/notification.type'
import { OrderItem } from '../types/order.type'
import { TProductDetail } from '../types/product/product.type'
import axiosCustom from './http'

export type NotificationType = 'PRODUCT' | 'SYSTEM' | 'ADMIN' | 'SHOP' | 'USER'

class NotificationService {

      

      static async getMyNotification({ page, type, limit = limitNotification }: { page: number; type: NotificationType; limit: number }) {
            return axiosCustom.get<
                  TResponseApi<{ notifications: { notification: Notification; total_notification_type: number; total_page: number } }>
            >(`/v1/api/notification/get-my-notification?page=${page}&type=${type}&limit=${limit}`)
      }

      static async getMyShopNotification({ order_product_id }: { order_product_id: string }) {
            return axiosCustom.get<
                  TResponseApi<{
                        myNotificationShop: { product_sell: { product: CartProduct; _id: string; product_doc: TProductDetail }[] }
                  }>
            >(`/v1/api/notification/get-my-shop-notifications/${order_product_id}`)
      }

      static async readNotification({ notification_id }: { notification_id: string }) {
            return axiosCustom.post<TResponseApi<{ message: string }>>(`/v1/api/notification/read-notification/${notification_id}`)
      }

      static async deleteNotification({ notification_id }: { notification_id: string }) {
            return axiosCustom.post<TResponseApi<{ message: string }>>(`/v1/api/notification/delete-notification/${notification_id}`)
      }
}

export default NotificationService
