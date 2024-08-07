import { useMutation, useQueryClient } from '@tanstack/react-query'
import { memo, useEffect, useState } from 'react'
import CartService, { TModeChangeQuantityProductCart } from '../../apis/cart.service'
import BoxCountProduct from './BoxCountProduct'

type TProps = {
      product_id: string
      cart_quantity: number
      readOnly: boolean
}

const WrapperCountProduct = (props: TProps) => {
      const { product_id, cart_quantity, readOnly } = props
      const [productQuantity, setProductQuantity] = useState<number | undefined>(cart_quantity)
      const queryClient = useQueryClient()

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
            if (mode.mode === 'INPUT') {
                  if (mode.quantity === 0) {
                        setProductQuantity(0)
                        return
                  } else {
                        setProductQuantity(mode.quantity)

                        updateCartQuantityBtn.mutate({ ...mode, product_id })
                        return
                  }
            }
            updateCartQuantityBtn.mutate({ ...mode, product_id })
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
            <BoxCountProduct
                  readOnly={readOnly}
                  getValueChangeQuanity={getValueChangeQuanity}
                  productQuantity={productQuantity}
                  setProductQuantity={setProductQuantity}
                  disable={updateCartQuantityBtn.isPending || readOnly}
            />
      )
}

export default memo(WrapperCountProduct)
