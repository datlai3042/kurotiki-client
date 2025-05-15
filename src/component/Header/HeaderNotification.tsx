import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { Bell } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import NotificationService, { NotificationType } from '../../apis/notification.service'
import { convertDateToStringFull } from '../../utils/date.utils'
import { useLocation, useMatch } from 'react-router-dom'
import NotificationProduct from './Components/NotificationProduct'
import NotificationShop from './NotificationShop'
import NotificationSystem from './Components/NotificationSystem'
import { useDispatch, useSelector } from 'react-redux'
import { onAddPageNotification, onSocketAddNotification } from '../../Redux/notification.slice'
import { NotificationAttribute } from '../../types/notification.type'
import { RootState } from '../../store'
import { useInViewport } from '@mantine/hooks'
import NotificationSkeleton from '../../Customer/CustomerNotification/NotificationSkeleton'
import { v4 } from 'uuid'
import { Tabs } from 'antd'
import NotificationUser from './Components/NotificationUser'
import NotificationEmpty from './Components/NotificationEmpty'
const LIMIT = 20

const items: { key: NotificationType; value: NotificationType; label: string }[] = [
      { key: 'USER', value: 'USER', label: 'Cá nhân' },
      { key: 'SHOP', value: 'SHOP', label: 'Cửa hàng' },
      { key: 'PRODUCT', value: 'PRODUCT', label: 'Sản phẩm' },
      { key: 'ADMIN', value: 'ADMIN', label: 'Admin' },
      { key: 'SYSTEM', value: 'SYSTEM', label: 'Hệ thống' },
]

