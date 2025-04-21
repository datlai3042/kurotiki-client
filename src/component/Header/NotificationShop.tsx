import { useQuery } from '@tanstack/react-query'
import React from 'react'
import NotificationService from '../../apis/notification.service'
import { renderStringNotificationType } from '../../utils/notification.utit'
import { NotificationAttribute, NotificationMessage, NotificationShop as TNotificationShop } from '../../types/notification.type'
import { Link } from 'react-router-dom'
import { convertDateToStringFull } from '../../utils/date.utils'
import { ArrowBigUp } from 'lucide-react'
import NotificationSkeleton from '../../Customer/CustomerNotification/NotificationSkeleton'

type TProps = {
      orderProductId: string
      notification: NotificationMessage
}

const NotificationShop = (props: TProps) => {
      const {
            orderProductId,
            notification: { notification_attribute, _id, notification_creation_time },
      } = props

      return (
            <Link to={`/customer/notification#${_id}`} className='w-full h-full flex flex-col gap-[2px]'>
                  <div className='flex w-full justify-between font-semibold'>
                        <p className='mb-[4px] flex justify-between gap-[4px] '>
                              <span>
                                    {renderStringNotificationType({
                                          notification_type: notification_attribute as NotificationAttribute,
                                    })}
                              </span>
                        </p>
                        <span className='text-[11px] opacity-60'>{convertDateToStringFull(notification_creation_time)}</span>

                  </div>
                  <div className='flex gap-[12px]'>
                        <header className='w-full flex flex-col text-[12px]'>
                              <span>{notification_attribute.notification_content}</span>

                              <div className=' flex flex-col gap-[4px] '>
                                    <div style={{ whiteSpace: 'break-spaces' }} className=''>
                                          {(notification_attribute as TNotificationShop).product_name}
                                    </div>

                                    <p>
                                          <span>Giá:</span>
                                          <span>{(notification_attribute as TNotificationShop).product_quantity}</span>
                                    </p>
                              </div>
                        </header>
                        <div className='' key={_id}>
                              {
                                    <div className='flex flex-col  gap-[6px]'>
                                          <div className='w-[80px] aspect-square'>
                                                <img
                                                      src={(notification_attribute as TNotificationShop).product_image}
                                                      className='w-full  min-h-full h-full'
                                                      alt='product'
                                                />
                                          </div>
                                    </div>
                              }
                        </div>
                  </div>
            </Link>
      )
}

export default NotificationShop
