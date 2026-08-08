import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { removeToast } from '../../Redux/toast'
import { RootState } from '../../store'
import { ShieldAlert, ShieldCheck, ShieldX, X } from 'lucide-react'
import { TToast } from '../Context/ToastContext'

type TProps = {
      toast: TToast
}

/**
 * Không cần sửa component cha.
 *
 * Parent vẫn giữ nguyên:
 *
 * {toasts.map((toast) => (
 *      <ToastDemo key={toast.id} toast={toast} />
 * ))}
 *
 * Cách hoạt động:
 * - Tối đa 4 toast được hiển thị cùng lúc.
 * - KHÔNG gộp message.
 * - Mỗi lỗi / thông báo là một toast độc lập.
 * - Toast thứ 5 trở đi nằm trong queue và return null.
 * - Toast trong queue CHƯA chạy timer.
 * - Khi một toast visible biến mất, toast kế tiếp tự xuất hiện.
 */

const MAX_VISIBLE_TOAST = 6

type RegistryItem = {
      instanceId: string
      toastId: string
      order: number
}

const toastRegistry = new Map<string, RegistryItem>()
const registryListeners = new Set<() => void>()

let toastOrder = 0

const emitRegistryChange = () => {
      registryListeners.forEach((listener) => listener())
}

const subscribeRegistry = (listener: () => void) => {
      registryListeners.add(listener)

      return () => {
            registryListeners.delete(listener)
      }
}

const getVisibleInstanceIds = () => {
      return Array.from(toastRegistry.values())
            .sort((a, b) => a.order - b.order)
            .slice(0, MAX_VISIBLE_TOAST)
            .map((item) => item.instanceId)
}

