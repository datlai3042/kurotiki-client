import React, { useEffect } from 'react'
import ProtectProductUpdate from './ProtectProductUpdate'
import BookUpdate from './BookUpdate'
import { useQuery } from '@tanstack/react-query'
import ProductApi from '../../../../apis/product.api'
import { useParams } from 'react-router-dom'
import { TProductDetail } from '../../../../types/product/product.type'
import FoodUpdate from '../Food/FoodUpdate'
import { useSelector } from 'react-redux'
import { RootState } from '@/src/store'

const PermisionProductUpdate = () => {
      const param = useParams()
      const { product_id } = param
      const protectProduct = useQuery({
            queryKey: ['get-product-with-id', product_id],
            queryFn: () => ProductApi.protectProduct({ id: product_id as string }),
      })

      const user = useSelector((state: RootState) => state.authentication.user)

      useEffect(() => {
            if (protectProduct.isSuccess) {
            }
      }, [protectProduct.isSuccess])

      if (user) {
            const { roles } = user
            if (roles.includes('admin')) {
                  return <div className='w-full h-[400px] flex justify-center items-center bg-[#fff]'>Chế độ chỉnh sửa với admin không khả dụng</div>
            } 
      }

      return (
            <div className='w-full'>
                  {protectProduct.isSuccess && protectProduct.data.data.metadata.product?.product_type === 'Book' && (
                        <ProtectProductUpdate
                              isSuccess={protectProduct.isSuccess}
                              product={protectProduct.data?.data.metadata.product}
                              ElementPrivate={<BookUpdate product={protectProduct.data?.data.metadata.product as TProductDetail} />}
                              ElementPublic={<p>Sản phẩm có id {product_id} không được tìm thấy trong shop của bạn</p>}
                        />
                  )}

                  {protectProduct.isSuccess && protectProduct.data.data.metadata.product?.product_type === 'Food' && (
                        <ProtectProductUpdate
                              isSuccess={protectProduct.isSuccess}
                              product={protectProduct.data?.data.metadata.product}
                              ElementPrivate={<FoodUpdate product={protectProduct.data?.data.metadata.product as TProductDetail} />}
                              ElementPublic={<p>Sản phẩm có id {product_id} không được tìm thấy trong shop của bạn</p>}
                        />
                  )}
            </div>
      )
}

export default PermisionProductUpdate
