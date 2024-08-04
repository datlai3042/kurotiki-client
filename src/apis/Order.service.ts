import { ParamOrderAdd } from '../pages/payment/PaymentCart'
import { TResponseApi } from '../types/axiosResponse'
import { CartProduct } from '../types/cart.type'
import { Order, OrderItem } from '../types/order.type'
import axiosCustom from './http'

class OrderService {
      static async orderAddProduct(orders: ParamOrderAdd) {
            return axiosCustom.post<TResponseApi<{ message: string; order_success: OrderItem }>>('/v1/api/order/order-payment-product', {
                  orders,
            })
      }

      static async getMyOrder() {
            return axiosCustom.get<TResponseApi<{ order: Order }>>('/v1/api/order/get-my-order')
      }

      static async buyAgain(products: CartProduct[]) {
            return axiosCustom.post<TResponseApi<{ message: string }>>('/v1/api/order/buy-again', { products })
      }

      static async getOrderInfo({ order_id }: { order_id: string }) {
            return axiosCustom.get<TResponseApi<{ getOrderInfo:OrderItem[]  }>>(
                  `/v1/api/order/get-order-info/${order_id}`,
            )
      }
}

export default OrderService
