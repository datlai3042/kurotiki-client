import { useQuery } from '@tanstack/react-query'
import CartService from '../../apis/cart.service'
import CartItem from '../../component/Cart/CartItem'
import CartEmpty from '../../component/Cart/CartEmpty'
import BoxError from '../../component/BoxUi/BoxError'

const OrderCart = () => {
      const getMyCart = useQuery({
            queryKey: ['v1/api/cart/cart-get-my-cart'],
            queryFn: () => CartService.getMyCart(),
      })
      return (
            <div className='min-w-full bg-color-section-theme'>
                  {getMyCart.isSuccess &&
                        getMyCart.data.data.metadata.cart &&
                        getMyCart.data.data.metadata.cart.cart_products.map((product) => (
                              <CartItem product={product} shop={product.shop_id} key={product._id} />
                        ))}

                  {getMyCart.isSuccess &&
                        ((getMyCart.data.data.metadata.cart && getMyCart.data.data.metadata.cart.cart_products.length === 0) ||
                              !getMyCart.data.data.metadata.cart) && (
                              <div className='w-full'>
                                    <CartEmpty />
                              </div>
                        )}
                  {getMyCart.isPending && <div className='animate-pulse w-full h-[700px] bg-slate-200'></div>}
                  {getMyCart.isError && (
                        <div className='h-[500px] w-full bg-color-section-theme flex items-center justify-center'>
                              <BoxError />
                        </div>
                  )}
            </div>
      )
}

export default OrderCart
