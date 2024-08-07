// import { useQuery } from '@tanstack/react-query'
// import { Bell } from 'lucide-react'
// import React, { useEffect, useRef, useState } from 'react'
// import NotificationService from '../../apis/notification.service'
// import { convertDateToStringFull } from '../../utils/date.utils'
// import { useMatch } from 'react-router-dom'
// import NotificationProduct from './Components/NotificationProduct'
// import NotificationShop from './NotificationShop'
// import NotificationSystem from './Components/NotificationSystem'

// const HeaderNotification = () => {
//       const [showNotification, setShowNotification] = useState<boolean>(false)
//       const match = useMatch('/')
//       const boxNotificationRef = useRef<HTMLDivElement>(null)

//       const getMyNotification = useQuery({
//             queryKey: ['/v1/api/notification/get-my-notification'],
//             queryFn: () => NotificationService.getMyNotification(),
//       })

//       const onControllShowNotification = () => {
//             setShowNotification((prev) => !prev)
//       }

//       useEffect(() => {
//             if (getMyNotification.isSuccess) {
//                  console.log(([^)]+))
//             }
//       }, [getMyNotification.isSuccess])

//       useEffect(() => {
//             if (!match) {
//                   setShowNotification(false)
//             }
//       }, [match])

//       useEffect(() => {
//             const onClickGlobal = (e: MouseEvent) => {
//                  console.log(([^)]+))
//                   if (boxNotificationRef.current && !boxNotificationRef.current.contains(e.target as Node)) {
//                         setShowNotification(false)
//                   }
//             }
//            console.log(([^)]+))
//             if (!showNotification) {
//                   document.removeEventListener('click', onClickGlobal)
//                   return
//             }
//             document.addEventListener('click', onClickGlobal)
//             return () => {
//                   document.removeEventListener('click', onClickGlobal)
//             }
//       }, [showNotification])

//       return (
//             <div ref={boxNotificationRef} style={{ direction: 'rtl' }} className='relative'>
//                   <div className='relative w-max h-max '>
//                         <Bell color='blue' size={28} onClick={onControllShowNotification} />
//                         <div className='absolute top-[-12px] right-[-12px] w-[18px] h-[18px] bg-red-400 text-white rounded-full flex items-center justify-center'>
//                               {getMyNotification.data?.data.metadata.notifications
//                                     ? getMyNotification.data?.data.metadata.notifications.notification_count
//                                     : 0}
//                         </div>
//                   </div>
//                   <div
//                         style={{ display: showNotification ? 'flex' : 'none' }}
//                         ref={boxNotificationRef}
//                         className='xl:animate-mountComponent absolute top-[30px] right-[-20px] xl:right-0 w-[240px] xl:w-[380px] h-[400px] bg-[#ffffff] shadow-2xl z-[500] overflow-y-scroll'
//                   >
//                         <div className='relative w-full  pb-[10px] h-[1000px] flex flex-col '>
//                               <p className='sticky top-[-1px] left-[0px]  w-full h-[30px] py-[4px] bg-[#f5f4f6] flex items-center justify-center text-[16px] font-extrabold'>
//                                     Thông báo của tôi
//                               </p>
//                               {getMyNotification.isSuccess &&
//                                     showNotification &&
//                                     getMyNotification.data?.data.metadata.notifications &&
//                                     getMyNotification.data.data.metadata.notifications.notifications_message.map((notification) => {
//                                           return (
//                                                 <div className='flex flex-col h-max w-full px-[12px] my-[18px]' key={notification._id}>
//                                                       <div
//                                                             style={{ direction: 'ltr' }}
//                                                             className='flex justify-between w-full h-full flex-col gap-[24px]'
//                                                       >
//                                                             {notification.notification_attribute.notification_type === 'SYSTEM' && (
//                                                                   <div className='min-h-[60px]'>
//                                                                         <NotificationSystem
//                                                                               // orderProductId={notification.notification_attribute.order_id}
//                                                                               notification={notification}
//                                                                         />
//                                                                   </div>
//                                                             )}

//                                                             {notification.notification_attribute.notification_type === 'PRODUCT' && (
//                                                                   <div
//                                                                         className='min-h-[360px] xl:min-h-[180px] '
//                                                                         key={notification.notification_attribute.product_id}
//                                                                   >
//                                                                         <NotificationProduct
//                                                                               notificationProduct={notification.notification_attribute}
//                                                                               notification={notification}
//                                                                         />
//                                                                   </div>
//                                                             )}

//                                                             {notification.notification_attribute.notification_type === 'SHOP' && (
//                                                                   <div
//                                                                         className='min-h-[360px] xl:min-h-[180px] '
//                                                                         key={notification.notification_attribute.order_id}
//                                                                   >
//                                                                         <NotificationShop
//                                                                               orderProductId={notification.notification_attribute.order_id}
//                                                                               notification={notification}
//                                                                         />
//                                                                   </div>
//                                                             )}
//                                                       </div>
//                                                       {/* <div className=''>
//                                                             <p>{notification.notification_attribute.notification_content}</p>
//                                                       </div> */}
//                                                 </div>
//                                           )
//                                     })}
//                         </div>
//                   </div>
//             </div>
//       )
// }

// export default HeaderNotification

import React from 'react'

const HeaderNotification = () => {
      return <div>HeaderNotification</div>
}

export default HeaderNotification
