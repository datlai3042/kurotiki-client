import React from 'react'
import { NotificationMessage } from '../../../types/notification.type'
import { Link } from 'react-router-dom'
import { renderStringNotificationType } from '../../../utils/notification.utit'
import { convertDateToStringFull } from '../../../utils/date.utils'

type TProps = {
      notification: NotificationMessage
}

const NotificationUser = (props: TProps) => {
      const { notification } = props
      return (
            <Link to={`/customer/notification#${notification._id}`} className='w-full h-full flex flex-col gap-[5px]'>
                  <p className='w-full flex justify-between font-semibold'>
                        <span>{renderStringNotificationType({ notification_type: notification.notification_attribute })}</span>
                        <span className='text-[11px] opacity-60'>{convertDateToStringFull(notification.notification_creation_time)}</span>
                  </p>
                  <span className='text-color-main font-semibold'>{notification.notification_attribute.notification_content}</span>
            </Link>
      )
}

export default NotificationUser
