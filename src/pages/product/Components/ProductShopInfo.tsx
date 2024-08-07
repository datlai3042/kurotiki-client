import React from 'react'
import { ShopResponse } from '../../../types/shop.type'
import { Link } from 'react-router-dom'
import ShopLogo from '../../../component/Content/assets/img/Label/offical.png'
import { Rate } from 'antd'
import { useQuery } from '@tanstack/react-query'
import ShopApi from '../../../apis/shop.api'

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
                              className='w-full min-h-[130px] h-full bg-[#ffffff] rounded-lg flex flex-col gap-[16px] p-[16px]'
                        >
                              <h4 className='text-[16px] font-medium'>Thông tin nhà bán</h4>
                              <div className='flex flex-row xl:flex-col gap-[12px]'>
                                    <div className='flex flex-1 gap-[8px]'>
                                          <img
                                                src={shop?.shop_avatar?.secure_url || shop.shop_avatar_default}
                                                className='w-[40px] h-[40px] rounded-full'
                                                alt='shop avatar'
                                          />
                                          <div className='flex  flex-col gap-[6px] xl:gap-[8px]'>
                                                <div className='w-max flex  flex-col-reverse xl:flex-row gap-[6px]'>
                                                      <span className='font-semibold text-[14px]'>{shop.shop_name}</span>
                                                      <img src={ShopLogo} className='w-[80px]' alt='label logo' />
                                                </div>
                                                <div className='flex items-center gap-[6px] w-max'>
                                                      <Rate disabled allowHalf value={shop.shop_vote} className='text-[12px]' />
                                                      <span className='text-[13px] xl:text-[14px]'>
                                                            ({shop.shop_count_total_vote} đánh giá)
                                                      </span>
                                                </div>
                                          </div>
                                    </div>

                                    <div className='ml-[30px] self-start justify-self-start flex flex-col gap-[12px]'>
                                          <button className='min-w-[60px] w-max h-[30px] p-[8px] border-[1px] border-slate-400 flex items-center justify-center rounded-md'>
                                                Xem shop
                                          </button>
                                    </div>
                              </div>
                        </Link>
                  )}
            </>
      )
}

export default ProductShopInfo
