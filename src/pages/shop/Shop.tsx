import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import ShopApi from '../../apis/shop.api'
import { Rate } from 'antd'
import LogoOffical from '../../component/Content/assets/img/Label/offical.png'
import ShopSketeton from './ShopSketeton'
import ShopStore from './Components/ShopStore'
import ShopProductAll from './Components/ShopProductAll'
import ShopProfile from './Components/ShopProfile'
import bgCore from './assets/img/bgCore.jpeg'
import ShopSearchProduct from './Components/ShopSearchProduct'
import { useDispatch } from 'react-redux'
import ShopBuild from './ShopBuild'
import { ShopResponse } from '../../types/shop.type'
type TagShopActive = 'Store' | 'AllProduct' | 'Collection' | 'Discount' | 'ProfileShop'
type TagShopLabel = 'Cửa hàng' | 'Tất cả sản phẩm' | 'Bộ sưu tập' | 'Giá sốc hôm nay' | 'Hồ sơ cửa hàng'

const TagTransition: { label: TagShopLabel; value: TagShopActive }[] = [
      {
            label: 'Cửa hàng',
            value: 'Store',
      },
      {
            label: 'Tất cả sản phẩm',
            value: 'AllProduct',
      },

      {
            label: 'Bộ sưu tập',
            value: 'Collection',
      },

      {
            label: 'Giá sốc hôm nay',
            value: 'Discount',
      },

      {
            label: 'Hồ sơ cửa hàng',
            value: 'ProfileShop',
      },
]

const Shop = () => {
      const { shop_id } = useParams()

      const [tagActive, setTagActive] = useState<TagShopActive>('Store')
      const [search, setSeacrh] = useState<string>('')

      const shopQuery = useQuery({
            queryKey: ['/v1/api/shop/get-shop-id', shop_id],
            queryFn: () => ShopApi.getShopId({ shop_id: shop_id as string }),
      })

      useEffect(() => {
            if (search) {
                  setTagActive('AllProduct')
            }
      }, [search])

      const styleEffect = {
            onActive: (check: boolean) => {
                  if (check) return 'pb-[6px] border-b-[2px] border-[#ffffff] rounded-[999px]'
                  return 'pb-[6px] border-b-[2px] border-transparent'
            },
      }

      const shop = shopQuery.data?.data.metadata.shop

      useEffect(() => {}, [shop])

      return (
            <>
                  {shopQuery.isSuccess && (
                        <div className='sticky top-[10px] w-full min-h-screen h-max bg-color-section-theme text-text-theme '>
                              <div className='w-full xl:w-[1240px] mx-auto  h-max'>
                                    <header className='relative w-full h-[300px] xl:h-[150px]'>
                                          <img src={bgCore} className='w-full h-[300px] xl:h-[150px]' alt='background shop' />

                                          <div className='absolute z-[4] w-full h-full inset-0 bg-transparent flex flex-col gap-[60px] xl:gap-0 xl:justify-between p-[18px_24px] content-between '>
                                                <div className='flex  items-center  gap-[18px]'>
                                                      <img
                                                            src={shop?.shop_avatar.secure_url || shop?.shop_avatar_default}
                                                            alt='shop avatar'
                                                            className='w-[60px] h-[60px] object-cover bg-slate-300 rounded-full'
                                                      />
                                                      <div className='flex justify-center flex-col gap-[2px]'>
                                                            <p className='text-white'>{shop?.shop_name}</p>
                                                            <img src={LogoOffical} alt='' className='w-[60px] h-[18px]' />
                                                            <div className='text-[13px] '>
                                                                  <Rate
                                                                        defaultValue={1}
                                                                        count={1}
                                                                        allowHalf
                                                                        disabled
                                                                        className='text-[12px]'
                                                                  />
                                                                  <span className='ml-[8px] text-white'>
                                                                        {shop?.shop_vote.toFixed(2)} / 5 ({shop?.shop_count_total_vote} lượt
                                                                        đánh giá)
                                                                  </span>
                                                            </div>
                                                      </div>
                                                </div>
                                                <div className='pl-[34px] gap-[12px] ml-[-40px] xl:ml-0   h-max min-h-[100px] xl:min-h-[40px] flex flex-col xl:flex-row  items-center w-full mt-[-30px] xl:mt-[16px] overflow-hidden'>
                                                      <div className='w-full h-max min-h-[100px] xl:min-h-[40px] xl:w-[70%] flex items-center justify-between overflow-x-scroll xl:overflow-visible '>
                                                            {TagTransition.map((btn) => (
                                                                  <button
                                                                        className={`relative pb-[4px] xl:pb-[8px] min-w-[150px] w-max h-[50px] xl:h-[30px] text-white text-[14px]`}
                                                                        onClick={() => {
                                                                              if (search) {
                                                                                    setSeacrh('')
                                                                              }
                                                                              setTagActive(btn.value)
                                                                        }}
                                                                        key={btn.value}
                                                                  >
                                                                        <span>{btn.label}</span>
                                                                        {btn.value === tagActive && (
                                                                              <span className='absolute bottom-0 left-[50%] translate-x-[-50%] block w-[24px] h-[4px] bg-[#ffffff] rounded-[999px]'></span>
                                                                        )}
                                                                  </button>
                                                            ))}
                                                      </div>
                                                      <ShopSearchProduct setSearch={setSeacrh} search={search} />
                                                </div>
                                          </div>
                                    </header>
                                    <div className='mt-[40px] w-full min-h-[500px] h-max'>
                                          <>
                                                {tagActive === 'Store' && (
                                                      <ShopStore shop_id={shop?._id as string} shop={shop as ShopResponse} />
                                                )}

                                                {tagActive === 'AllProduct' && (
                                                      <ShopProductAll
                                                            shop={shop as ShopResponse}
                                                            shop_id={shop?._id as string}
                                                            searchName={search}
                                                            setSearch={setSeacrh}
                                                            mode='Search'
                                                      />
                                                )}
                                                {tagActive === 'Collection' && <ShopBuild />}
                                                {tagActive === 'Discount' && <ShopBuild />}
                                                {tagActive === 'ProfileShop' && <ShopProfile shop={shop as ShopResponse} />}
                                          </>
                                    </div>
                              </div>
                        </div>
                  )}

                  {shopQuery.isPending && <ShopSketeton />}
            </>
      )
}

export default Shop
