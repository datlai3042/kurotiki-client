import { NotificationAttribute } from '../types/notification.type'

export const renderStringNotificationType = ({ notification_type }: { notification_type: NotificationAttribute }): string => {
      if (notification_type.notification_type === 'PRODUCT') {
            return '[Thông báo sản phẩm]'
      }

      if (notification_type.notification_type === 'SHOP') {
            return '[Thông báo My Shop]'
      }
      if (notification_type.notification_type === 'ADMIN') {
            return '[Thông báo của admin]'
      }
      if (notification_type.notification_type === 'SYSTEM') {
            return '[Thông báo của hệ thống]'
      }
      if (notification_type.notification_type === 'USER') {
            return '[Thông báo của cá nhân]'
      }
      return ''
}
