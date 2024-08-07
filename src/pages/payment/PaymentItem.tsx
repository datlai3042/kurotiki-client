import { Building2, Car, Home, ShoppingBag, TentTree } from 'lucide-react'
import BoxMoney from '../../component/BoxUi/BoxMoney'
import { CartProduct } from '../../types/cart.type'

type TProps = {
      product: CartProduct
      index: number
}

const PaymentItem = (props: TProps) => {
      const { product, index } = props

      const AddressTypeIcon =
            product.cart_address.type === 'Home' ? <Home /> : product.cart_address.type === 'Company' ? <Building2 /> : <TentTree />

      const AddressTypeText =
            product.cart_address.type === 'Home' ? 'Nhà' : product.cart_address.type === 'Company' ? 'Công ty / cơ quan' : 'Nơi ở riêng tư'

      return (
            <div className='w-full min-h-[300px] xl:min-h-[250px] h-max relative z-[2] border-[1px] border-slate-300 rounded-lg text-[11px] xl:text-[13px]'>
                  <div className='absolute top-[-25px] left-[12px] h-[50px] bg-[#ffffff] z-[3] px-[8px] text-green-600 flex items-center gap-[8px]'>
                        <ShoppingBag />
                        <span>Gói {index}:</span>
                        <span>Giao đúng chiều thứ 4, 13h - 18h, 21/02</span>
                  </div>
                  <div className='mt-[30px]  px-[25px] flex flex-col gap-[8px]'>
                        <div className='flex flex-col xl:flex-row justify-between items-start h-[80px] xl:h-[40px]'>
                              <span className='uppercase w-max h-full flex items-center'>Giao tiết kiệm</span>
                              <span className='w-max h-full flex items-center'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(14000).replace('₫', '')}
                              </span>
                              <div className='w-[90%] xl:w-[300px] h-[40px] bg-[#ffffff]  rounded-md flex items-center px-[16px] gap-[8px] text-[14px]'>
                                    <Car />
                                    <p>Được giao bởi <span className='text-blue-400 font-semibold'>Kurotiki</span></p>
                              </div>
                        </div>

                        <div className='mt-[30px] xl:mt-0 h-[60px] flex mb-[16px]'>
                              <div className='min-w-[160px] xl:min-w-[260px] h-[50px] flex gap-[16px] '>
                                    <img
                                          src={product.product_id.product_thumb_image?.secure_url}
                                          className='h-full w-[70px]'
                                          alt='product'
                                    />
                                    <div className='flex flex-col justify-between text-[13px]'>
                                          <span>{product.product_id.product_name}</span>
                                          <span>SL:x{product.quantity}</span>
                                    </div>
                              </div>
                              <div className='flex-1 flex h-[50px] items-end'>
                                    <BoxMoney name='VNĐ' money={product.quantity * product.product_id.product_price} />
                              </div>
                        </div>
                  </div>

                  <div className='mt-[30px] px-[25px] text-[14px] text-slate-800'>
                        <div className='flex items-center gap-[8px]'>
                              <p className='flex gap-[8px] items-center'>
                                    <span className='mt-[-4px]'>{AddressTypeIcon}</span>
                                    <span>{AddressTypeText}</span>
                              </p>
                              <span>-</span>
                              <span>Địa chỉ {product.cart_address.address_text}</span>
                        </div>
                  </div>
            </div>
      )
}

export default PaymentItem
