import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import CartService from '../../apis/cart.service'
import { Checkbox } from 'antd'
import { Trash2 } from 'lucide-react'
import { useSelector } from 'react-redux'
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
import BoxLoading from '../BoxUi/BoxLoading'
import CartItemPage from './CartItemPage'

const Cart = () => {
      const user = useSelector((state: RootState) => state.authentication.user) as UserResponse

      const queryClient = useQueryClient()
      const [selectAll, setSelectAll] = useState<boolean>(false)

      const getMyCart = useQuery({
            queryKey: ['v1/api/cart/cart-get-my-cart'],
            queryFn: () => CartService.getMyCart(),
      })

      const changeSelectAll = useMutation({
            mutationKey: ['v1/api/cart/cart-change-select-all'],
            mutationFn: (value: boolean) => CartService.selectAllCart(value),
            onSuccess: (axiosResponse) => {
                  setSelectAll(axiosResponse.data.metadata.cart.cart_select_all)

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

      if (!user) {
            if (getMyCart?.isLoading) {
                  return (
                        <div className='h-[500px] w-full'>
                              <Loading />
                        </div>
                  )
            } else {
                  return (
                        <div className='h-[calc(100vh-100px)] w-full'>
                              <AuthPermission />
                        </div>
                  )
            }
      }

      const products = getMyCart.data?.data?.metadata?.cart?.cart_products || []

      return (
            <React.Fragment>
                  <div className='w-full text-[13px] text-text-theme'>
                        <div className='mx-auto w-full max-w-[1480px] px-3 pb-10 pt-3 sm:px-4 xl:px-0'>
                              <div className='mb-4 flex items-end justify-between gap-4'>
                                    <div>
                                          <h3 className='text-[24px] font-bold tracking-[-0.02em] text-text-theme'>Giỏ hàng</h3>
                                          <p className='mt-1 text-[12px] text-slate-400'>
                                                Kiểm tra sản phẩm, địa chỉ và tổng tiền trước khi thanh toán
                                          </p>
                                    </div>

                                    {products.length > 0 && (
                                          <span className='hidden rounded-full bg-blue-500/10 px-3 py-1.5 text-[11px] font-medium text-blue-600 dark:text-blue-400 sm:inline-flex'>
                                                {products.length} sản phẩm
                                          </span>
                                    )}
                              </div>

                              {getMyCart.isSuccess && getMyCart.data.data.metadata.cart && products.length > 0 && (
                                    <div className='grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_340px] xl:gap-5'>
                                          <div className='min-w-0'>
                                                <div className='mb-3 hidden h-[54px] grid-cols-[36px_104px_minmax(0,1fr)_120px_128px_132px] items-center gap-5 rounded-2xl border border-slate-200/70 bg-color-section-theme px-5 text-[12px] font-medium text-slate-500 shadow-[0_4px_16px_rgba(15,23,42,0.025)] dark:border-white/[0.07] dark:text-slate-400 xl:grid'>
                                                      <div className='flex justify-center'>
                                                            <Checkbox
                                                                  disabled={changeSelectAll.isPending}
                                                                  onChange={onChangeSelectAll}
                                                                  defaultChecked={selectAll}
                                                                  checked={selectAll}
                                                            />
                                                      </div>

                                                      <div className='col-span-2 flex items-center gap-2'>
                                                            <span className='font-semibold text-text-theme'>Tất cả</span>
                                                            <span>({products.length} sản phẩm)</span>
                                                      </div>

                                                      <span>Đơn giá</span>
                                                      <span className='text-center'>Số lượng</span>
                                                      <div className='flex items-center justify-between'>
                                                            <span>Thành tiền</span>
                                                            <Trash2 size={17} className='text-slate-400' />
                                                      </div>
                                                </div>

                                                <div className='mb-3 flex items-center justify-between rounded-xl border border-slate-200/70 bg-color-section-theme px-4 py-3 shadow-[0_4px_16px_rgba(15,23,42,0.025)] dark:border-white/[0.07] xl:hidden'>
                                                      <div className='flex items-center gap-2'>
                                                            <Checkbox
                                                                  disabled={changeSelectAll.isPending}
                                                                  onChange={onChangeSelectAll}
                                                                  defaultChecked={selectAll}
                                                                  checked={selectAll}
                                                            />
                                                            <span className='text-[13px] font-medium'>
                                                                  Tất cả ({products.length} sản phẩm)
                                                            </span>
                                                      </div>
                                                </div>

                                                <div className='flex flex-col gap-3'>
                                                      {products.map((cartItem) => (
                                                            <CartItemPage key={cartItem._id} product={cartItem} shop={cartItem.shop_id} />
                                                      ))}
                                                </div>
                                          </div>

                                          <aside className='min-w-0'>
                                                <div className='flex flex-col gap-3 lg:sticky lg:top-[88px]'>
                                                      <CartUserInfo products={products} />
                                                      <CartPayMini />
                                                </div>
                                          </aside>
                                    </div>
                              )}

                              {getMyCart.isSuccess && (!getMyCart.data.data.metadata.cart || products.length === 0) && (
                                    <div className='flex w-full flex-col gap-5'>
                                          <CartEmpty />
                                          <ContentProduct />
                                    </div>
                              )}

                              {getMyCart.isPending && (
                                    <div className='skeleton__container flex min-h-[500px] w-full items-center justify-center gap-3 rounded-2xl border border-slate-200/70 bg-color-section-theme dark:border-white/[0.07]'>
                                          <BoxLoading />
                                          <span className='text-slate-500'>Đang tải giỏ hàng</span>
                                    </div>
                              )}
                        </div>
                  </div>
            </React.Fragment>
      )
}

export default Cart
