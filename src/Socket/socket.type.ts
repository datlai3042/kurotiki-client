import { NotificationType } from "../apis/notification.service"
import { NotificationMessage, NotificationProduct } from "../types/notification.type"
import { ProductType } from "../types/product/product.type"
import { UserResponse } from "../types/user.type"

export type SocketSoldProduct = {

      type: NotificationType
      info: NotificationMessage
}