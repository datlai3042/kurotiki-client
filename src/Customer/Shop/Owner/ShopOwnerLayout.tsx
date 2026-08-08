import React, { useState } from 'react'
import OwnerShopFilterName from './Filter/OwnerShopFilterName'
import { ShopResponse } from '../../../types/shop.type'
import BoxAvatarMode from '../../Account/Box/BoxAvatarMode'
import BoxShopForm from '../../../component/BoxUi/BoxShopForm'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { UserResponse } from '../../../types/user.type'
import { Link } from 'react-router-dom'
import ShopBoughtWrapper from './ShopBoughtWrapper'
import { Box, ExternalLink, Flame, Pencil } from 'lucide-react'

type TProps = {
      shop: ShopResponse
}

type FilterMode = 'PRODUCT_SHOP' | 'PRODUCT_SHOP_BOUGHT' | 'NAVIGATE_SHOP_PUBLIC'

const ShopOwnerLayout = (props: TProps) => {
      const { shop } = props
      const user = useSelector((state: RootState) => state.authentication.user) as UserResponse
      const [filterMode, setfilterMode] = useState('PRODUCT_SHOP')
      const [openForm, setOpenForm] = useState(false)

      const defaultValues = user?.isOpenShop
            ? {
                    shop_name: shop.shop_name,
                    shop_avatar: shop.shop_avatar?.secure_url,
                    shop_description: shop.shop_description,
              }
            : { shop_name: '', shop_avatar: '', shop_description: '' }

      const styleEffect = {
            onActive: (check: boolean) => {
                  if (check) {
                        return 'bg-gradient-to-r from-blue-600 to-blue-500 text-white border-blue-500 shadow-[0_10px_30px_rgba(37,99,235,0.25)]'
                  }

                  return 'bg-white/95 text-slate-900 border-white/70 hover:bg-white dark:bg-white dark:text-slate-900'
            },
      }

      return (
            <div className='relative flex min-h-[200px] w-full flex-col gap-5 overflow-hidden'>
                  {/* Decorative page background */}
                  <div className='pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-3xl'>
                        <div className='absolute inset-0 bg-[#07101f]' />
                        <div className='absolute -right-[140px] -top-[180px] h-[520px] w-[520px] rounded-full bg-blue-700/20 blur-[90px]' />
                        <div className='absolute -bottom-[220px] right-[6%] h-[620px] w-[620px] rounded-full border border-blue-500/10' />
                        <div className='absolute -bottom-[320px] right-[-80px] h-[760px] w-[760px] rounded-full border border-blue-500/10' />
                        <div className='absolute left-[38%] top-[40px] h-px w-[48%] rotate-[-18deg] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent' />
                        <div className='absolute left-[56%] top-[170px] h-px w-[34%] rotate-[-34deg] bg-gradient-to-r from-transparent via-blue-500/15 to-transparent' />
                        <span className='absolute right-[18%] top-[6%] h-1 w-1 rounded-full bg-blue-300/80 shadow-[0_0_12px_rgba(147,197,253,0.8)]' />
                        <span className='absolute right-[7%] top-[18%] h-1 w-1 rounded-full bg-blue-200/70' />
                        <span className='absolute right-[27%] top-[28%] h-[3px] w-[3px] rounded-full bg-blue-300/70' />
                  </div>

                  {/* Shop header */}
                  <section className='relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-[#0b1d3a]/95 via-[#0a1629]/95 to-[#08111f]/95 text-white shadow-[0_20px_60px_rgba(0,0,0,0.22)]'>
                        <div className='pointer-events-none absolute inset-0'>
                              <div className='absolute right-[-70px] top-[-90px] h-[260px] w-[260px] rounded-full bg-blue-500/10 blur-[30px]' />
                              <div className='absolute right-[35px] top-[36px] h-[120px] w-[120px] rounded-[26px] border border-blue-400/10 opacity-30' />
                        </div>

                        <div className='relative flex flex-col gap-5 px-5 pb-5 pt-6 xl:flex-row xl:items-center xl:justify-between xl:px-7 xl:py-6'>
                              <div className='flex min-w-0 items-center gap-4 xl:gap-5'>
                                    <div className='h-[104px] w-[104px] shrink-0 overflow-hidden rounded-full border-2 border-blue-400/70 bg-slate-900 shadow-[0_10px_30px_rgba(0,0,0,0.35)]'>
                                          <img
                                                src={shop.shop_avatar?.secure_url || shop.shop_avatar_default}
                                                className='h-full w-full object-cover'
                                                alt='shop avatar'
                                          />
                                    </div>

                                    <div className='min-w-0 flex-1'>
                                          <div className='flex flex-wrap items-center gap-2'>
                                                <h2 className='truncate text-[22px] font-semibold tracking-[-0.02em] text-white xl:text-[28px]'>
                                                      {shop.shop_name}
                                                </h2>

                                                <span className='rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-medium text-emerald-400 ring-1 ring-emerald-400/20'>
                                                      Hoạt động
                                                </span>
                                          </div>

                                          <p className='mt-2 max-w-[760px] text-sm leading-6 text-slate-300'>
                                                {shop.shop_description || 'Chưa có mô tả cửa hàng.'}
                                          </p>

                                          <div className='mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-300'>
                                                <div className='flex items-center gap-1.5'>
                                                      <span className='font-semibold text-white'>{shop.shop_products?.length || 0}</span>
                                                      <span>Sản phẩm</span>
                                                </div>

                                                <span className='h-1 w-1 rounded-full bg-slate-500' />
                                                <div className='flex items-center gap-1.5'>
                                                      <span className='font-semibold text-white'>{shop.shop_order_count || 0}</span>
                                                      <span>Đã bán</span>
                                                </div>

                                                <span className='h-1 w-1 rounded-full bg-slate-500' />
                                                <div className='flex items-center gap-1.5'>
                                                      <span className='font-semibold text-white'>{shop.shop_vote || 0}</span>
                                                      <span>Điểm đánh giá</span>
                                                </div>

                                                <span className='h-1 w-1 rounded-full bg-slate-500' />

                                                <div className='flex items-center gap-1.5'>
                                                      <span className='font-semibold text-white'>{shop.shop_count_total_vote || 0}</span>
                                                      <span>Lượt đánh giá</span>
                                                </div>
                                          </div>
                                    </div>
                              </div>

                              <button
                                    className='inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-medium text-white shadow-[0_8px_20px_rgba(37,99,235,0.25)] transition hover:bg-blue-500'
                                    onClick={() => setOpenForm(true)}
                              >
                                    <Pencil size={16} strokeWidth={1.8} />
                                    Chỉnh sửa thông tin
                              </button>
                        </div>

                        {/* Tabs banner */}
                        <div className='relative border-t border-blue-500/10 px-5 pb-5 pt-5 xl:px-7'>
                              <div className='relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] xl:p-4'>
                                    <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_90%_20%,rgba(255,255,255,0.12),transparent_28%)]' />

                                    <div className='relative flex flex-col gap-3 sm:flex-row sm:flex-wrap xl:gap-4'>
                                          <button
                                                className={`${styleEffect.onActive(
                                                      filterMode === 'PRODUCT_SHOP',
                                                )} inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-all duration-300`}
                                                onClick={() => setfilterMode('PRODUCT_SHOP')}
                                          >
                                                <Box size={18} strokeWidth={1.8} />
                                                Sản phẩm của Shop
                                          </button>

                                          <button
                                                className={`${styleEffect.onActive(
                                                      filterMode === 'PRODUCT_SHOP_BOUGHT',
                                                )} inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-all duration-300`}
                                                onClick={() => setfilterMode('PRODUCT_SHOP_BOUGHT')}
                                          >
                                                <Flame size={18} strokeWidth={1.8} />
                                                Các sản phẩm bán chạy
                                          </button>

                                          <Link
                                                to={`/shop/${shop._id}`}
                                                className={`${styleEffect.onActive(
                                                      filterMode === 'NAVIGATE_SHOP_PUBLIC',
                                                )} inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-all duration-300`}
                                                onClick={() => setfilterMode('NAVIGATE_SHOP_PUBLIC')}
                                          >
                                                <ExternalLink size={18} strokeWidth={1.8} />
                                                Trang cửa hàng công khai
                                          </Link>
                                    </div>
                              </div>
                        </div>
                  </section>

                  {/* Content surface */}
                  <section className='relative w-full overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0b111b]/92 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-sm'>
                        <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(37,99,235,0.06),transparent_32%)]' />

                        <div className='relative p-3 xl:p-4'>
                              {filterMode === 'PRODUCT_SHOP' && (
                                    <div className='w-full'>
                                          <OwnerShopFilterName shop={shop} />
                                    </div>
                              )}

                              {filterMode === 'PRODUCT_SHOP_BOUGHT' && (
                                    <div className='w-full'>
                                          <ShopBoughtWrapper shop={shop} />
                                    </div>
                              )}
                        </div>
                  </section>

                  {openForm && (
                        <BoxShopForm onClose={setOpenForm} modeForm={user.isOpenShop ? 'UPDATE' : 'UPLOAD'} defaultValues={defaultValues} />
                  )}
            </div>
      )
}

export default ShopOwnerLayout
