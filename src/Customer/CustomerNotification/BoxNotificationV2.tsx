import { History, Home, Notebook, Store, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import BoxBuild from '../../component/BoxUi/BoxBuild'
import NotificationSection from './NotificationSection'

type NotificationTypeActive =
      | {
              title: 'Thông báo chung'
              notification: 'COMMON'
        }
      | {
              title: 'Thông báo cá nhân'
              notification: 'USER'
        }
      | {
              title: 'Thông báo sản phẩm'
              notification: 'PRODUCT'
        }
      | {
              title: 'Thông báo hệ thống'
              notification: 'SYSTEM'
        }
      | { title: 'Thông báo Shop'; notification: 'SHOP' }

const BoxNotification = () => {
      const location = useLocation().hash.slice(1)

      const [activeNotification, setActiveNotification] = useState<NotificationTypeActive>({
            title: 'Thông báo chung',
            notification: 'COMMON',
      })

      const wrapperRef = useRef<HTMLDivElement>(null)

      useEffect(() => {
            if (wrapperRef.current) {
                  const width = wrapperRef.current.getBoundingClientRect().width
                  let numberTranslate = 0
                  if (activeNotification.title === 'Thông báo chung') {
                        numberTranslate = 0
                  }
                  if (activeNotification.title === 'Thông báo cá nhân') {
                        numberTranslate = 1
                  }

                  if (activeNotification.title === 'Thông báo sản phẩm') {
                        numberTranslate = 2
                  }

                  if (activeNotification.title === 'Thông báo hệ thống') {
                        numberTranslate = 3
                  }

                  if (activeNotification.title === 'Thông báo Shop') {
                        numberTranslate = 4
                  }
                  wrapperRef.current.style.transform = `translateX(${-width * numberTranslate}px)`
            }
      }, [activeNotification])

      const styleEffect = {
            activeHash: (notification: string) => (notification === location ? 'bg-blue-100' : ''),
      }

      return (
            <div className='relative w-full  pb-[10px] h-max flex flex-col gap-[16px] '>
                  <div className='w-full min-h-[60px]  xl:min-h-[80px] h-[40px] overflow-x-scroll flex items-center bg-[#ffffff] gap-[24px] flex-nowrap '>
                        <button
                              className={`${
                                    activeNotification.title === 'Thông báo chung' ? ' border-blue-500' : 'border-transparent'
                              } h-full flex items-center justify-center xl:justify-normal border-b-[2px] px-[24px]`}
                              onClick={() => setActiveNotification({ title: 'Thông báo chung', notification: 'COMMON' })}
                              title={'Thông báo chung'}
                        >
                              <Home size={28} />
                        </button>

                        <button
                              className={`${
                                    activeNotification.title === 'Thông báo cá nhân' ? ' border-blue-500' : 'border-transparent'
                              } h-full flex items-center justify-center xl:justify-normal border-b-[2px] px-[24px]`}
                              onClick={() => setActiveNotification({ title: 'Thông báo cá nhân', notification: 'USER' })}
                              title={'Thông báo cá nhân'}
                        >
                              <User size={28} />
                        </button>

                        <button
                              className={`${
                                    activeNotification.title === 'Thông báo sản phẩm' ? ' border-blue-500' : 'border-transparent'
                              } h-full flex items-center justify-center xl:justify-normal border-b-[2px] px-[24px]`}
                              onClick={() => setActiveNotification({ title: 'Thông báo sản phẩm', notification: 'PRODUCT' })}
                              title={'Thông báo sản phẩm'}
                        >
                              <Notebook size={28} />
                        </button>

                        <button
                              className={`${
                                    activeNotification.title === 'Thông báo hệ thống' ? ' border-blue-500' : 'border-transparent'
                              } h-full flex items-center justify-center xl:justify-normal border-b-[2px] px-[24px]`}
                              onClick={() => setActiveNotification({ title: 'Thông báo hệ thống', notification: 'SYSTEM' })}
                              title={'Thông báo hệ thông'}
                        >
                              <History size={28} />
                        </button>

                        <button
                              className={`${
                                    activeNotification.title === 'Thông báo Shop' ? ' border-blue-500' : 'border-transparent'
                              } h-full flex items-center justify-center xl:justify-normal border-b-[2px] px-[24px]`}
                              onClick={() => setActiveNotification({ title: 'Thông báo Shop', notification: 'SHOP' })}
                              title={'Thông báo Shop'}
                        >
                              <Store size={28} />
                        </button>
                  </div>

                  <div className='w-full  overflow-hidden'>
                        <div className='w-full min-h-[600px] h-max flex transition-all duration-500      ' ref={wrapperRef}>
                              <div className='min-w-full'>
                                    {activeNotification.title === 'Thông báo chung' && (
                                          <div className='w-full h-[300px]'>
                                                <BoxBuild />
                                          </div>
                                    )}
                              </div>

                              <div className='min-w-full'>
                                    {activeNotification.title === 'Thông báo cá nhân' && (
                                          <div className='w-full h-[300px]'>
                                                {/* <BoxBuild /> */}
                                                <NotificationSection type='USER' />
                                          </div>
                                    )}
                              </div>

                              <div className='min-w-full'>
                                    {activeNotification.title === 'Thông báo sản phẩm' && <NotificationSection type='PRODUCT' />}
                              </div>

                              <div className='min-w-full'>
                                    {activeNotification.title === 'Thông báo hệ thống' && <NotificationSection type='SYSTEM' />}
                              </div>

                              <div className='min-w-full'>
                                    {activeNotification.title === 'Thông báo Shop' && <NotificationSection type='SHOP' />}
                              </div>
                        </div>
                  </div>
            </div>
      )
}

export default BoxNotification

// {
//       getMyNotification.isSuccess &&
//             getMyNotification.data?.data.metadata.notifications &&
//             getMyNotification.data.data.metadata.notifications.notifications_message.map((notification) => {
//                   return (
//                         <div className='flex flex-col min-h-[360px]  h-max w-full  my-[18px] bg-[#ffffff]' key={notification._id}>
//                               <div style={{ direction: 'ltr' }} className='flex justify-between w-full h-full flex-col gap-[24px] '>
//                                     {notification.notification_attribute.notification_type === 'SYSTEM' && (
//                                           <div
//                                                 id={notification._id}
//                                                 className={`${styleEffect.activeHash(notification._id)} min-h-full h-max p-[12px_10px]`}
//                                           >
//                                                 <NotificationSystem
//                                                       // orderProductId={notification.notification_attribute.order_id}
//                                                       notification={notification}
//                                                 />
//                                           </div>
//                                     )}

//                                     {notification.notification_attribute.notification_type === 'PRODUCT' && (
//                                           <div
//                                                 id={notification._id}
//                                                 className={`${styleEffect.activeHash(notification._id)} min-h-full m-max  p-[12px_10px]`}
//                                           >
//                                                 <NotificationProduct
//                                                       key={notification.notification_attribute.product_id}
//                                                       notificationProduct={notification.notification_attribute}
//                                                       notification={notification}
//                                                 />
//                                           </div>
//                                     )}

//                                     {notification.notification_attribute.notification_type === 'SHOP' && (
//                                           <div
//                                                 id={notification?._id}
//                                                 className={`${styleEffect.activeHash(notification?._id)}  p-[12px_10px]`}
//                                           >
//                                                 {/* <span>{notification.notification_attribute.order_id}</span> */}
//                                                 <NotificationShop
//                                                       orderProductId={notification.notification_attribute.order_id}
//                                                       notification={notification}
//                                                 />
//                                           </div>
//                                     )}
//                               </div>
//                         </div>
//                   )
//             })
// }
