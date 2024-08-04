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
            <div className='flex min-w-[calc(100%/6.6)] flex-col gap-[16px] bg-[#ffffff] rounded-lg items-center py-[16px]'>
                  <Link to={`/product/${product?._id}`} className='w-[120px] h-[150px]'>
                        <img
                              key={product?._id}
                              src={product?.product_thumb_image?.secure_url || ''}
                              className='w-full h-full'
                              alt='product'
                        />
                  </Link>
                  <Link
                        to={`/product/${product?._id}`}
                        className='relative group w-[120px] h-[30px] p-[12px_8px] flex items-center justify-center bg-[#ffffff] border-[1px] border-slate-300 text-slate-800 rounded font-medium overflow-hidden hover:text-white hover:border-[#ffffff]  before:absolute before:right-0 before:bottom-0 before:w-0 before:bg-green-400 before:h-0 hover:before:h-full hover:before:w-full before:transition-all before:duration-500 '
                  >
                        <button className=' absolute z-[2]  transition-all duration-500'>Link sản phẩm</button>
                  </Link>

                  <Link
                        to={`/product/update/${product?._id}`}
                        className='relative group w-[140px] h-[30px] p-[12px_8px] flex items-center justify-center bg-[#ffffff] border-[1px] border-slate-300 text-slate-800 rounded font-medium overflow-hidden hover:text-white hover:border-[#ffffff]  before:absolute before:left-0 before:bottom-0 before:w-0 before:bg-blue-400 before:h-0 hover:before:h-full hover:before:w-full before:transition-all before:duration-500 '
                  >
                        <button className=' absolute z-[2]  transition-all duration-500'>Chỉnh sửa sản phẩm</button>
                  </Link>
                  {/* <Link to={`/product/update-book/${product?._id}`}>Chỉnh sửa sản phẩm</Link> */}
                  <button className='text-red-800 underline' onClick={handleControllModalDeleteProduct}>
                        Xóa sản phẩm
                  </button>

                  {modalDeleteProduct && (
                        <DeleteProduct product_id={product?._id as string} setModalDeleteProduct={setModalDeleteProduct} />
                  )}
            </div>
      )
}

export default ProductOwner
