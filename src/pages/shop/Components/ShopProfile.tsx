import React, { useRef, useState } from 'react'
import { ShopResponse } from '../../../types/shop.type'
import { Box, CalendarCheck, Star, Store } from 'lucide-react'
import { getYear } from '../../../utils/date.utils'
import { Rate } from 'antd'

type TProps = {
      shop: ShopResponse
}

const ShopProfile = (props: TProps) => {
      const { shop } = props

      const [readMore, setReadMore] = useState<boolean>(false)

      return (
            <div className='w-full min-h-[340px] flex flex-col xl:flex-row  h-max bg-color-section-theme text-text-theme   rounded-lg'>
                  <div className='min-h-full w-full xl:min-w-[50%] items-center border-r-[1px] border-[var(--border-color-input)]'>
                        <div className='h-[160px] xl:h-full w-full flex items-center xl:justify-center'>
                              <div className='min-h-full min-w-[50%] border-r-[1px] border-[var(--border-color-input)] flex flex-col justify-center items-center gap-[8px]'>
                                    <span>Tổng lượt đánh giá</span>
                                    <span className='font-medium text-[24px] text-green-700'>{shop.shop_count_total_vote}</span>
                              </div>

                              <div className='min-h-full min-w-[50%] flex flex-col justify-center items-center gap-[8px]'>
                                    <span>Đánh giá trung bình</span>
                                    <span className='font-medium text-[24px] text-green-700'>{shop.shop_vote.toFixed(1)}</span>
                              </div>
                        </div>
                  </div>
                  <div className='min-h-full w-full xl:min-w-[50%] flex flex-col gap-[28px] px-[40px] py-[30px] text-[13px]'>
                        <div className='flex items-center gap-[10px]'>
                              <div className='flex gap-[10px] min-w-[150px]'>
                                    <CalendarCheck size={19} color='gray' className='mt-[-2px]' />
                                    <span className='text-color-main'>Thành viên từ năm</span>
                              </div>
                              <span className='ml-[16px]'>{getYear(shop.createdAt)}</span>
                        </div>
                        <div className='flex items-center gap-[10px]'>
                              <div className='flex gap-[10px] min-w-[150px]'>
                                    <Box size={19} color='gray' className='mt-[-2px]' />
                                    <span className='text-color-main'>Sản phẩm</span>
                              </div>
                              <span className='ml-[16px]'>{shop.shop_products.length}</span>
                        </div>

                        <div className={`${readMore ? 'items-start' : 'items-center'} flex gap-[10px]`}>
                              <div className='flex gap-[10px] min-w-[150px]'>
                                    <Store size={19} color='gray' className='mt-[-2px]' />
                                    <span className='text-color-main'>Mô tả sản phẩm</span>
                              </div>
                              <div className='ml-[16px] h-max flex flex-col gap-[8px] max-w-[400px]   '>
                                    <p
                                          style={{ height: readMore ? 'max-content' : shop.shop_description.length > 200 ? 180 : 'autp' }}
                                          className={`${readMore ? 'line-clamp-none' : 'line-clamp-6'} break-words text-justify`}
                                    >
                                          {shop.shop_description || 'Chưa có thông tin'}
                                    </p>
                                    {shop.shop_description.length > 200 && (
                                          <button className='underline text-blue-700' onClick={() => setReadMore((prev) => !prev)}>
                                                {readMore ? 'Thu gọn' : 'Đọc thêm'}
                                          </button>
                                    )}
                              </div>
                        </div>

                        <div className='flex items-center gap-[10px]'>
                              <div className='flex gap-[10px] min-w-[150px]'>
                                    <Star size={19} color='gray' className='mt-[-2px]' />
                                    <span className='text-color-main'>Đánh giá</span>
                              </div>
                              <div className='ml-[16px]'>
                                    <div>
                                          <span>{shop.shop_vote.toFixed(1)} / 5</span>

                                          <Rate defaultValue={1} count={1} disabled className='ml-[8px]' />
                                    </div>
                              </div>

                              <p>({shop.shop_count_total_vote}+)</p>
                        </div>
                  </div>
            </div>
      )
}

export default ShopProfile
