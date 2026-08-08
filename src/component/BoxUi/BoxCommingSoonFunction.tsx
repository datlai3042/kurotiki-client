import React, { useMemo, useState } from 'react'
import { Bell, Package, Settings, Store, Tag, Rocket } from 'lucide-react'

type NotificationTab = 'all' | 'promotion' | 'order' | 'system' | 'shop'

type TabItem = {
      key: NotificationTab
      label: string
      icon: React.ReactNode
}

interface BoxCommingSoonFunctionProps {
      className?: string
      title?: string
      description?: string
      defaultTab?: NotificationTab
      onTabChange?: (tab: NotificationTab) => void
}

const BoxCommingSoonFunction: React.FC<BoxCommingSoonFunctionProps> = ({
      className = '',
      title = 'Tính năng đang được phát triển',
      description = 'Chúng tôi đang nỗ lực hoàn thiện tính năng này để mang đến trải nghiệm tốt hơn cho bạn.',
      defaultTab = 'all',
      onTabChange,
}) => {
      const [activeTab, setActiveTab] = useState<NotificationTab>(defaultTab)

      const tabs = useMemo<TabItem[]>(
            () => [
                  { key: 'all', label: 'Tất cả', icon: <Bell size={19} strokeWidth={1.8} /> },
                  { key: 'promotion', label: 'Ưu đãi', icon: <Tag size={19} strokeWidth={1.8} /> },
                  { key: 'order', label: 'Đơn hàng', icon: <Package size={19} strokeWidth={1.8} /> },
                  { key: 'system', label: 'Hệ thống', icon: <Settings size={19} strokeWidth={1.8} /> },
                  { key: 'shop', label: 'Cửa hàng', icon: <Store size={19} strokeWidth={1.8} /> },
            ],
            [],
      )

      const handleTabChange = (tab: NotificationTab) => {
            setActiveTab(tab)
            onTabChange?.(tab)
      }

      return (
            <div className='flex min-h-[540px] items-center justify-center px-5 py-12 sm:min-h-[610px]'>
                  <div className='flex max-w-[430px] flex-col items-center text-center'>
                        <div className='relative mb-7 flex h-[150px] w-[150px] items-center justify-center'>
                              <div className='absolute inset-4 rounded-full bg-blue-50/80' />

                              <div className='relative flex h-[92px] w-[92px] items-center justify-center rounded-[28px] bg-gradient-to-br from-blue-400 to-blue-600 shadow-[0_16px_35px_rgba(37,99,235,0.18)]'>
                                    <Bell size={44} className='text-white' strokeWidth={1.7} />
                              </div>

                              <div className='absolute right-2 top-16 flex h-11 w-11 items-center justify-center rounded-full bg-amber-300 shadow-[0_8px_20px_rgba(251,191,36,0.25)]'>
                                    <Settings size={21} className='text-blue-600' strokeWidth={2} />
                              </div>

                              <span className='absolute right-4 top-2 text-amber-400'>✦</span>
                              <span className='absolute left-3 top-5 text-blue-200'>✦</span>
                              <span className='absolute right-1 bottom-7 text-blue-100'>✦</span>
                        </div>

                        <h2 className='text-[22px] font-semibold tracking-[-0.02em] text-text-theme'>{title}</h2>

                        <p className='mt-3 max-w-[390px] text-sm leading-6  text-text-theme opacity-80'>{description}</p>

                        <div className='mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-600'>
                              <Rocket size={17} strokeWidth={1.8} />
                              <span>Sắp ra mắt</span>
                        </div>
                  </div>
            </div>
      )
}

export default BoxCommingSoonFunction
