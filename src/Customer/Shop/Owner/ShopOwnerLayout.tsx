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

type TProps = {
      shop: ShopResponse
}

type FilterMode = 'PRODUCT_SHOP' | 'PRODUCT_SHOP_BOUGHT' | 'NAVIGATE_SHOP_PUBLIC'

const ShopOwnerLayout = (props: TProps) => {
      const { shop } = props
      const user = useSelector((state: RootState) => state.authentication.user) as UserResponse
      const [filterMode, setfilterMode] = useState<FilterMode>('PRODUCT_SHOP')
      const [openForm, setOpenForm] = useState<boolean>(false)
      const defaultValues = user?.isOpenShop
            ? { shop_name: shop.shop_name, shop_avatar: shop.shop_avatar?.secure_url, shop_description: shop.shop_description }
            : { shop_name: '', shop_avatar: '', shop_description: '' }

      const styleEffect = {
            onActive: (check: boolean) => {
                  if (check) return 'bg-color-main text-[#fff] rounded'
                  return 'bg-white text-slate-900 rounded hover:bg-color-main hover:text-[#fff]'
            },
      }

      return (
            <div className='relative w-full min-h-[200px] h-max flex flex-col'>
                  <div className='relative w-full h-[160px] xl:h-[100px] bg-color-section-theme flex items-center justify-center'>
                        <p className='tracking-[2px] text-[18px] mt-[-60px] xl:mt-0'>{shop.shop_name}</p>
                        <button
                              className='absolute bottom-[10px] right-[20px] min-w-[150px] w-max h-[40px] p-[8px_14px] bg-color-main opacity-80 hover:opacity-100 text-[#fff]'
                              onClick={() => setOpenForm(true)}
                        >
                              Chỉnh sửa thông tin
                        </button>
                  </div>
                  <div className='relative w-full min-h-[140px] py-[30px] xl:py-0 h-max bg-[#FFA500] flex items-center'>
                        <div className='absolute top-[-50%] translate-y-[137%] xl:translate-y-0 left-[20px]  xl:left-[60px]  w-[70px] h-[70px] xl:h-[140px] xl:w-[140px] rounded-full'>
                              <BoxAvatarMode
                                    AvatartSource={{ avatar: shop.shop_avatar?.secure_url, avatar_default: shop.shop_avatar_default }}
                                    widthImage='w-[140px]'
                                    heightImage='h-[140px]'
                                    Mode='SHOP'
                              />
                              {/* <img src={shop.shop_avatar_default} className='h-full w-full rounded-full' alt='shop_image' /> */}
                        </div>

                        <div className='ml-[20px] mt-[100px] xl:mt-0 xl:ml-[240px] flex flex-col xl:flex-row min-h-[40px] xl:items-center gap-[16px]'>
                              <button
                                    className={`${styleEffect.onActive(
                                          filterMode === 'PRODUCT_SHOP',
                                    )} px-[16px] py-[12px]   transition-all duration-500`}
                                    onClick={() => setfilterMode('PRODUCT_SHOP')}
                              >
                                    Sản phẩm của Shop
                              </button>

                              <button
                                    className={`${styleEffect.onActive(
                                          filterMode === 'PRODUCT_SHOP_BOUGHT',
                                    )} px-[16px] py-[12px]  transition-all duration-500`}
                                    onClick={() => setfilterMode('PRODUCT_SHOP_BOUGHT')}
                              >
                                    Các sản phẩm bán chạy
                              </button>
                              <Link
                                    to={`/shop/${shop._id}`}
                                    className={`${styleEffect.onActive(
                                          filterMode === 'NAVIGATE_SHOP_PUBLIC',
                                    )} px-[16px] py-[12px]  transition-all duration-500`}
                                    onClick={() => setfilterMode('NAVIGATE_SHOP_PUBLIC')}
                              >
                                    Trang cửa hàng công khai
                              </Link>
                        </div>
                  </div>

                  <div className=' w-full h-max mt-[16px]'>{filterMode === 'PRODUCT_SHOP' && <OwnerShopFilterName shop={shop} />}</div>
                  <div className=' w-full h-max mt-[16px]'>{filterMode === 'PRODUCT_SHOP_BOUGHT' && <ShopBoughtWrapper shop={shop} />}</div>

                  {openForm && (
                        <BoxShopForm onClose={setOpenForm} modeForm={user.isOpenShop ? 'UPDATE' : 'UPLOAD'} defaultValues={defaultValues} />
                  )}
            </div>
      )
}

export default ShopOwnerLayout
