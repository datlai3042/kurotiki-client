import React, { useState } from 'react'
import OwnerShopFilterName from './Filter/OwnerShopFilterName'
import { ShopResponse } from '../../../types/shop.type'
import BoxShopForm from '../../../component/BoxUi/BoxShopForm'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { UserResponse } from '../../../types/user.type'
import { Link } from 'react-router-dom'
import ShopBoughtWrapper from './ShopBoughtWrapper'
import { Box, ExternalLink, Flame, MessageSquare, PackageCheck, Pencil, Star } from 'lucide-react'

type TProps = {
      shop: ShopResponse
}

type FilterMode = 'PRODUCT_SHOP' | 'PRODUCT_SHOP_BOUGHT' | 'NAVIGATE_SHOP_PUBLIC'

const ShopOwnerLayout = ({ shop }: TProps) => {
      const user = useSelector((state: RootState) => state.authentication.user) as UserResponse

      const [filterMode, setfilterMode] = useState<FilterMode>('PRODUCT_SHOP')
      const [openForm, setOpenForm] = useState(false)

      const defaultValues = user?.isOpenShop
            ? {
                    shop_name: shop.shop_name,
                    shop_avatar: shop.shop_avatar?.secure_url,
                    shop_description: shop.shop_description,
              }
            : {
                    shop_name: '',
                    shop_avatar: '',
                    shop_description: '',
              }

      const tabClassName = (active: boolean) =>
            active
                  ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                  : 'border-[var(--border-color-input)] bg-color-section-theme text-text-theme hover:border-blue-500/40 hover:bg-blue-500/[0.04]'

      const stats = [
            {
                  label: 'Sản phẩm',
                  value: shop.shop_products?.length || 0,
                  icon: <Box size={18} strokeWidth={1.8} />,
            },
            {
                  label: 'Đã bán',
                  value: shop.shop_order_count || 0,
                  icon: <PackageCheck size={18} strokeWidth={1.8} />,
            },
            {
                  label: 'Điểm đánh giá',
                  value: shop.shop_vote || 0,
                  icon: <Star size={18} strokeWidth={1.8} />,
            },
            {
                  label: 'Lượt đánh giá',
                  value: shop.shop_count_total_vote || 0,
                  icon: <MessageSquare size={18} strokeWidth={1.8} />,
            },
      ]

      return (
            <div className='flex min-h-[200px] w-full flex-col gap-4 text-text-theme'>
                  {/* SHOP OVERVIEW */}
                  <section className='overflow-hidden rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme'>
                        <div className='p-4 sm:p-5 xl:p-6'>
                              <div className='flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between'>
                                    <div className='flex min-w-0 flex-1 flex-col gap-5 sm:flex-row sm:items-start'>
                                          <div className='relative mx-auto h-[92px] w-[92px] shrink-0 sm:mx-0 xl:h-[104px] xl:w-[104px]'>
                                                <img
                                                      src={shop.shop_avatar?.secure_url || shop.shop_avatar_default}
                                                      className='h-full w-full rounded-full border border-[var(--border-color-input)] object-cover shadow-sm'
                                                      alt='shop avatar'
                                                />

                                                <span className='absolute bottom-1 right-1 h-4 w-4 rounded-full border-[3px] border-[var(--background-color-section)] bg-emerald-500' />
                                          </div>

                                          <div className='min-w-0 flex-1'>
                                                <div className='flex flex-wrap items-center justify-center gap-2 sm:justify-start'>
                                                      <h2 className='max-w-full truncate text-[20px] font-bold tracking-[-0.02em] text-text-theme xl:text-[24px]'>
                                                            {shop.shop_name}
                                                      </h2>

                                                      <span className='rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-500'>
                                                            Hoạt động
                                                      </span>
                                                </div>

                                                <p className='mt-1.5 line-clamp-2 text-center text-[12px] leading-5 text-slate-500 sm:text-left'>
                                                      {shop.shop_description || 'Chưa có mô tả cửa hàng.'}
                                                </p>

                                                {/* Statistics */}
                                                <div className='mt-5 grid grid-cols-2 gap-2 lg:grid-cols-4'>
                                                      {stats.map((item) => (
                                                            <div
                                                                  key={item.label}
                                                                  className='flex min-w-0 items-center gap-3 rounded-xl border border-[var(--border-color-input)] bg-slate-500/[0.025] px-3 py-3'
                                                            >
                                                                  <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500'>
                                                                        {item.icon}
                                                                  </div>

                                                                  <div className='min-w-0'>
                                                                        <p className='text-[14px] font-bold leading-none text-text-theme'>
                                                                              {item.value}
                                                                        </p>

                                                                        <p className='mt-1 truncate text-[10px] text-slate-500'>
                                                                              {item.label}
                                                                        </p>
                                                                  </div>
                                                            </div>
                                                      ))}
                                                </div>
                                          </div>
                                    </div>

                                    <button
                                          type='button'
                                          className='inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-blue-500/40 bg-blue-500/[0.04] px-4 text-[12px] font-semibold text-blue-500 transition hover:border-blue-500 hover:bg-blue-500 hover:text-white'
                                          onClick={() => setOpenForm(true)}
                                    >
                                          <Pencil size={15} strokeWidth={1.8} />
                                          Chỉnh sửa thông tin
                                    </button>
                              </div>
                        </div>

                        {/* Navigation */}
                        <div className='border-t border-[var(--border-color-input)] p-3 sm:p-4'>
                              <div className='flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
                                    <button
                                          type='button'
                                          className={`${tabClassName(
                                                filterMode === 'PRODUCT_SHOP',
                                          )} inline-flex min-w-max items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-[12px] font-semibold transition`}
                                          onClick={() => setfilterMode('PRODUCT_SHOP')}
                                    >
                                          <Box size={16} strokeWidth={1.8} />
                                          Sản phẩm của Shop
                                    </button>

                                    <button
                                          type='button'
                                          className={`${tabClassName(
                                                filterMode === 'PRODUCT_SHOP_BOUGHT',
                                          )} inline-flex min-w-max items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-[12px] font-semibold transition`}
                                          onClick={() => setfilterMode('PRODUCT_SHOP_BOUGHT')}
                                    >
                                          <Flame size={16} strokeWidth={1.8} />
                                          Các sản phẩm bán chạy
                                    </button>

                                    <Link
                                          to={`/shop/${shop._id}`}
                                          className={`${tabClassName(
                                                filterMode === 'NAVIGATE_SHOP_PUBLIC',
                                          )} inline-flex min-w-max items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-[12px] font-semibold transition`}
                                          onClick={() => setfilterMode('NAVIGATE_SHOP_PUBLIC')}
                                    >
                                          <ExternalLink size={16} strokeWidth={1.8} />
                                          Trang cửa hàng công khai
                                    </Link>
                              </div>
                        </div>
                  </section>

                  {/* CONTENT */}
                  <section className='w-full rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme p-3 sm:p-4'>
                        {filterMode === 'PRODUCT_SHOP' && <OwnerShopFilterName shop={shop} />}

                        {filterMode === 'PRODUCT_SHOP_BOUGHT' && <ShopBoughtWrapper shop={shop} />}
                  </section>

                  {openForm && (
                        <BoxShopForm onClose={setOpenForm} modeForm={user.isOpenShop ? 'UPDATE' : 'UPLOAD'} defaultValues={defaultValues} />
                  )}
            </div>
      )
}

export default ShopOwnerLayout
