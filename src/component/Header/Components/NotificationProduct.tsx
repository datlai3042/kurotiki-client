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
      const limit = 10
      const [page, setPage] = useState<number>(1)
      const [heightNotification, setHeightNotification] = useState<number>(180)
      const getOrderInfo = useQuery({
            queryKey: ['/v1/api/order/get-order-info', notificationProduct.product_id],
            queryFn: () => OrderService.getOrderInfo({ order_id: notificationProduct.product_id }),
            staleTime: 1000 * 60 * 5,
      })


      useEffect(() => {
            if (getOrderInfo.isSuccess) {
                  setHeightNotification(getOrderInfo?.data?.data?.metadata?.getOrderInfo?.order_products[0].products.length * 180)
            }
      }, [getOrderInfo.isSuccess, heightNotification])

      return (
            <section
                  style={{
                        height: heightNotification === 180 ? '100%' : heightNotification,
                  }}
                  className={`w-full  flex flex-col gap-[12px]`}
                  {...propsElement}
            >
                  {/* <NotificationSkeleton /> */}
                  <p>{notification._id}</p>
                  <header className='w-full flex justify-between text-[12px]'>
                        <p className='flex-1 flex flex-col xl:flex-row gap-[4px] items-center'>
                              <span>
                                    {renderStringNotificationType({
                                          notification_type: notification.notification_attribute as NotificationAttribute,
                                    })}
                              </span>
                              <span>{notification.notification_attribute.notification_content}</span>
                              <ArrowBigDown strokeWidth={1.75} color='green' />
                        </p>
                  </header>
                  {getOrderInfo.isSuccess &&
                        getOrderInfo.data.data.metadata.getOrderInfo &&
                        getOrderInfo.data.data.metadata.getOrderInfo.order_products!.map((p) => {
                              return p.products!.map((pz) => {
                                    return (
                                          <div className='flex-1' key={pz._id}>
                                                {
                                                      <div className='flex flex-col xl:flex-row gap-[6%]'>
                                                            <Link
                                                                  to={{ pathname: `/customer/notification`, hash: `#${notification._id}` }}
                                                                  className='w-full xl:w-[100px] h-[120px] xl:h-[100px]'
                                                            >
                                                                  <img
                                                                        src={pz.product_id.product_thumb_image.secure_url}
                                                                        className='w-full  min-h-full h-full'
                                                                        alt='product'
                                                                  />
                                                            </Link>
                                                            <div className='flex flex-col gap-[4px] justify-between'>
                                                                  <div className=''>
                                                                        <span>{pz.product_id.product_name}</span>
                                                                  </div>
                                                                  <div className='flex gap-[16px]'>
                                                                        <span>Số lượng: {pz.quantity}</span>

                                                                        <span>Giá {pz.quantity * pz.product_id.product_price}</span>
                                                                  </div>
                                                                  <div className='flex gap-[6px]'>
                                                                        <span>Shop:</span>
                                                                        <div className='flex gap-[4px] items-center'>
                                                                              <img
                                                                                    src={
                                                                                          pz.shop_id.shop_avatar?.secure_url ||
                                                                                          pz.shop_id.shop_avatar_default
                                                                                    }
                                                                                    className='w-[12px] h-[12px] rounded-full'
                                                                                    alt=''
                                                                              />
                                                                              <span>{pz.shop_id.shop_name}</span>
                                                                        </div>
                                                                  </div>
                                                                  <p className='flex flex-col xl:flex-row xl:gap-[4px]'>
                                                                        <span>Thời gian mua: {'  '}</span>
                                                                        <span>
                                                                              {convertDateToStringFull(
                                                                                    notification.notification_creation_time,
                                                                              )}
                                                                        </span>
                                                                  </p>
                                                            </div>
                                                      </div>
                                                }
                                          </div>
                                    )
                              })
                        })}

                  {getOrderInfo.isSuccess && !getOrderInfo.data.data.metadata.getOrderInfo && <div>Không tìm thấy dữ liệu</div>}
                  {getOrderInfo.isPending && <NotificationSkeleton />}
            </section>
      )
}

export default NotificationProduct
