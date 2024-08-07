import { Link } from 'react-router-dom'
import { NotificationMessage } from '../../../types/notification.type'
import { convertDateToStringFull } from '../../../utils/date.utils'
import { renderStringNotificationType } from '../../../utils/notification.utit'

type TProps = {
      notification: NotificationMessage
}

const NotificationSystem = (props: TProps) => {
      const { notification } = props
      return (
            <Link to={`/customer/notification#${notification._id}`} className='w-full h-full flex flex-col gap-[8px]'>
                  <p className='w-full flex justify-between'>
                        <span>{renderStringNotificationType({ notification_type: notification.notification_attribute })}</span>
                        <span>{convertDateToStringFull(notification.notification_creation_time)}</span>
                  </p>
                  <span>{notification.notification_attribute.notification_content}</span>
            </Link>
      )
}

export default NotificationSystem
