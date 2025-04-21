import React from 'react'
import image from '../assets/img/empty.jpg'
const NotificationEmpty = () => {
      return (
            <div className='w-full flex flex-col items-center gap-[12px]'>
                  <span className='font-bold text-[13px] text-text-theme'>Không có thông báo</span>
                  <img src={image} className='w-full object-cover' />
            </div>
      )
}

export default NotificationEmpty