const ToastDemo = (props: TProps) => {
      const { toast } = props

      const dispatch = useDispatch()
      const timerToast = useSelector((state: RootState) => state.toast.timerToast)

      const instanceIdRef = useRef(`toast-${toast.id}-${Math.random().toString(36).slice(2)}`)
      const orderRef = useRef(++toastOrder)

      const timeoutRef = useRef<NodeJS.Timeout>()
      const intervalRef = useRef<NodeJS.Timeout>()
      const timerStartedRef = useRef(false)

      const [, forceRegistryRender] = useState(0)
      const [time, setTime] = useState(timerToast)
      const [showDetail, setShowDetail] = useState(false)

      const instanceId = instanceIdRef.current

      useEffect(() => {
            const unsubscribe = subscribeRegistry(() => {
                  forceRegistryRender((prev) => prev + 1)
            })

            toastRegistry.set(instanceId, {
                  instanceId,
                  toastId: toast.id,
                  order: orderRef.current,
            })

            emitRegistryChange()

            return () => {
                  toastRegistry.delete(instanceId)
                  emitRegistryChange()
                  unsubscribe()
            }
      }, [instanceId, toast.id])

      const visibleInstanceIds = getVisibleInstanceIds()
      const isVisible = visibleInstanceIds.includes(instanceId)

      const clearTimers = () => {
            if (timeoutRef.current) {
                  clearTimeout(timeoutRef.current)
                  timeoutRef.current = undefined
            }

            if (intervalRef.current) {
                  clearInterval(intervalRef.current)
                  intervalRef.current = undefined
            }
      }

      const removeCurrentToast = () => {
            dispatch(removeToast({ id: toast.id }))
      }

      const startTimer = (seconds: number) => {
            clearTimers()

            const safeTime = Math.max(seconds, 0)

            timeoutRef.current = setTimeout(() => {
                  removeCurrentToast()
            }, safeTime * 1000)

            intervalRef.current = setInterval(() => {
                  setTime((prev) => {
                        if (prev <= 1) {
                              if (intervalRef.current) {
                                    clearInterval(intervalRef.current)
                                    intervalRef.current = undefined
                              }

                              return 0
                        }

                        return prev - 1
                  })
            }, 1000)
      }

      useEffect(() => {
            // Toast đang nằm trong queue:
            // không render và cũng không chạy countdown.
            if (!isVisible) {
                  clearTimers()
                  timerStartedRef.current = false
                  return
            }

            // Khi toast từ queue được đẩy lên vùng visible
            // thì countdown mới bắt đầu từ đầu.
            if (!timerStartedRef.current) {
                  setTime(timerToast)
                  startTimer(timerToast)
                  timerStartedRef.current = true
            }

            return () => {
                  clearTimers()
            }

            // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [isVisible])

      const handleCloseToast = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.stopPropagation()

            clearTimers()
            removeCurrentToast()
      }

      const handleOnMouseEnter = () => {
            if (!isVisible) return

            clearTimers()
            setShowDetail(true)
      }

      const handleOnMouseLeave = () => {
            if (!isVisible) return

            startTimer(time)
            setShowDetail(false)
      }

      const styleEffect = {
            border:
                  toast.type === 'SUCCESS' ? 'border-emerald-500/25' : toast.type === 'ERROR' ? 'border-red-500/25' : 'border-amber-500/25',

            iconBox:
                  toast.type === 'SUCCESS'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : toast.type === 'ERROR'
                        ? 'bg-red-500/10 text-red-400'
                        : 'bg-amber-500/10 text-amber-400',

            progress: toast.type === 'SUCCESS' ? 'bg-emerald-500' : toast.type === 'ERROR' ? 'bg-red-500' : 'bg-amber-500',

            dot: toast.type === 'SUCCESS' ? 'bg-emerald-400' : toast.type === 'ERROR' ? 'bg-red-400' : 'bg-amber-400',

            title: toast.type === 'SUCCESS' ? 'Thành công' : toast.type === 'ERROR' ? 'Có lỗi xảy ra' : 'Thông báo',

            countdown:
                  toast.type === 'SUCCESS'
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                        : toast.type === 'ERROR'
                        ? 'border-red-500/30 bg-red-500/10 text-red-300'
                        : 'border-amber-500/30 bg-amber-500/10 text-amber-300',
      }

      if (!isVisible) {
            return null
      }

      return (
            <div
                  onMouseEnter={handleOnMouseEnter}
                  onMouseLeave={handleOnMouseLeave}
                  className={`${styleEffect.border} animate-toastAnimation relative w-[340px] max-w-[calc(100vw-24px)] overflow-hidden rounded-[12px] border bg-[#151922] text-text-theme  transition-all duration-300`}
            >
                  <span
                        style={{
                              width: `${Math.max(0, Math.min(100, timerToast > 0 ? (time / timerToast) * 100 : 0))}%`,
                        }}
                        className={`${styleEffect.progress} absolute left-0 top-0 h-[3px] transition-[width] duration-1000 ease-linear`}
                  />

                  <div className='flex gap-3 px-4 pb-4 pt-4'>
                        <div className={`${styleEffect.iconBox} flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]`}>
                              {toast.type === 'SUCCESS' ? (
                                    <ShieldCheck size={21} strokeWidth={1.9} />
                              ) : toast.type === 'ERROR' ? (
                                    <ShieldX size={21} strokeWidth={1.9} />
                              ) : (
                                    <ShieldAlert size={21} strokeWidth={1.9} />
                              )}
                        </div>

                        <div className='min-w-0 flex-1 pr-7'>
                              <p className='text-[13px] font-semibold text-white '>{styleEffect.title}</p>

                              <p className='mt-1 break-words text-[13px] leading-5 text-slate-300'>{toast.message}</p>

                              {toast.subMessage && toast.subMessage.length > 0 && (
                                    <div className='mt-3 space-y-2 border-t border-white/[0.06] pt-3'>
                                          {toast.subMessage.map((sub) => (
                                                <div className='flex items-start gap-2 text-[12px] leading-5 text-slate-400' key={sub}>
                                                      <span className={`${styleEffect.dot} mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full`} />

                                                      <span className='min-w-0 break-words'>{sub}</span>
                                                </div>
                                          ))}
                                    </div>
                              )}
                        </div>

                        <button
                              type='button'
                              aria-label='Đóng thông báo'
                              onClick={handleCloseToast}
                              className='absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/[0.06] hover:text-white'
                        >
                              <X size={17} />
                        </button>
                  </div>

                  <div className='flex items-center justify-between border-t border-white/[0.06] bg-black/[0.06] px-4 py-2'>
                        <span className='text-[11px] text-slate-500'>
                              {showDetail ? 'Tạm dừng khi đang rê chuột' : 'Thông báo sẽ tự đóng'}
                        </span>

                        <span
                              className={`${styleEffect.countdown} flex h-6 min-w-6 items-center justify-center rounded-full border px-1.5 text-[11px] font-semibold`}
                        >
                              {Math.max(time, 0)}
                        </span>
                  </div>
            </div>
      )
}

export default ToastDemo