const HeaderNotification = () => {
      const [showNotification, setShowNotification] = useState<boolean>(false)
      const match = useMatch('/')
      const boxNotificationRef = useRef<HTMLDivElement>(null)
      const dispatch = useDispatch()
      const [tab, setTab] = useState<NotificationType>('SHOP')
      const notificationCache = useSelector((state: RootState) => state.notifcation[tab])
      const { ref, inViewport } = useInViewport()
      const countRef = useRef<number | null>(null)
      const {pathname} = useLocation()
      // const getMyNotification = useQuery({
      //       queryKey: ['/v1/api/notification/get-my-notification'],
      //       queryFn: () => NotificationService.getMyNotification({ page: 1, limit: 20, type: 'SHOP' }),
      //       enabled: notificationCache.length === 0,
      // })
      const getMyNotification = useInfiniteQuery({
            queryKey: ['/v1/api/notification/get-my-notification', tab],
            enabled: notificationCache.cache.length === 0 && notificationCache.page >= 1 && !inViewport,
            queryFn: ({ pageParam = notificationCache.page }) =>
                  NotificationService.getMyNotification({ page: pageParam, limit: LIMIT, type: tab }),
            initialPageParam: notificationCache.page,
            getNextPageParam: (lastPage, allPages) => {
                  if (allPages.length < lastPage.data.metadata.notifications.total_page) {
                        return allPages.length + 1
                  }
                  return undefined
            },
      })

      const onControllShowNotification = () => {
            setShowNotification((prev) => !prev)
      }

      useEffect(() => {
            if(showNotification) {
                  setShowNotification(false)
            }
      }, [pathname])

      useEffect(() => {
            if (getMyNotification.isSuccess) {
                  const lastPage =
                        getMyNotification.data.pages[getMyNotification.data.pages.length - 1].data.metadata.notifications.notification
                              .notifications_message

                  const page = getMyNotification.data.pages.length
                  if (page > notificationCache.page || (notificationCache.page === 1 && notificationCache.cache.length === 0)) {
                        dispatch(
                              onAddPageNotification({
                                    type: tab,
                                    data: lastPage,
                                    page: page,
                              }),
                        )
                  }
                  if (!countRef.current) {
                        getMyNotification.data?.pages.flatMap(
                              (p) => (countRef.current = p.data.metadata.notifications.notification.notification_count),
                        )
                  }
            }
      }, [getMyNotification.isSuccess, getMyNotification.isPending, getMyNotification.data])

      useEffect(() => {
            if (!match) {
                  setShowNotification(false)
            }
      }, [match])

      useEffect(() => {
            const onClickGlobal = (e: MouseEvent) => {
                  if (boxNotificationRef.current && !boxNotificationRef.current.contains(e.target as Node)) {
                        setShowNotification(false)
                  }
            }
            if (!showNotification) {
                  document.removeEventListener('click', onClickGlobal)
                  return
            }
            document.addEventListener('click', onClickGlobal)
            return () => {
                  document.removeEventListener('click', onClickGlobal)
            }
      }, [showNotification])

      useEffect(() => {
            if (inViewport) {
                  getMyNotification.fetchNextPage()
            }
      }, [inViewport])

      return (
            <div ref={boxNotificationRef} className='relative'>
                  <div className='relative w-max h-max cursor-pointer'>
                        <Bell color='blue' size={20} onClick={onControllShowNotification} />
                        <div className='absolute top-[-12px] right-[-12px] w-[20px] h-[20px] text-[10px] bg-red-500 text-white rounded-full flex items-center justify-center'>
                              {countRef.current ? (countRef.current >= 99 ? '99+' : countRef.current) : 0}
                        </div>
                  </div>
                  {showNotification && (
                        <div
                              onClick={() => setShowNotification(false)}
                              className='top-[0px] fixed left-0 right-0 bg-[#030512c4] h-[100vh]'
                        ></div>
                  )}
                  <div
                        style={{ display: showNotification ? 'flex' : 'none' }}
                        ref={boxNotificationRef}
                        className='xl:animate-mountComponent rounded-[8px] fixed left-[10px] top-[65px] md:absolute md:top-[37px] md:left-auto h-[80vh] md:right-[-20px] xl:right-0 w-[95vw] md:w-[430px] min-h-[200px] bg-color-section-theme text-text-theme shadow-2xl z-[500] '
                  >
                        <div onClick={(e) => e.stopPropagation()} className='relative w-full  rounded-[8px] pb-[10px]  flex flex-col '>
                              <p className='sticky px-[12px]  rounded-[8px] text-text-theme bg-color-section-theme top-[0px] left-[0px]  w-full  flex items-center  text-[16px] '>
                                    <Tabs
                                          style={{ width: '100%', overflow: 'hidden' }}
                                          defaultActiveKey={tab}
                                          onChange={(value) => setTab(value as NotificationType)}
                                          items={items}
                                    />
                              </p>
                              <div className='h-[70vh] overflow-auto flex flex-col gap-[6px]'>
                                    {notificationCache.cache?.length > 0 ? (
                                          notificationCache.cache.map((notification, index) => {
                                                return (
                                                      <div className='flex flex-col h-max w-full px-[12px]' key={notification._id}>
                                                            <div className='flex justify-between w-full h-full flex-col gap-[24px]'>
                                                                  {notification.notification_attribute.notification_type === 'SYSTEM' && (
                                                                        <div
                                                                              className='border-b-[1px] border-[var(--border-color-input)] py-[12px]'
                                                                              key={notification._id}
                                                                        >
                                                                              <NotificationSystem
                                                                                    // orderProductId={notification.notification_attribute.order_id}
                                                                                    notification={notification}
                                                                              />
                                                                        </div>
                                                                  )}

                                                                  {notification.notification_attribute.notification_type === 'PRODUCT' && (
                                                                        <div
                                                                              className='border-b-[1px] border-[var(--border-color-input)] py-[12px]'
                                                                              key={notification.notification_attribute.product_id?._id}
                                                                        >
                                                                              <NotificationProduct
                                                                                    notificationProduct={
                                                                                          notification.notification_attribute
                                                                                    }
                                                                                    notification={notification}
                                                                              />
                                                                        </div>
                                                                  )}
                                                                  {notification.notification_attribute.notification_type === 'USER' && (
                                                                        <div
                                                                              className='border-b-[1px] border-[var(--border-color-input)] py-[12px]'
                                                                              key={notification._id}
                                                                        >
                                                                              <NotificationUser notification={notification} />
                                                                        </div>
                                                                  )}
                                                                  {notification.notification_attribute.notification_type === 'SHOP' && (
                                                                        <div
                                                                              className='border-b-[1px] border-[var(--border-color-input)] py-[12px]'
                                                                              key={notification.notification_attribute.order_id}
                                                                        >
                                                                              <NotificationShop
                                                                                    orderProductId={
                                                                                          notification.notification_attribute.order_id
                                                                                    }
                                                                                    notification={notification}
                                                                              />
                                                                        </div>
                                                                  )}
                                                            </div>
                                                            {/* <div className=''>
                                                            <p>{notification.notification_attribute.notification_content}</p>
                                                      </div> */}
                                                      </div>
                                                )
                                          })
                                    ) : getMyNotification.isPending ? (
                                          <div className='flex flex-col gap-[10px]'>
                                                <div className='w-full  px-[12px] mt-[10px]'>
                                                      <NotificationSkeleton />
                                                </div>

                                                <div className='w-full  px-[12px] mt-[10px]'>
                                                      <NotificationSkeleton />
                                                </div>
                                                <div className='w-full  px-[12px] mt-[10px]'>
                                                      <NotificationSkeleton />
                                                </div>

                                                <div className='w-full  px-[12px] mt-[10px]'>
                                                      <NotificationSkeleton />
                                                </div>
                                          </div>
                                    ) : (
                                          <NotificationEmpty />
                                    )}

                                    {notificationCache.cache.length > 0 && getMyNotification.hasNextPage && (
                                          <div ref={ref} className='w-full h-[20px] px-[12px] mt-[10px]'>
                                                <NotificationSkeleton />
                                          </div>
                                    )}
                              </div>
                        </div>
                  </div>
            </div>
      )
}

// export default HeaderNotification

// import React from 'react'

// const HeaderNotification = () => {
//       return <div>HeaderNotification</div>
// }

export default HeaderNotification
