import React from 'react'
import CartEmptyImage from './img/cart_empty.png'

const CartEmpty = () => {
      return (
            <div className='w-full flex flex-col gap-[16px]'>
                  <div className='w-full h-[400px]  bg-color-section-theme text-text-theme  flex flex-col items-center justify-center gap-[16px] text-[14px] xl:text-[20px]'>
                        <img className='w-[150px] h-[150px]' src={CartEmptyImage} alt='product_carts' />
                        <div className='flex flex-col items-center gap-[8px]'>
                              <span className='font-bold'>Giỏ hàng trống</span>
                              <span className='text-[20px] text-center'>
                                    Bạn tham khảo thêm các sản phẩm được Tiki gợi ý bên dưới nhé!
                              </span>
                        </div>
                  </div>
            </div>
      )
}

export default CartEmpty
