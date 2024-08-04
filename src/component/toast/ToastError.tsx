import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { X } from 'lucide-react'
import { RootState } from '../../store'
import { removeOneToast } from '../../Redux/toast'
import ToastWrapper from './ToastWrapper'

import ImageLogo from '../../assets/images/toast/toast_error.png'
import { ToastErrorCore } from './ToastProvider'

type TProps = {
      toast_item: ToastErrorCore
      index: number
}

const ToastErrorItem = (props: TProps) => {
      const { toast_item, index } = props
      const toast_timer = useSelector((state: RootState) => state.toast.toast_timer)
      const dispatch = useDispatch()

      const [count, setCount] = useState<number>(toast_timer)

      const timer = useRef<NodeJS.Timeout | null>(null)

      useEffect(() => {
            timer.current = setInterval(() => {
                  setCount((prev) => {
                        return (prev -= 1)
                  })
            }, 1000)

            return () => {
                  clearInterval(timer.current as NodeJS.Timeout)
            }
      }, [])

      const onDeleteToast = () => {
            dispatch(removeOneToast({ toast_item_id: toast_item._id }))
      }

      return (
            <ToastWrapper toast_item_id={toast_item._id} indexItem={index}>
                  <div className='relative h-[8rem]  p-[1rem] flex justify-between gap-[1.6rem] rounded-xl text-[#fff] bg-bg-input-theme text-[1.4rem]'>
                        <button
                              onClick={onDeleteToast}
                              className='absolute right-[2rem] top-[1rem] w-[2.4rem] h-[2.4rem]  rounded-full  flex items-center justify-center hover:bg-[#f1f4fb]'
                        >
                              <X size={14} style={{ color: 'var(--toast-error)' }} />
                        </button>
                        <div className='flex items-center min-w-[50px]'>
                              <img src={ImageLogo} width={50} height={50} alt='toast lok' className='w-[40px] h-[40px]' />
                        </div>
                        <div className='flex-1  flex flex-col justify-center min-w-[70%] max-w-[90%] gap-[.4rem]'>
                              <span className=' text-toast-error font-semibold text-[15px] max-w-[80%] break-words'>
                                    {toast_item.toast_title}
                              </span>
                              <span className='opacity-80  font-medium max-w-[80%] text-[13px] break-words text-[#000]'>
                                    {toast_item.core.message}
                              </span>
                        </div>

                        <div className='bg-toast-error text-[#fff] w-[24px] h-[24px] text-[11px] rounded-full flex items-center justify-center absolute bottom-[1rem] right-[2rem]'>
                              {count}
                        </div>
                  </div>
            </ToastWrapper>
      )
}

export default ToastErrorItem
