import React, { useEffect, useState } from 'react'
import { TProductDetail } from '../../types/product/product.type'
import ProductLabel from './ProductLabel'
import { Rate } from 'antd'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import CartService from '../../apis/cart.service'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import { UserResponse } from '../../types/user.type'
import { CartCurrent } from '../../Redux/cartSlice'
import { doOpenBoxLogin } from '../../Redux/authenticationSlice'
import { Address } from '../../types/address.type'
import { checkAxiosError } from '../../utils/handleAxiosError'
import { addOneToastSuccess, addOneToastWarning } from '../../Redux/toast'

type TProps = {
      product: TProductDetail
}

export type ProductCart = {
      cart_address: Address
      shop_id: string
      product_id: string
      product_name: string
      product_price: number
      quantity: number
}

const ProductPay = (props: TProps) => {
      const { product } = props
      const user = useSelector((state: RootState) => state.authentication.user) as UserResponse
      const cartCurrent = useSelector((state: RootState) => state.cartSlice.cart_current) as CartCurrent
      const [productQuantity, setProductQuantity] = useState<number>(1)
      const [disabledBtn, setDisableBtn] = useState<boolean>(false)

      const dispatch = useDispatch()
      const queryClient = useQueryClient()

      const cartMutation = useMutation({
            mutationKey: ['add-cart'],
            mutationFn: ({ cart }: { cart: ProductCart }) => CartService.addCart({ cart }),
            onSuccess: () => {},
            onError: (error: unknown) => {
                  if (checkAxiosError<{ code: number; message: string; detail: string }>(error)) {
                        if (
                              error.response?.data.code === 400 &&
                              error.response.data.message === 'Bad Request' &&
                              error.response.data.detail === 'Số lượng sản phẩm được chọn nhiều hơn số lượng trong kho'
                        ) {
                              dispatch(
                                    addOneToastWarning({
                                          toast_item: {
                                                type: 'WARNING',
                                                _id: Math.random().toString(),
                                                core: {
                                                      message: error.response.data.detail,
                                                },
                                                toast_title: 'Thiếu thông tin',
                                          },
                                    }),
                              )
                        }
                  }
            },
      })

      const handleIncreaseProductQuantity = () => {
            // if(productQuantity === 1) return
            setProductQuantity((prev) => (prev! += 1))
      }

      const handleDecreaseProductQuantity = () => {
            if (productQuantity === 1) return
            setProductQuantity((prev) => (prev! -= 1))
      }

      const handleClickBuy = () => {
            console.log('OK')
            if (!user) {
                  dispatch(doOpenBoxLogin())
                  return
            }

            if (user._id === product.shop_id.owner._id) {
                  dispatch(
                        addOneToastWarning({
                              toast_item: {
                                    type: 'WARNING',
                                    _id: Math.random().toString(),
                                    core: {
                                          message: 'Không thể thêm sản phẩm của chính mình',
                                    },
                                    toast_title: 'Lỗi',
                              },
                        }),
                  )
                  return
            }

            if (!Boolean(cartCurrent.cart_current_address)) {
                  dispatch(
                        addOneToastWarning({
                              toast_item: {
                                    type: 'WARNING',
                                    _id: Math.random().toString(),
                                    core: {
                                          message: 'Vui lòng chọn địa chỉ trước khi thêm',
                                    },
                                    toast_title: 'Thiếu thông tin',
                              },
                        }),
                  )
                  setDisableBtn(true)
                  return
            }

            // if (cartCurrent) {
            //       console.log({ cartCurrent })
            //       return
            // }

            console.log({ product: { ...product, productQuantity, price: product.product_price * (productQuantity || 1) } })
            const formData = new FormData()
            formData.append('product_id', product._id)
            const payload: ProductCart = {
                  shop_id: product.shop_id._id,
                  product_id: product._id,
                  product_name: product.product_name,
                  product_price: product.product_price,
                  quantity: productQuantity,
                  cart_address: {
                        address_text: cartCurrent.cart_current_address,
                        address_street: cartCurrent.cart_current_address,
                        address_ward: {
                              code: cartCurrent.cart_current_address_ward.code,
                              text: cartCurrent.cart_current_address_ward.text,
                        },
                        address_district: {
                              code: cartCurrent.cart_current_address_district.code,
                              text: cartCurrent.cart_current_address_district.text,
                        },
                        address_province: {
                              code: cartCurrent.cart_current_address_province.code,
                              text: cartCurrent.cart_current_address_province.text,
                        },
                        type: cartCurrent.cart_current_address_type,
                  },
            }
            cartMutation.mutate({ cart: payload })
      }

      useEffect(() => {
            console.log('ol')
            setDisableBtn(false)
      }, [cartCurrent.cart_current_address])

      console.log({ productQuantity })

      useEffect(() => {
            if (cartMutation.isSuccess) {
                  dispatch(
                        addOneToastSuccess({
                              toast_item: {
                                    type: 'SUCCESS',
                                    core: { message: 'Đã thêm công vào giỏ hàng' },
                                    _id: Math.random().toString(),
                                    toast_title: 'Thành công',
                              },
                        }),
                  )
                  queryClient.invalidateQueries({
                        queryKey: ['v1/api/cart/cart-get-my-cart'],
                  })

                  queryClient.invalidateQueries({ queryKey: ['cart-get-count-product'] })
            }
      }, [cartMutation.isSuccess, cartMutation.data?.data, dispatch, queryClient])

      return (
            <section className='w-full h-full flex flex-col gap-[16px] p-[12px] text-[12px] xl:text-[14px]'>
                  <div className='flex flex-col xl:flex-row items-center gap-[8px] pb-[15px] border-b-[1px] border-slate-200'>
                        <img
                              src={product.shop_id.shop_avatar?.secure_url || product.shop_id.shop_avatar_default}
                              className='w-[40px] h-[40px] rounded-md'
                              alt=''
                        />
                        <div className='flex-1 flex flex-col content-center py-[2px] gap-[8px] '>
                              <div className='flex flex-col lg:flex-row gap-[8px] items-center transition-all duration-500'>
                                    <span className='font-bold'>{product.shop_id.shop_name}</span>
                                    <ProductLabel content='Official' />
                              </div>
                              <div className='flex flex-col lg:flex-row items-center gap-[6px] transition-all duration-500'>
                                    <div className='flex gap-[8px] items-center'>
                                          <span>4.5</span>
                                          <Rate defaultValue={1} count={1} className='w-max text-[13px]' disabled style={{ width: 2 }} />
                                    </div>
                                    <span className='flex-1'>(5.4tr+ đánh giá)</span>
                              </div>
                        </div>
                  </div>
                  <div className='flex flex-col gap-[12px]'>
                        <span className='font-bold'>Số lượng</span>
                        <img src={product.product_thumb_image.secure_url} className='w-[40px] h-[40px]' alt='' />
                        <div className='flex gap-[8px] max-w-max h-[30px]'>
                              <button
                                    className='flex items-center justify-center p-[6px] border-[1px] border-slate-400 min-w-[36px] h-full text-[20px] rounded-md'
                                    onClick={handleDecreaseProductQuantity}
                                    disabled={productQuantity === 1 ? true : false}
                              >
                                    -
                              </button>
                              <input
                                    onWheel={(e) => (e.target as HTMLElement).blur()}
                                    onChange={(e) => {
                                          if (!e.target.value) setProductQuantity(0)
                                          if (Number(e.target.value) > 999) return
                                          if (Number(e.target.value) === 0) {
                                                // setProductQuantity(1)
                                                setProductQuantity(0)
                                                return
                                          }
                                          setProductQuantity(Number(e.target.value))
                                    }}
                                    onBlur={(e) => {
                                          if (!e.target.value) {
                                                setProductQuantity(1)
                                          }
                                    }}
                                    value={productQuantity || 0}
                                    type='number'
                                    className='flex items-center justify-center border-[1px] border-slate-400 w-[40px]  h-full text-[16px] text-center rounded-md'
                              />
                              <button
                                    className='flex items-center justify-center p-[6px] border-[1px] border-slate-400 min-w-[36px] h-full text-[20px] rounded-md'
                                    onClick={handleIncreaseProductQuantity}
                              >
                                    +
                              </button>
                        </div>
                  </div>
                  <div className='font-bold flex flex-col gap-[8px] text-[14px] xl:text-[18px]'>
                        <span className=''>Tạm tính</span>
                        <p className='w-full flex gap-[4px] items-center  text-[16px] xl:text-[24px]'>
                              <span className='min-w-[70px] xl:min-w-max  max-w-[180px] truncate'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                                          .format(product.product_price * (productQuantity ? productQuantity : 0))
                                          .replace('₫', '')}
                              </span>
                              <span className='hidden xl:inline ml-[-2px]'>VNĐ</span>
                        </p>
                  </div>
                  <div className='w-full h-max flex flex-col gap-[8px]'>
                        <button
                              onClick={handleClickBuy}
                              className='w-full h-[45px] flex items-center justify-center bg-red-600 text-white rounded-md'
                        >
                              Mua ngay
                        </button>
                        <button
                              disabled={disabledBtn || cartMutation.isPending}
                              className='w-full h-[45px] flex items-center justify-center bg-white text-blue-600 border-[1px] border-blue-600 rounded-md font-semibold text-[16px]'
                              onClick={handleClickBuy}
                        >
                              Thêm vào giỏ
                        </button>
                  </div>
            </section>
      )
}

export default ProductPay
