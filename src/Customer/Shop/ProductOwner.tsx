import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import DeleteProduct from './components/DeleteProduct'
import { TProductDetail } from '../../types/product/product.type'

type TProps = {
      product: TProductDetail
}

const ProductOwner = (props: TProps) => {
      const { product } = props

      const [modalDeleteProduct, setModalDeleteProduct] = useState<boolean>(false)

      const handleControllModalDeleteProduct = () => {
            setModalDeleteProduct(true)
      }

      return (
            <div className='flex min-w-[200px] flex-col gap-[16px] bg-color-section-theme rounded-lg items-center py-[16px]'>
                  <Link to={`/product/${product?._id}`} className='w-[150px] h-[150px]'>
                        <img
                              key={product?._id}
                              src={product?.product_thumb_image?.secure_url || ''}
                              className='w-full h-full object-contain'
                              alt='product'
                        />
                  </Link>
                  <Link
                        to={`/product/${product?._id}`}
                        className='relative group w-[150px] h-[30px] p-[12px_8px] flex items-center justify-center bg-color-section-theme text-text-theme border-[1px] border-[var(--border-color-input)] rounded font-medium overflow-hidden hover:text-white hover:border-transparent  before:absolute before:right-0 before:bottom-0 before:w-0 before:bg-color-main before:h-0 hover:before:h-full hover:before:w-full before:transition-all before:duration-500 '
                  >
                        <button className=' absolute z-[2]  transition-all duration-500'>Link sản phẩm</button>
                  </Link>

                  <Link
                        to={`/product/update/${product?._id}`}
                        className='relative group w-[150px] h-[30px] p-[12px_8px] flex items-center justify-center bg-color-section-theme text-text-theme border-[1px] border-[var(--border-color-input)] rounded font-medium overflow-hidden hover:text-white hover:border-transparent  before:absolute before:left-0 before:bottom-0 before:w-0 before:bg-[#0c67fe] before:h-0 hover:before:h-full hover:before:w-full before:transition-all before:duration-500 '
                  >
                        <button className=' absolute z-[2]  transition-all duration-500'>Chỉnh sửa sản phẩm</button>
                  </Link>
                  {/* <Link to={`/product/update-book/${product?._id}`}>Chỉnh sửa sản phẩm</Link> */}
                  <button
                        className='bg-red-800 text-[#fff] rounded opacity-90 hover:opacity-100 w-[150px] h-[30px] p-[12px_8px] flex items-center justify-center'
                        onClick={handleControllModalDeleteProduct}
                  >
                        Xóa sản phẩm
                  </button>

                  {modalDeleteProduct && (
                        <DeleteProduct product_id={product?._id as string} setModalDeleteProduct={setModalDeleteProduct} />
                  )}
            </div>
      )
}

export default ProductOwner
