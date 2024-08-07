import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import CartService from '../../apis/cart.service'
import { Checkbox } from 'antd'
import { Trash2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import AuthPermission from '../Auth/AuthPermission'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import CartItem from './CartItem'
import CartPayMini from './CartPayMini'
import CartUserInfo from './CartUserInfo'
import CartEmpty from './CartEmpty'
import { UserResponse } from '../../types/user.type'
import ContentProduct from '../Content/Components/ContentProduct'
import Loading from '../Common/Loading'

const Cart = () => {
      const user = useSelector((state: RootState) => state.authentication.user) as UserResponse
      const isLoading = useSelector((state: RootState) => state.authentication.isLoading)

      // const [, setCartSelectPay] = useState<Pick<CartResponse, '_id' | 'product_price'>[]>([])
      const queryClient = useQueryClient()
      const [selectAll, setSelectAll] = useState<boolean>(false)

      const getMyCart = useQuery({
            queryKey: ['v1/api/cart/cart-get-my-cart'],
            queryFn: () => CartService.getMyCart(),
            // placeholderData: keepPreviousData,
      })

      const changeSelectAll = useMutation({
            mutationKey: ['v1/api/cart/cart-change-select-all'],
            mutationFn: (value: boolean) => CartService.selectAllCart(value),
            onSuccess: (axiosResponse) => {
                  setSelectAll(axiosResponse.data.metadata.cart.cart_select_all)
                  console.log({ state: axiosResponse.data.metadata.cart.cart_select_all })
                  queryClient.invalidateQueries({
                        queryKey: ['v1/api/cart/cart-get-my-cart'],
                  })

                  queryClient.invalidateQueries({
                        queryKey: ['v1/api/cart/cart-pay'],
                  })
            },
      })

      const onChangeSelectAll = (e: CheckboxChangeEvent) => {
            changeSelectAll.mutate(e.target.checked)
      }

      console.log({ getMyCart: getMyCart.data?.data.metadata.cart })

      useEffect(() => {
            queryClient.invalidateQueries({
                  queryKey: ['cart-get-count-product'],
            })
      }, [])

      useEffect(() => {
            window.scrollTo({
                  top: 0,
                  left: 0,
            })
      }, [])

      useEffect(() => {}, [getMyCart.isPending])

      if (!user && !getMyCart.isPending) {
            return (
                  <div className='h-[calc(100vh-100px)] w-full'>
                        <AuthPermission />
                  </div>
            )
      }

      return (
            <React.Fragment>
                  <div className='w-full max-w-full h-max  overflow-hidden xl:mt-0 flex gap-[12px] text-[13px]'>
                        <div className='px-[8px] w-full pb-[10px]  h-max flex flex-col gap-x-[24px]'>
                              <h3 className='font-extrabold uppercase text-[20px] my-[12px]'>Giỏ hàng</h3>
                              {getMyCart.isSuccess &&
                                    getMyCart.data.data.metadata.cart &&
                                    getMyCart.data.data.metadata.cart.cart_products &&
                                    getMyCart.data.data.metadata.cart.cart_products.length > 0 && (
                                          <React.Fragment>
                                                <div className='sticky top-[70px] xl:top-[-2px] bg-[#f5f4f6]  w-full  xl:w-[75.75%] py-[16px] h-[70px] items-center z-[10]'>
                                                      <div className='bg-[#ffffff] rounded h-[36px] px-[12px] flex items-center'>
                                                            <div className='flex gap-[8px] w-[50%] items-center'>
                                                                  <Checkbox
                                                                        disabled={changeSelectAll.isPending}
                                                                        onChange={onChangeSelectAll}
                                                                        defaultChecked={selectAll}
                                                                        checked={selectAll}
                                                                  ></Checkbox>
                                                                  <span>
                                                                        Tất cả {'('}{' '}
                                                                        {getMyCart.isSuccess &&
                                                                              getMyCart.data.data.metadata.cart.cart_products.length}{' '}
                                                                        sản phẩm {')'}
                                                                  </span>
                                                            </div>
                                                            <div className='hidden xl:block xl:basis-[180px]'>
                                                                  <span>Đơn giá</span>
                                                            </div>
                                                            <div className='hidden xl:block xl:basis-[120px]'>
                                                                  <span>Số lượng</span>
                                                            </div>
                                                            <div className='hidden xl:block xl:basis-[180px]'>
                                                                  <span>Thành tiền</span>
                                                            </div>
                                                            <div className='hidden xl:block xl:basis-[20px]'>
                                                                  <Trash2 />
                                                            </div>
                                                      </div>
                                                </div>
                                                <div className='w-full py-[16px] flex gap-[24px]'>
                                                      <div className='flex flex-col w-[55%] xl:w-[77%] gap-[24px]'>
                                                            {getMyCart.isSuccess &&
                                                                  getMyCart.data.data.metadata.cart.cart_products.length > 0 &&
                                                                  getMyCart.data.data.metadata.cart.cart_products.map((cartItem, index) => {
                                                                        return (
                                                                              <CartItem
                                                                                    key={cartItem._id}
                                                                                    product={cartItem}
                                                                                    shop={cartItem.shop_id}
                                                                              />
                                                                        )
                                                                  })}
                                                      </div>
                                                      <div className='w-[40%] xl:w-[23%] min-h-screen flex flex-col gap-[16px] '>
                                                            <CartUserInfo />

                                                            <div className='sticky top-[120px] xl:top-0 flex flex-col gap-[16px] bg-[#f5f4f6]  w-full h-max pt-[12px]'>
                                                                  <CartPayMini />
                                                            </div>
                                                      </div>
                                                </div>

                                                {getMyCart.isSuccess && getMyCart.data.data.metadata.cart.cart_products.length === 0 && (
                                                      <p>Giỏ hàng hiện tại đang trống</p>
                                                )}
                                          </React.Fragment>
                                    )}

                              {getMyCart.isSuccess &&
                                    (!getMyCart.data.data.metadata.cart ||
                                          getMyCart.data.data.metadata.cart.cart_products.length === 0) && (
                                          <div className='w-full'>
                                                <CartEmpty />
                                                <ContentProduct />
                                          </div>
                                    )}

                              {getMyCart.isPending && <div className='animate-pulse w-full min-h-[500px] bg-gray-200 rounded-lg'></div>}
                        </div>
                  </div>
            </React.Fragment>
      )
}

export default Cart
