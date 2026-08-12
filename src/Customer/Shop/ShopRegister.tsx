import React, { useState } from 'react'
import BoxShopForm from '../../component/BoxUi/BoxShopForm'
import { ArrowRight, Plus, Store } from 'lucide-react'
import image from '../Sell/logistic.jpg'

const ShopRegister = () => {
      const [openForm, setOpenForm] = useState(false)

      return (
            <div className='flex w-full flex-col gap-[20px]'>
                  <div
                        className='
                              flex w-full flex-col gap-4
                              rounded-xl
                              border border-blue-500/20
                              bg-gradient-to-r
                              from-blue-500/[0.10]
                              via-blue-500/[0.04]
                              to-transparent
                              px-5 py-4
                              sm:flex-row sm:items-center sm:justify-between
                        '
                  >
                        <div className='flex min-w-0 items-center gap-3'>
                              <div
                                    className='
                                          flex h-11 w-11 shrink-0
                                          items-center justify-center
                                          rounded-xl
                                          bg-blue-500/10
                                          text-blue-500
                                    '
                              >
                                    <Store size={21} strokeWidth={1.8} />
                              </div>

                              <div className='min-w-0'>
                                    <p className='text-[14px] font-semibold text-text-theme'>Bắt đầu bán hàng trên KuroTiki</p>

                                    <p className='mt-1 text-[12px] leading-5 text-slate-500'>
                                          Tạo cửa hàng và đăng sản phẩm của bạn ngay hôm nay
                                    </p>
                              </div>
                        </div>

                        <button
                              type='button'
                              onClick={() => setOpenForm(true)}
                              className='
                                    group
                                    flex h-10 shrink-0
                                    items-center justify-center gap-2
                                    rounded-lg
                                    bg-blue-600
                                    px-4
                                    text-[13px] font-semibold text-white
                                    shadow-[0_6px_18px_rgba(37,99,235,0.22)]
                                    transition-all duration-200
                                    hover:bg-blue-700
                                    active:scale-[0.98]
                                    sm:w-auto
                              '
                        >
                              <Plus size={17} strokeWidth={2} />

                              <span>Đăng ký cửa hàng</span>

                              <ArrowRight size={15} className='transition-transform duration-200 group-hover:translate-x-0.5' />
                        </button>
                  </div>

                  <div
                        className='
                              relative
                              h-[220px]
                              w-full
                              overflow-hidden
                              rounded-xl
                              border border-[var(--border-color-input)]
                              bg-color-section-theme
                              sm:h-[260px]
                              xl:h-[300px]
                        '
                  >
                        <img src={image} alt='KuroTiki logistics' className='h-full w-full object-cover object-center' />

                        <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent' />
                  </div>

                  {openForm && (
                        <BoxShopForm
                              defaultValues={{
                                    shop_avatar: '',
                                    shop_name: '',
                                    shop_description: '',
                              }}
                              modeForm='UPLOAD'
                              onClose={setOpenForm}
                        />
                  )}
            </div>
      )
}

export default ShopRegister
