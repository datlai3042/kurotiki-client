import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { History, Home, Notebook, Store, User } from 'lucide-react'
import BoxBuild from '../../component/BoxUi/BoxBuild'
import NotificationSection from './NotificationSection'
import { useDebouncedCallback } from '@mantine/hooks'
import BoxCommingSoonFunction from '../../component/BoxUi/BoxCommingSoonFunction'

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

      const debounceResize = useDebouncedCallback(() => {
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
      }, 100)

      useEffect(() => {
            window.addEventListener('resize', debounceResize)

            return () => {
                  window.removeEventListener('resize', debounceResize)
            }
      }, [])

      const styleEffect = {
            activeHash: (notification: string) => (notification === location ? 'bg-blue-100' : ''),
      }

      const tabClassName = (isActive: boolean) =>
            `relative flex h-[74px] min-w-[132px] font-semibold shrink-0 items-center justify-center gap-2.5 px-5 text-sm font-medium transition-all duration-200 ${
                  isActive
                        ? 'text-blue-600'
                        : 'text-slate-500 hover:bg-color-main hover:text-white '
            }`

      return (
            <div className='relative flex h-max w-full flex-col gap-5 pb-[10px]'>
                  <div className='w-full overflow-hidden rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme shadow-[0_8px_30px_rgba(15,23,42,0.04)]'>
                        <div className='flex min-h-[74px] w-full items-center gap-1 overflow-x-auto px-3'>
                              <button
                                    className={tabClassName(activeNotification.title === 'Thông báo chung')}
                                    onClick={() =>
                                          setActiveNotification({
                                                title: 'Thông báo chung',
                                                notification: 'COMMON',
                                          })
                                    }
                                    title='Thông báo chung'
                              >
                                    <Home size={20} strokeWidth={1.8} />
                                    <span className='whitespace-nowrap'>Tất cả</span>

                                    {activeNotification.title === 'Thông báo chung' && (
                                          <span className='absolute inset-x-4 bottom-0 h-[2px] rounded-full bg-blue-500' />
                                    )}
                              </button>

                              <button
                                    className={tabClassName(activeNotification.title === 'Thông báo cá nhân')}
                                    onClick={() =>
                                          setActiveNotification({
                                                title: 'Thông báo cá nhân',
                                                notification: 'USER',
                                          })
                                    }
                                    title='Thông báo cá nhân'
                              >
                                    <User size={20} strokeWidth={1.8} />
                                    <span className='whitespace-nowrap'>Cá nhân</span>

                                    {activeNotification.title === 'Thông báo cá nhân' && (
                                          <span className='absolute inset-x-4 bottom-0 h-[2px] rounded-full bg-blue-500' />
                                    )}
                              </button>

                              <button
                                    className={tabClassName(activeNotification.title === 'Thông báo sản phẩm')}
                                    onClick={() =>
                                          setActiveNotification({
                                                title: 'Thông báo sản phẩm',
                                                notification: 'PRODUCT',
                                          })
                                    }
                                    title='Thông báo sản phẩm'
                              >
                                    <Notebook size={20} strokeWidth={1.8} />
                                    <span className='whitespace-nowrap'>Sản phẩm</span>

                                    {activeNotification.title === 'Thông báo sản phẩm' && (
                                          <span className='absolute inset-x-4 bottom-0 h-[2px] rounded-full bg-blue-500' />
                                    )}
                              </button>

                              <button
                                    className={tabClassName(activeNotification.title === 'Thông báo hệ thống')}
                                    onClick={() =>
                                          setActiveNotification({
                                                title: 'Thông báo hệ thống',
                                                notification: 'SYSTEM',
                                          })
                                    }
                                    title='Thông báo hệ thống'
                              >
                                    <History size={20} strokeWidth={1.8} />
                                    <span className='whitespace-nowrap'>Hệ thống</span>

                                    {activeNotification.title === 'Thông báo hệ thống' && (
                                          <span className='absolute inset-x-4 bottom-0 h-[2px] rounded-full bg-blue-500' />
                                    )}
                              </button>

                              <button
                                    className={tabClassName(activeNotification.title === 'Thông báo Shop')}
                                    onClick={() =>
                                          setActiveNotification({
                                                title: 'Thông báo Shop',
                                                notification: 'SHOP',
                                          })
                                    }
                                    title='Thông báo Shop'
                              >
                                    <Store size={20} strokeWidth={1.8} />
                                    <span className='whitespace-nowrap'>Cửa hàng</span>

                                    {activeNotification.title === 'Thông báo Shop' && (
                                          <span className='absolute inset-x-4 bottom-0 h-[2px] rounded-full bg-blue-500' />
                                    )}
                              </button>
                        </div>
                  </div>

                  <div className='w-full overflow-hidden rounded-2xl'>
                        <div
                              className='flex h-max min-h-[600px] w-full transition-all duration-500'
                              ref={wrapperRef}
                        >
                              <div className='h-full min-w-full'>
                                    {activeNotification.title === 'Thông báo chung' && (
                                          <div className='min-h-[560px] w-full overflow-hidden rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme shadow-[0_8px_30px_rgba(15,23,42,0.04)]'>
                                                <BoxCommingSoonFunction />
                                          </div>
                                    )}
                              </div>

                              <div className='min-w-full'>
                                    {activeNotification.title === 'Thông báo cá nhân' && (
                                          <div className='min-h-[560px] w-full overflow-hidden rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme shadow-[0_8px_30px_rgba(15,23,42,0.04)]'>
                                                {/* <BoxBuild /> */}
                                                <NotificationSection type='USER' />
                                          </div>
                                    )}
                              </div>

                              <div className='min-w-full'>
                                    {activeNotification.title === 'Thông báo sản phẩm' && (
                                          <div className='min-h-[560px] w-full overflow-hidden rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme shadow-[0_8px_30px_rgba(15,23,42,0.04)]'>
                                                <NotificationSection type='PRODUCT' />
                                          </div>
                                    )}
                              </div>

                              <div className='min-w-full'>
                                    {activeNotification.title === 'Thông báo hệ thống' && (
                                          <div className='min-h-[560px] w-full overflow-hidden rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme shadow-[0_8px_30px_rgba(15,23,42,0.04)]'>
                                                <NotificationSection type='SYSTEM' />
                                          </div>
                                    )}
                              </div>

                              <div className='min-w-full'>
                                    {activeNotification.title === 'Thông báo Shop' && (
                                          <div className='min-h-[560px] w-full overflow-hidden rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme shadow-[0_8px_30px_rgba(15,23,42,0.04)]'>
                                                <NotificationSection type='SHOP' />
                                          </div>
                                    )}
                              </div>
                        </div>
                  </div>
            </div>
      )
}

export default BoxNotification