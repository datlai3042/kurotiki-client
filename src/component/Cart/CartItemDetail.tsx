import React, { SetStateAction, useState } from 'react'
import { CartProduct } from '../../types/cart.type'
import BoxMoney from '../BoxUi/BoxMoney'
import WrapperCountProduct from '../BoxUi/WrapperCountProduct'
import { Building2, Home, TentTree, Trash2 } from 'lucide-react'
import BoxConfirmDelete from '../BoxUi/confirm/BoxConfirmDelete'
import { formatMoneyVND } from '../../utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import CartService from '../../apis/cart.service'
import { DateTimeFromString } from '../../utils/datetime.util'
import BoxButton from '../BoxUi/BoxButton'
import BoxConfirmAddress from '../BoxUi/confirm/BoxConfirmAddress'
import { Link } from 'react-router-dom'

type TProps = {
      product: CartProduct
      setOpenModel: React.Dispatch<SetStateAction<boolean>>
}

const CartItemDetail = (props: TProps) => {
      const { product, setOpenModel } = props

      const [openBoxConfirmDelete, setOpenBoxConfirmDelete] = useState<boolean>(false)
      const [openBoxCofirmUpdateAddress, setOpenBoxConfirmUpdateAddress] = useState<boolean>(false)
      const queryClient = useQueryClient()

      const deleteCartWithProductId = useMutation({
            mutationKey: ['/v1/api/cart/cart-delete/:product_id'],
            mutationFn: ({ product_id }: { product_id: string }) => CartService.deleteCart({ product_id }),
            onSuccess: () => {
                  queryClient.invalidateQueries({
                        queryKey: ['v1/api/cart/cart-get-my-cart'],
                  })

                  queryClient.invalidateQueries({
                        queryKey: ['v1/api/cart/cart-pay'],
                  })

                  queryClient.invalidateQueries({
                        queryKey: ['cart-get-count-product'],
                  })
            },
      })

      const onDeleteCart = ({ product_id }: { product_id: string }) => {
            deleteCartWithProductId.mutate({ product_id })
      }

      const AddressTypeIcon =
            product.cart_address.type === 'Home' ? <Home /> : product.cart_address.type === 'Company' ? <Building2 /> : <TentTree />

      const AddressTypeText =
            product.cart_address.type === 'Home' ? 'Nhà' : product.cart_address.type === 'Company' ? 'Công ty / cơ quan' : 'Nơi ở riêng tư'

      return (
            <>
                  <div
                        className='fixed w-full min-h-screen top-0 left-0 flex justify-center items-center bg-[rgba(0,0,0,.7)] z-[999] px-[15px]'
                        onClick={() => {
                              // setShowBoxAuth(false)
                        }}
                  >
                        <div
                              className='animate-authBox relative w-[420px] max-w-[420px] bg-white min-h-[400px] h-auto shadow-lg rounded-lg p-[26px] flex flex-col gap-[1.4rem]'
                              onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => e.stopPropagation()}
                        >
                              <span>Tên sản phẩm: {product.product_id.product_name}</span>
                              <Link
                                    className='inline-block w-[100px] xl:w-[90px] h-[100px] xl:h-[80px]'
                                    to={`/product/${product.product_id._id}`}
                              >
                                    <img
                                          src={product.product_id.product_thumb_image.secure_url}
                                          className='max-w-full max-h-full h-full'
                                          alt='product'
                                    />{' '}
                              </Link>

                              <div className='w-[180px] flex items-center  xl:my-[4px] mt-[20px] xl:mt-0 '>
                                    Giá tiền
                                    <BoxMoney name='VND' money={product.product_id.product_price} colorBackground='bg-blue-600' />
                              </div>
                              <div className='w-[180px]  xl:my-0 flex items-center text-[14px] gap-[2px]'>
                                    Số lượng:
                                    <BoxMoney name='VNĐ' money={product.quantity * product.product_id.product_price} />
                              </div>
                              <div className='w-[120px] flex items-center h-max xl:h-full  xl:my-0'>
                                    <WrapperCountProduct
                                          readOnly={!product.product_id.product_state}
                                          product_id={product.product_id._id}
                                          cart_quantity={product.quantity}
                                    />
                              </div>

                              <div className='max-h-[36%] flex flex-wrap flex-col xl:flex-row justify-between ml-0 xl:ml-[16px]  gap-[24px] xl:gap-[16px]'>
                                    <div className='flex xl:flex-col  gap-[8px] text-slate-800 text-[12px] xl:text-[16px] font-extrabold'>
                                          {/* <TimerIcon className='hidden xl:block' /> */}
                                          <span>Đặt hàng vào lúc:</span>
                                          <span>{DateTimeFromString(product.cart_date)}</span>
                                    </div>
                                    <div className='flex flex-col   gap-[20px] xl:gap-[10px] xl:w-[80%]'>
                                          <p className='flex gap-[16px] xl:gap-[8px] items-center'>
                                                <span className='mt-[-4px]'>{AddressTypeIcon}</span>
                                                <span>Giao tại nhà: {AddressTypeText}</span>
                                          </p>
                                          <span className='hidden xl:inline'>-</span>
                                          <span>Địa chỉ {product.cart_address.address_text}</span>
                                          <div className='w-max'>
                                                <BoxButton
                                                      content='Cập nhập địa chỉ khác'
                                                      onClick={() => setOpenBoxConfirmUpdateAddress(true)}
                                                />
                                                {openBoxCofirmUpdateAddress && (
                                                      <BoxConfirmAddress
                                                            setOpenModal={setOpenBoxConfirmUpdateAddress}
                                                            product_id={product.product_id._id}
                                                            mode='Update'
                                                            cart_item={product}
                                                      />
                                                )}
                                          </div>
                                    </div>
                              </div>

                              <div className='w-[20px] flex items-center  xl:my-0'>
                                    <Trash2 onClick={() => setOpenBoxConfirmDelete(true)} />
                                    {openBoxConfirmDelete && (
                                          <BoxConfirmDelete
                                                content='Bạn sẽ xóa sản phẩm này chứ'
                                                subContent={
                                                      product.product_id.product_name +
                                                      ' ' +
                                                      `SL:${product.quantity}` +
                                                      ' ' +
                                                      `Giá: ${formatMoneyVND(product.quantity * product.product_id.product_price)}` +
                                                      ' ' +
                                                      'VNĐ'
                                                }
                                                ButtonCancellContent='Hủy'
                                                ButtonConfrimContent='Xác nhận xóa'
                                                onClose={setOpenBoxConfirmDelete}
                                                onActive={onDeleteCart}
                                                paramsActive={{ product_id: product._id }}
                                          />
                                    )}
                              </div>

                              <button
                                    className='absolute top-[-10px] right-[-5px] w-[36px] h-[36px] border-[1px] border-slate-900 bg-white hover:bg-slate-900 hover:text-white  rounded-full flex justify-center items-center'
                                    onClick={() => setOpenModel(false)}
                              >
                                    X
                              </button>
                        </div>
                  </div>
            </>
      )
}

export default CartItemDetail
