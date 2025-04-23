import React, { useEffect, useState } from 'react'
import { convertDateToStringFull } from '../../../utils/date.utils'
import { NotificationAttribute, NotificationMessage, NotificationProduct as TNotificationProduct } from '../../../types/notification.type'
import { useMutation, useQuery } from '@tanstack/react-query'
import OrderService from '../../../apis/Order.service'
import { renderStringNotificationType } from '../../../utils/notification.utit'
import { Link } from 'react-router-dom'
import { ArrowBigDown } from 'lucide-react'
import NotificationSkeleton from '../../../Customer/CustomerNotification/NotificationSkeleton'

type TProps = {
      notificationProduct: TNotificationProduct
      notification: NotificationMessage
} & React.HTMLAttributes<HTMLElement>

const NotificationProduct = (props: TProps) => {
      const { notification, notificationProduct, ...propsElement } = props
      return (
            <Link to={`/customer/notification#${notification._id}`} className='w-full h-full flex flex-col gap-[2px]'>
                  <div className='flex w-full justify-between font-semibold'>
                        <p className='mb-[4px] flex justify-between gap-[4px] '>
                              <span>
                                    {renderStringNotificationType({
                                          notification_type: notification.notification_attribute as NotificationAttribute,
                                    })}
                              </span>
                        </p>
                        <span className='text-[11px] opacity-60'>{convertDateToStringFull(notification.notification_creation_time)}</span>
                  </div>
                  <div className='flex gap-[12px]'>
                        <div className='w-full flex flex-col gap-[8px] md:gap-0 text-[12px]'>
                              <span>{notification.notification_attribute.notification_content}</span>

                              <div className=' flex flex-col gap-[4px] '>
                                    <div style={{ whiteSpace: 'break-spaces' }} className=''>
                                          {notificationProduct?.product_id?.product_name}
                                    </div>
                              </div>
                              <Link
                                    to={`/order-check/${(notification.notification_attribute as TNotificationProduct).order_id}`}
                                    className='w-max hover:border-transparent hover:bg-color-main hover:text-[#fff] mt-auto p-[6px] border-[1px] border-[var(--border-color-input)] rounded-[4px] bg-color-main text-[#fff] md:bg-transparent md:text-text-theme'
                              >
                                    Xem hóa đơn
                              </Link>
                        </div>
                        <div className='' key={notification._id}>
                              {
                                    <div className='flex flex-col  gap-[6px]'>
                                          <div className='w-[80px] aspect-square'>
                                                <img
                                                      src={notificationProduct?.product_id?.product_thumb_image?.secure_url}
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

export default NotificationProduct
