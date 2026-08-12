import React from 'react'
import { ShopResponse } from '../../../types/shop.type'
import { Link } from 'react-router-dom'
import ShopLogo from '../../../component/Content/assets/img/Label/offical.png'
import { Rate } from 'antd'
import { useQuery } from '@tanstack/react-query'
import ShopApi from '../../../apis/shop.api'
import { BadgeCheck, Store, ExternalLink } from 'lucide-react'

type TProps = {
      product_id?: string
      shop: ShopResponse
}

const ProductShopInfo = (props: TProps) => {
      const { shop } = props

      return (
            <>
                  {shop && (
                        <Link
                              to={`/shop/${shop?._id}`}
                              className='group flex h-full min-h-[245px] w-full flex-col overflow-hidden rounded-2xl border border-slate-700/60 bg-[#17191d] text-text-theme shadow-[0_12px_35px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-[2px] hover:border-blue-500/35 hover:shadow-[0_18px_45px_rgba(0,0,0,0.28)]'
                        >
                              {/* Shop banner */}
                              <div className='relative h-[90px] overflow-hidden bg-gradient-to-br from-blue-600/20 via-slate-900 to-slate-950'>
                                    <img
                                          src={shop?.shop_avatar?.secure_url || shop.shop_avatar_default}
                                          className='absolute inset-0 h-full w-full scale-110 object-cover opacity-30 blur-[1px]'
                                          alt='shop cover'
                                    />

                                    <div className='absolute inset-0 bg-gradient-to-t from-[#17191d] via-[#17191d]/50 to-transparent' />

                                    <div className='absolute bottom-3 left-4 top-[30px] flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-white/80 bg-white shadow-lg'>
                                          <img
                                                src={shop?.shop_avatar?.secure_url || shop.shop_avatar_default}
                                                className='h-full w-full object-cover'
                                                alt='shop avatar'
                                          />
                                    </div>
                              </div>

                              {/* Shop info */}
                              <div className='flex flex-1 flex-col px-4 pb-4 pt-3'>
                                    <p className='mb-2 text-[11px] font-medium uppercase tracking-[0.08em] text-slate-500'>
                                          Thông tin nhà bán
                                    </p>

                                    <div className='flex min-w-0 items-start justify-between gap-3'>
                                          <div className='min-w-0'>
                                                <div className='flex flex-wrap items-center gap-2'>
                                                      <h4 className='truncate text-sm font-semibold text-slate-100'>{shop.shop_name}</h4>

                                                      <div className='flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-1 text-[10px] font-medium text-blue-400'>
                                                            <BadgeCheck size={12} />
                                                            OFFICIAL
                                                      </div>
                                                </div>

                                                <div className='mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400'>
                                                      <div className='flex items-center gap-1.5'>
                                                            <Rate
                                                                  disabled
                                                                  allowHalf
                                                                  value={shop.shop_vote || 4.5}
                                                                  className='text-[11px]'
                                                            />
                                                      </div>

                                                      <span className='h-1 w-1 rounded-full bg-slate-600' />

                                                      <span>{shop.shop_count_total_vote} đánh giá</span>
                                                </div>
                                          </div>
                                    </div>

                                    <div className='mt-4 flex items-center gap-2'>
                                          <div className='flex h-9 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-[#12151a] text-xs font-medium text-slate-200 transition group-hover:border-blue-500/50 group-hover:text-blue-400'>
                                                <Store size={14} />
                                                Xem shop
                                          </div>

                                          <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-[#12151a] text-slate-400 transition group-hover:border-blue-500/50 group-hover:text-blue-400'>
                                                <ExternalLink size={14} />
                                          </div>
                                    </div>
                              </div>
                        </Link>
                  )}
            </>
      )
}

export default ProductShopInfo
