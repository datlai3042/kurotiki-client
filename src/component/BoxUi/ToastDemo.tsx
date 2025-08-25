import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { removeToast } from '../../Redux/toast'
import { RootState } from '../../store'
import { ShieldAlert, ShieldCheck, ShieldX, X } from 'lucide-react'
import { DateTime } from 'luxon'
import { localDateTime } from '../../constant/local'
import { TToast } from '../Context/ToastContext'
type TProps = {
      toast: TToast
}

const ToastDemo = (props: TProps) => {
      const { toast } = props
      const dispatch = useDispatch()
      const timerToast = useSelector((state: RootState) => state.toast.timerToast)
      const timeOut = useRef<NodeJS.Timeout>()
      const timeInterval = useRef<NodeJS.Timeout>()
      const now = new Date()
      // const token = JSON.parse(localStorage.getItem('token') as string)
      const [show, setShow] = useState(true)
      const [time, setTime] = useState(timerToast)
      const [showDetail, setShowDetail] = useState(false)

      const handleControllCloseToast = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, id: string) => {
            e.stopPropagation()
            dispatch(removeToast({ id }))
      }

      useEffect(() => {
            timeOut.current = setTimeout(() => {
                  dispatch(removeToast({ id: toast.id }))
            }, timerToast * 1000)

            timeInterval.current = setInterval(() => {
                  setTime((prev) => (prev -= 1))
            }, 1000)

            return () => {
                  clearTimeout(timeOut.current)
                  clearInterval(timeInterval.current)
            }
      }, [])

      const handleOnMouseEnter = () => {
            clearInterval(timeInterval.current)
            clearTimeout(timeOut.current)
            setShowDetail(true)
      }

      const handleOnMouseLeave = () => {
            timeOut.current = setTimeout(() => {
                  dispatch(removeToast({ id: toast.id }))
                  setShow(false)
            }, time * 1000)

            timeInterval.current = setInterval(() => {
                  setTime((prev) => (prev -= 1))
            }, 1000)
            setShowDetail(false)
      }

      const styleEffect = {
            type_toast:
                  toast.type === 'SUCCESS'
                        ? '   text-blue-900 shadow-[0_10px_20px_rgba(240,_46,_170,_0.7)] shadow-blue-700 border-[2px] border-blue-500'
                        : toast.type === 'ERROR'
                        ? ' text-red-900 shadow-[0_10px_20px_rgba(240,_46,_170,_0.7)] shadow-red-700  border-[2px] border-red-500'
                        : '  text-orange-900 shadow-[0_10px_20px_rgba(240,_46,_170,_0.7)] shadow-orange-700  border-[2px] border-orange-500',
            type_toast_icon: toast.type === 'SUCCESS' ? '#2563eb' : toast.type === 'ERROR' ? ' rgb(239 68 68)' : 'rgb(249 115 22)',
            widthToastContainer: 'min-w-[250px]',
            bgBoxTime: toast.type === 'SUCCESS' ? ' bg-blue-500' : toast.type === 'ERROR' ? ' bg-red-500' : ' bg-orange-500',
            textColor: toast.type === 'SUCCESS' ? ' bg-blue-500 ' : toast.type === 'ERROR' ? ' bg-red-500' : ' bg-orange-500',
      }

      return (
            <>
                  {show && (
                        <div
                              onMouseEnter={handleOnMouseEnter}
                              onMouseLeave={handleOnMouseLeave}
                              className={`${styleEffect.type_toast} animate-toastAnimation min-w-[250px] max-w-[300px] bg-[#ffffff] pt-[8px] px-[6px] xl:pt-[16px] py-[24px] xl:px-[12px]   relative    h-max   rounded-lg transition-all duration-1000  flex items-center justify-center`}
                        >
                              <span
                                    style={{ width: `${276 / Math.ceil(time)}px` }}
                                    className={`${styleEffect.type_toast}  absolute top-[0px] left-0   h-[3px] transition-all duration-300`}
                              ></span>

                              <span
                                    style={{ width: `${276 / Math.ceil(time)}px` }}
                                    className={`${styleEffect.type_toast}  absolute bottom-[0px] left-0   h-[3px] transition-all duration-1000`}
                              ></span>

                              <div className='w-full flex gap-[8px] mt-[10px] items-center'>
                                    <div className='flex flex-col gap-[8px] h-max text-[13px]'>
                                          <div className=' flex gap-[8px] items-center'>
                                                <span>
                                                      {toast.type === 'SUCCESS' ? (
                                                            <ShieldCheck size={32} />
                                                      ) : toast.type === 'ERROR' ? (
                                                            <ShieldX size={32} />
                                                      ) : (
                                                            <ShieldAlert size={32} />
                                                      )}
                                                </span>
                                                {toast.message}
                                          </div>
                                          {toast.subMessage && toast?.subMessage?.length > 0 && (
                                                <div className='flex flex-col gap-[8px] mx-[8px] mb-[12px]'>
                                                      {toast.subMessage.map((sub) => (
                                                            <div className='relative flex items-center gap-[8px]' key={sub}>
                                                                  <span
                                                                        className={`${styleEffect.bgBoxTime} min-w-[8px] min-h-[8px] rounded-full`}
                                                                  ></span>
                                                                  <span className='max-w-full break-words'>{sub}</span>
                                                            </div>
                                                      ))}
                                                </div>
                                          )}
                                    </div>
                              </div>
                              <span
                                    className={`${styleEffect.textColor} !text-white absolute flex justify-center items-center bottom-[5px] animate-pulse right-[5px] w-[30px] h-[30px] p-[4px] text-[12px] rounded-full border-[2px] `}
                              >
                                    {time}
                              </span>
                              <span
                                    onClick={(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => handleControllCloseToast(e, toast.id)}
                                    className={`absolute flex justify-center items-center top-[5px] animate-pulse right-[5px] w-[30px] h-[30px] p-[4px] text-[11px]  cursor-pointer`}
                              >
                                    <X color={`${styleEffect.type_toast_icon}`} />
                              </span>
                        </div>
                  )}
            </>
      )
}

export default ToastDemo
