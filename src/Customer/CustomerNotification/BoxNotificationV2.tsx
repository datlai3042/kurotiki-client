import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { History, Home, MoreHorizontal, Notebook, ShoppingCart, Store, User } from 'lucide-react'
import BoxBuild from '../../component/BoxUi/BoxBuild'
import NotificationSection from './NotificationSection'
import { useDebouncedCallback } from '@mantine/hooks'
import BoxCommingSoonFunction from '../../component/BoxUi/BoxCommingSoonFunction'
import BoxResponsiveOverflow, { BoxResponsiveFlowClose } from '../../component/BoxUi/BoxResponsiveFlow'
import BoxWrapperCalcHeight from '../../component/BoxUi/BoxWrapperCalcHeight'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { UserResponse } from '../../types/user.type'
import ShopRegister from '../Shop/ShopRegister'

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

type NotificationTitle = NotificationTypeActive['title']
type NotificationKind = NotificationTypeActive['notification']

type NotificationTab = {
      id: number
      title: NotificationTitle
      label: string
      notification: NotificationKind
      icon: React.ReactNode
}

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
                  isActive ? 'text-blue-600' : 'text-slate-500 hover:bg-color-main hover:text-white '
            }`
      const notificationTabs: NotificationTab[] = [
            {
                  id: 1,
                  title: 'Thông báo chung',
                  label: 'Tất cả',
                  notification: 'COMMON',
                  icon: <Home size={20} strokeWidth={1.8} />,
            },
            {
                  id: 2,
                  title: 'Thông báo cá nhân',
                  label: 'Cá nhân',
                  notification: 'USER',
                  icon: <User size={20} strokeWidth={1.8} />,
            },
            {
                  id: 3,
                  title: 'Thông báo sản phẩm',
                  label: 'Mua hàng',
                  notification: 'PRODUCT',
                  icon: <ShoppingCart size={20} strokeWidth={1.8} />,
            },
            {
                  id: 4,
                  title: 'Thông báo hệ thống',
                  label: 'Hệ thống',
                  notification: 'SYSTEM',
                  icon: <History size={20} strokeWidth={1.8} />,
            },
            {
                  id: 5,
                  title: 'Thông báo Shop',
                  label: 'Cửa hàng',
                  notification: 'SHOP',
                  icon: <Store size={20} strokeWidth={1.8} />,
            },
      ]

      const handleChangeNotification = (tab: NotificationTab) => {
            setActiveNotification({
                  title: tab.title,
                  notification: tab.notification,
            } as NotificationTypeActive)
      }
      const user = useSelector((state: RootState) => state.authentication.user) as UserResponse

      return (
            <div className='relative flex h-max w-full flex-col gap-5 pb-[10px]'>
                  <div className='w-full overflow-hidden rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme shadow-[0_8px_30px_rgba(15,23,42,0.04)]'>
                        <div className='flex min-h-[74px] w-full items-center gap-1 overflow-x-auto'>
                              <BoxResponsiveOverflow
                                    items={notificationTabs}
                                    gap={4}
                                    minVisible={2}
                                    className='min-h-[74px] '
                                    itemContainerClassName='justify-start items-center'
                                    itemClassName='shrink-0'
                                    getKey={(tab) => tab.id}
                                    renderItem={(tab) => {
                                          const isActive = activeNotification.title === tab.title

                                          return (
                                                <button
                                                      type='button'
                                                      className={tabClassName(isActive)}
                                                      onClick={() => handleChangeNotification(tab)}
                                                      title={tab.title}
                                                >
                                                      {tab.icon}

                                                      <span className='whitespace-nowrap'>{tab.label}</span>

                                                      {isActive && (
                                                            <span className='absolute inset-x-4 bottom-0 h-[2px] rounded-full bg-blue-500' />
                                                      )}
                                                </button>
                                          )
                                    }}
                                    renderMore={({ open, hiddenCount }) => (
                                          <button
                                                type='button'
                                                onClick={open}
                                                title={`Xem thêm ${hiddenCount} mục`}
                                                className='
                        flex
                        h-[44px]
                        w-[44px]
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-dashed
                        border-blue-400
                        bg-blue-50
                        text-blue-500

                        dark:border-blue-500/50
                        dark:bg-blue-500/10
                  '
                                          >
                                                <MoreHorizontal size={19} />
                                          </button>
                                    )}
                                    renderExpanded={({ items, close }) => (
                                          <BoxResponsiveFlowClose
                                                open
                                                onClose={close}
                                                title={
                                                      <div>
                                                            <h3 className='text-base font-bold text-text-theme'>Loại thông báo</h3>

                                                            <p className='mt-0.5 text-xs text-slate-500'>Chọn loại thông báo muốn xem</p>
                                                      </div>
                                                }
                                          >
                                                <div className='grid grid-cols-2 gap-[10px]'>
                                                      {items.map((tab) => {
                                                            const isActive = activeNotification.title === tab.title

                                                            return (
                                                                  <button
                                                                        key={tab.id}
                                                                        type='button'
                                                                        onClick={() => {
                                                                              handleChangeNotification(tab)
                                                                              close()
                                                                        }}
                                                                        className={`
                                                relative
                                                flex
                                                min-h-[74px]
                                                items-center
                                                gap-[10px]
                                                rounded-[12px]
                                                border
                                                px-[14px]
                                                text-left
                                                transition

                                                ${
                                                      isActive
                                                            ? 'border-blue-500 bg-blue-500/10 text-blue-500'
                                                            : 'border-[var(--border-color-input)] text-text-theme hover:border-blue-500/50 hover:bg-blue-500/5'
                                                }
                                          `}
                                                                  >
                                                                        <div
                                                                              className={`
                                                      flex
                                                      h-[36px]
                                                      w-[36px]
                                                      shrink-0
                                                      items-center
                                                      justify-center
                                                      rounded-full

                                                      ${isActive ? 'bg-blue-500 text-white' : 'bg-slate-500/10'}
                                                `}
                                                                        >
                                                                              {tab.icon}
                                                                        </div>

                                                                        <div className='min-w-0'>
                                                                              <p className='text-[13px] font-medium'>{tab.label}</p>

                                                                              <p className='mt-[2px] truncate text-[10px] text-slate-400'>
                                                                                    {tab.title}
                                                                              </p>
                                                                        </div>
                                                                  </button>
                                                            )
                                                      })}
                                                </div>
                                          </BoxResponsiveFlowClose>
                                    )}
                              />
                        </div>
                  </div>

                  <div className='w-full overflow-hidden rounded-2xl'>
                        <BoxWrapperCalcHeight className='w-full '>
                              <div className='flex h-max min-h-[600px] w-full transition-all duration-500' ref={wrapperRef}>
                                    <div className='h-full min-w-full'>
                                          {activeNotification.title === 'Thông báo chung' && (
                                                <div className=' w-full overflow-hidden h-full rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme shadow-[0_8px_30px_rgba(15,23,42,0.04)]'>
                                                      <BoxCommingSoonFunction />
                                                </div>
                                          )}
                                    </div>

                                    <div className='min-w-full'>
                                          {activeNotification.title === 'Thông báo cá nhân' && (
                                                <div className=' w-full overflow-hidden h-full rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme shadow-[0_8px_30px_rgba(15,23,42,0.04)]'>
                                                      {/* <BoxBuild /> */}
                                                      <NotificationSection type='USER' />
                                                </div>
                                          )}
                                    </div>

                                    <div className='min-w-full'>
                                          {activeNotification.title === 'Thông báo sản phẩm' && (
                                                <div className='min-h-[560px] h-full w-full overflow-hidden rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme shadow-[0_8px_30px_rgba(15,23,42,0.04)]'>
                                                      <NotificationSection type='PRODUCT' />
                                                </div>
                                          )}
                                    </div>

                                    <div className='min-w-full'>
                                          {activeNotification.title === 'Thông báo hệ thống' && (
                                                <div className='min-h-[560px] h-full w-full overflow-hidden rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme shadow-[0_8px_30px_rgba(15,23,42,0.04)]'>
                                                      <NotificationSection type='SYSTEM' />
                                                </div>
                                          )}
                                    </div>

                                    <div className='min-w-full'>
                                          {activeNotification.title === 'Thông báo Shop' && user?.isOpenShop ? (
                                                <div className='min-h-[560px] h-full w-full overflow-hidden rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme shadow-[0_8px_30px_rgba(15,23,42,0.04)]'>
                                                      <NotificationSection type='SHOP' />
                                                </div>
                                          ) : (
                                                <ShopRegister />
                                          )}
                                    </div>
                              </div>
                        </BoxWrapperCalcHeight>
                  </div>
            </div>
      )
}

export default BoxNotification
