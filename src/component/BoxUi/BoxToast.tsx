import React, { useEffect, useRef, useState } from 'react'
import { ShieldAlert, ShieldCheck, ShieldX, X } from 'lucide-react'

type TProps = {
      message: string
      type: 'SUCCESS' | 'ERROR' | 'WARNNING'
      timer: number
      id: string
      onClose?: () => void
}

const BoxToast = (props: TProps) => {
      const toastTimer = useRef<NodeJS.Timeout>()
      const timer = useRef<NodeJS.Timeout>()
      const [show, setShow] = useState(true)
      const [time, setTime] = useState(props.timer / 1000 || 1000)
      const [isClosing, setIsClosing] = useState(false)

      const handleControllCloseToast = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
            e.stopPropagation()
            setIsClosing(true)
            setTimeout(() => {
                  setShow(false)
                  props.onClose?.()
            }, 300)
      }

      // Get color classes based on type
      const getColorClasses = () => {
            switch (props.type) {
                  case 'SUCCESS':
                        return {
                              text: 'text-green-800',
                              bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
                              border: 'border-green-400',
                              accent: 'bg-green-500',
                              icon: 'text-green-600',
                        }
                  case 'ERROR':
                        return {
                              text: 'text-red-800',
                              bg: 'bg-gradient-to-r from-red-50 to-rose-50',
                              border: 'border-red-400',
                              accent: 'bg-red-500',
                              icon: 'text-red-600',
                        }
                  default: // WARNNING
                        return {
                              text: 'text-orange-800',
                              bg: 'bg-gradient-to-r from-orange-50 to-amber-50',
                              border: 'border-orange-400',
                              accent: 'bg-orange-500',
                              icon: 'text-orange-600',
                        }
            }
      }

      const colors = getColorClasses()

      useEffect(() => {
            toastTimer.current = setTimeout(() => {
                  setIsClosing(true)
                  setTimeout(() => {
                        setShow(false)
                        props.onClose?.()
                  }, 300)
            }, props.timer)

            timer.current = setInterval(() => {
                  setTime((prev) => (prev -= 1))
            }, 1000)

            return () => {
                  clearTimeout(toastTimer.current)
                  clearInterval(timer.current)
            }
      }, [props.timer, props.onClose])

      return (
            <>
                  {show && (
                        <div
                              className={`
            ${colors.text} ${colors.bg} ${colors.border}
            py-6 px-4 border-l-4 shadow-xl relative w-[450px] min-h-[120px] h-auto 
            rounded-xl transition-all duration-300 ease-out border-2 
            flex items-center justify-center backdrop-blur-sm
            hover:shadow-2xl hover:scale-105
            ${isClosing ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
          `}
                        >
                              {/* Progress bar - single bar at top */}
                              <div className='absolute top-0 left-0 right-0 h-1 bg-gray-200/30 rounded-t-xl overflow-hidden'>
                                    <div
                                          style={{ width: `${(time / (props.timer / 1000)) * 100}%` }}
                                          className={`${colors.accent} h-full transition-all duration-1000 ease-linear`}
                                    />
                              </div>

                              <div className='w-full flex gap-4 items-start'>
                                    {/* Icon */}
                                    <span className={`${colors.icon} flex-shrink-0`}>
                                          {props.type === 'SUCCESS' ? (
                                                <ShieldCheck size={32} />
                                          ) : props.type === 'ERROR' ? (
                                                <ShieldX size={32} />
                                          ) : (
                                                <ShieldAlert size={32} />
                                          )}
                                    </span>

                                    {/* Content */}
                                    <div className='flex-1 min-w-0'>
                                          <span className={`uppercase font-semibold text-sm tracking-wide block mb-2 ${colors.text}`}>
                                                {props.type}
                                          </span>
                                          <span className={`text-sm leading-relaxed ${colors.text} opacity-90`}>{props.message}</span>
                                    </div>
                              </div>

                              {/* Close button */}
                              <button
                                    onClick={handleControllCloseToast}
                                    className={`
              absolute top-3 right-3 flex justify-center items-center 
              w-8 h-8 rounded-full transition-all duration-200
              hover:bg-white/30 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50
              ${colors.icon}
            `}
                              >
                                    <X size={18} />
                              </button>

                              {/* Timer display */}
                              <span
                                    className={`
              absolute bottom-3 right-3 flex justify-center items-center 
              w-8 h-8 text-xs font-bold rounded-full border-2 
              ${colors.border} ${colors.text} bg-white/50 backdrop-blur-sm
              transition-all duration-200
            `}
                              >
                                    {Math.ceil(time)}
                              </span>

                              {/* Author */}
                              <span className={`absolute bottom-3 left-4 text-xs opacity-60 ${colors.text}`}>@datlai304</span>
                        </div>
                  )}
            </>
      )
}


export default BoxToast