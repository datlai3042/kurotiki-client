import React, { memo, useEffect, useState } from 'react'
import BoxCountProduct from './BoxCountProduct'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import CartService, { TModeChangeQuantityProductCart } from '../../apis/cart.service'
import BoxConfirmDelete from './confirm/BoxConfirmDelete'
import { CartProduct, CartProductRef } from '../../types/cart.type'
import { formatMoneyVND } from '../../utils'

type TProps = {
      product_id: string
      cart_quantity: number
      readOnly: boolean
      product: CartProduct | null
      modeAction?: 'ADD' | 'EDIT'
}

const WrapperCountProduct = (props: TProps) => {
      const { product_id, cart_quantity, readOnly, product, modeAction = 'ADD' } = props
      const [productQuantity, setProductQuantity] = useState<number>(cart_quantity || 1)
      const queryClient = useQueryClient()
      const [openBoxConfirmDelete, setOpenBoxConfirmDelete] = useState<boolean>(false)
      const deleteCartWithProductId = useMutation({
            mutationKey: ['/v1/api/cart/cart-delete/:product_id'],
            mutationFn: ({ product_id, cart_item_id }: { product_id: string, cart_item_id: string }) => CartService.deleteCart({ product_id, cart_item_id }),
            onSuccess: () => {
                  queryClient.invalidateQueries({
                        queryKey: ['v1/api/cart/cart-get-my-cart'],
                  })
                  setOpenBoxConfirmDelete(false)
                  queryClient.invalidateQueries({
                        queryKey: ['v1/api/cart/cart-pay'],
                  })

                  queryClient.invalidateQueries({
                        queryKey: ['cart-get-count-product'],
                  })
            },
      })

      const onDeleteCart = ({ product_id, cart_item_id }: { product_id: string, cart_item_id: string }) => {
            deleteCartWithProductId.mutate({ product_id, cart_item_id })
      }

      useEffect(() => {
            setProductQuantity(cart_quantity)
      }, [cart_quantity, productQuantity])

      const updateCartQuantityBtn = useMutation({
            mutationKey: ['v1/api/cart/cart-change-quantity'],
            mutationFn: (data: TModeChangeQuantityProductCart) => CartService.changeQuantityProductCart(data),
            onSuccess: (data) => {
                  setProductQuantity(data.data.metadata.quantity)
                  queryClient.invalidateQueries({
                        queryKey: ['v1/api/cart/cart-get-my-cart'],
                  })

                  queryClient.invalidateQueries({
                        queryKey: ['v1/api/cart/cart-pay'],
                  })
            },
      })

      const getValueChangeQuanity = (mode: TModeChangeQuantityProductCart) => {
            if (mode.mode === 'DECREASE') {
                  if (modeAction === 'EDIT') {
                        if (mode.quantity === 0 || productQuantity + mode.quantity < 1) {
                              setOpenBoxConfirmDelete(true)
                              return
                        }
                  } else {
                        if (mode.quantity === 0 || productQuantity + mode.quantity < 0) {
                              setProductQuantity(0)
                              return
                        }
                  }
            }
            if (mode.mode === 'INPUT') {
                  if (mode.quantity === 0 || mode.quantity < 0) {
                        setOpenBoxConfirmDelete(true)
                        setProductQuantity(0)
                        return
                  } else {
                        setProductQuantity(mode.quantity)

                        updateCartQuantityBtn.mutate({ ...mode,  cart_item_id: product?._id })
                        return
                  }
            }
            updateCartQuantityBtn.mutate({ ...mode, product_id,  cart_item_id: product?._id  })
      }

      useEffect(() => {
            if (updateCartQuantityBtn.isSuccess) {
                  setProductQuantity(updateCartQuantityBtn.data.data.metadata.quantity)
                  // queryClient.invalidateQueries({
                  //       queryKey: ['v1/api/cart/cart-get-my-cart'],
                  // })
            }
      }, [updateCartQuantityBtn.isSuccess, updateCartQuantityBtn?.data?.data.metadata.quantity])

      return (
            <>
                  <BoxCountProduct
                        readOnly={readOnly}
                        getValueChangeQuanity={getValueChangeQuanity}
                        productQuantity={productQuantity}
                        setProductQuantity={setProductQuantity}
                        disable={updateCartQuantityBtn.isPending || readOnly}
                  />

                  {openBoxConfirmDelete && (
                        <BoxConfirmDelete
                              content='Bạn sẽ xóa sản phẩm này chứ'
                              subContent={
                                    <div className='flex justify-between gap-[10px]'>
                                          <div className='flex-1 flex flex-col gap-[8px]'>
                                                <span>{product!.product_id.product_name}</span>
                                                <div className='w-full justify-end gap-[8px]'>
                                                      <div className='flex gap-[8px]'>
                                                            <span>Số lượng:</span>
                                                            <span>{cart_quantity}</span>
                                                      </div>

                                                      <div className='flex gap-[8px]'>
                                                            <span>Giá:</span>
                                                            <span>{formatMoneyVND(cart_quantity * product!.product_id.product_price)}</span>
                                                      </div>
                                                </div>
                                          </div>
                                          <img
                                                src={product?.product_id.product_thumb_image.secure_url}
                                                className='w-[80px] aspect-square object-contain'
                                          />
                                    </div>
                              }
                              ButtonCancellContent='Hủy'
                              ButtonConfrimContent='Xác nhận xóa'
                              onClose={setOpenBoxConfirmDelete}
                              onActive={onDeleteCart}
                              paramsActive={{ product_id: product!._id, cart_item_id: product!._id }}
                        />
                  )}
            </>
      )
}

export default memo(WrapperCountProduct)
