import { useQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import OrderService from '../../apis/Order.service'
import NotFound from '../../component/Errors/NotFound'
import BoxMoney from '../../component/BoxUi/BoxMoney'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { UserResponse } from '../../types/user.type'
import { convertDateToStringFull } from '../../utils/date.utils'
import { renderStringAddressDetailV2 } from '../../utils/address.util'
import { Clock } from 'lucide-react'

const OrderCheck = () => {
      const { order_id } = useParams()
      const user = useSelector((state: RootState) => state.authentication.user) as UserResponse

      const getOrderId = useQuery({
            queryKey: ['get-order', order_id],
            queryFn: () => OrderService.getOrderInfo({ order_id: order_id as string }),
      })

      useEffect(() => {
            if(getOrderId.isSuccess) {

console.log({products: getOrderId.data?.data.metadata})

            }


},[getOrderId.isSuccess])
      if (!order_id) return <NotFound />
      if (!getOrderId.data?.data.metadata.getOrderInfo && getOrderId.isSuccess) return <NotFound />

      const order = getOrderId.data?.data.metadata.getOrderInfo[0]

      
      return (
            <div className='w-[850px] mx-auto bg-[#ffffff] flex flex-col p-[24px_16px_50px] xl:p-[24px_20px_50px] my-[50px]'>
                  {getOrderId.isSuccess && (
                        <React.Fragment>
                              <div className='flex flex-col gap-[36px]'>
                                    {order?.products?.map((product, index) => (
                                          <div className='flex flex-col h-max gap-[40px]' key={product.product_id._id}>
                                                <div className='relative w-[350px] mx-auto h-[1px] bg-slate-400 mt-[36px]'>
                                                      <p className='absolute top-[-50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-max bg-[#ffffff] px-[12px]'>
                                                            Sản phẩm {index + 1}
                                                      </p>
                                                </div>
                                                <div className='flex flex-col xl:flex-row gap-[36px] h-max xl:h-[270px]'>
                                                      <div className='basis-[55%]'>
                                                            <img
                                                                  src={product.product_id.product_thumb_image.secure_url}
                                                                  className='w-full h-full'
                                                                  alt=''
                                                            />
                                                      </div>
                                                      <div className=' basis-[40%] h-full flex flex-col gap-[20px]'>
                                                            <div className='  flex gap-[12px]'>
                                                                  <img
                                                                        src={
                                                                              product.shop_id.shop_avatar?.secure_url ||
                                                                              product.shop_id.shop_avatar_default
                                                                        }
                                                                        className='w-[60px] h-[60px] rounded-full'
                                                                        alt=''
                                                                  />
                                                                  <div className=' flex  flex-col gap-[8px] justify-center'>
                                                                        <p>Cửa hàng: {product.shop_id.shop_name}</p>
                                                                        <p>...</p>
                                                                  </div>
                                                            </div>
                                                            <div className='flex-1 flex flex-col gap-[4px] justify-between'>
                                                                  <p>Tên sản phẩm: {product.product_id.product_name}</p>
                                                                  <p>Số lượng: {product.quantity}</p>
                                                                  <p>Giá: {product.product_id.product_price}</p>
                                                                  <div className='flex gap-[4px] items-center'>
                                                                        <p>Thành tiền</p>
                                                                        <BoxMoney
                                                                              money={product.quantity * product.product_id.product_price}
                                                                              name='VNĐ'
                                                                        />
                                                                  </div>
                                                            </div>
                                                      </div>
                                                </div>
                                                <div className='relative w-full h-[1px] bg-slate-200 mt-[36px]'>
                                                      <span className='absolute top-[-50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-max bg-[#ffffff] px-[12px]'>
                                                            Thông tin người mua
                                                      </span>
                                                </div>
                                                <div className='flex flex-col gap-[28px] h-max'>
                                                      <div className='flex  gap-[20px]'>
                                                            <img
                                                                  src={
                                                                        product.shop_id.shop_avatar?.secure_url ||
                                                                        product.shop_id.shop_avatar_default
                                                                  }
                                                                  className='min-w-[80px] h-[80px] rounded-full'
                                                                  alt=''
                                                            />
                                                            <div className=' flex  flex-col gap-[8px] justify-center'>
                                                                  <p>{user.fullName || user.nickName || user.email}</p>
                                                                  <p>Địa chỉ: {renderStringAddressDetailV2(product.cart_address)}</p>
                                                            </div>
                                                      </div>
                                                </div>
                                                <div className='hidden xl:block relative w-[calc(100%+48px)] ml-[-24px] h-[1px] bg-slate-200 mt-[36px]'></div>
                                          </div>
                                    ))}
                              </div>

                              <div className='flex flex-col gap-[36px]'>
                                    <div className='relative w-full h-[1px] bg-slate-200 mt-[36px]'>
                                          <span className='absolute top-[-50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-max bg-[#ffffff] px-[12px]'>
                                                Thông tin thanh toán
                                          </span>
                                    </div>

                                    <div className='flex gap-[6px] mt-[40px]'>
                                          <span>Thời gian thanh toán:</span>
                                          <span>
                                                {' '}
                                                {convertDateToStringFull(
                                                      getOrderId.data?.data.metadata.getOrderInfo[0]
                                                            .order_time_payment as Date,
                                                )}
                                          </span>
                                    </div>
                                    <p className='flex gap-[8px] items-center'>
                                          <span>Tổng giá trị đơn hàng: </span>
                                          <span className='text-slate-800 font-bold text-[24px]'>
                                                {getOrderId.data?.data.metadata.getOrderInfo[0].order_total}
                                          </span>
                                    </p>
                              </div>
                        </React.Fragment>
                  )}

                  {getOrderId.isPending && (
                        <React.Fragment>
                              <div className='animate-pulse basis-[40%] h-full flex  gap-[20px] bg-slate-300'>
                                    <div className='flex basis-[55%] gap-[12px] '>
                                          <div className='w-[60px] h-[60px] rounded-full'></div>
                                          <div className=' flex  flex-col gap-[8px] justify-center'>
                                                <p></p>
                                                <p></p>
                                          </div>
                                    </div>
                                    <div className=' basis-[45%] flex-1 flex flex-col gap-[4px] justify-between bg-slate-100'>
                                          <p></p>
                                          <p></p>
                                          <p></p>
                                          <div className='flex gap-[4px] items-center'>
                                                <p></p>
                                                <div className=''></div>
                                          </div>
                                    </div>
                              </div>

                              <div className='mt-[40px] w-full h-[250px] bg-slate-400'></div>
                              <div className='mt-[40px] w-full h-[250px] bg-slate-100'></div>
                        </React.Fragment>
                  )}
            </div>
      )
}

export default OrderCheck
