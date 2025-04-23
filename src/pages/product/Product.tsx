import { useQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductApi from '../../apis/product.api'
import { ChevronRight, Image } from 'lucide-react'
import ProductDetail from './ProductDetail'
import ProductIntro from './ProductIntro'
import ProductPay from './ProductPay'
import NotFound from '../../component/Errors/NotFound'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import { UserAddress, UserResponse } from '../../types/user.type'
import { AddressType, CartCurrent, resetAddressProduct, setAddressProduct } from '../../Redux/cartSlice'
import { renderStringAddressDetailV2 } from '../../utils/address.util'
import CommentMe from '../../component/Comment/CommentMe'
import CommentStatistic from '../../component/Comment/CommentStatistic'
import Comment from '../../component/Comment/Comment'
import CommentImageAll from '../../component/Comment/CommentImageAll'
import ContentProduct from '../../component/Content/Components/ContentProduct'
import CommentService from '../../apis/comment.service'
import ProductSkeleton from './ProductSkeleton'
import Footer from '../../component/Footer/Footer'
import { ProductType, TProductDetail, TProductFull } from '../../types/product/product.type'

export type TImage = {
      secure_url: string
}

const renderType = (type: TProductDetail['product_type']) => {
      let name = 'Hàng hóa'
      switch (type) {
            case 'Book': {
                  name = 'Sách'
                  break
            }
            case 'Food': {
                  name = 'Đồ ăn'
                  break
            }
            default: {
            }
      }

      return name
}

const Product = () => {
      const param = useParams()
      const { id } = param
      const user = useSelector((state: RootState) => state.authentication.user) as UserResponse
      const cart = useSelector((state: RootState) => state.cartSlice.cart_current) as CartCurrent
      const dispatch = useDispatch()

      const getProductWithId = useQuery({
            queryKey: ['get-product-with-id', id],
            queryFn: () => ProductApi.getProductWithId({ id: id as string }),
      })

      const getCommentCore = useQuery({
            queryKey: ['get-comment-core', id],
            queryFn: () => CommentService.getCommentCore({ product_id: id as string }),
      })

      const product = getProductWithId.isSuccess ? getProductWithId!.data!.data!.metadata.product : undefined

      const totalComment = getCommentCore.data?.data.metadata.totalCommentProduct
      const avg = getCommentCore.data?.data.metadata.comment_avg
      const detailComment = getCommentCore.data?.data.metadata.detailComment
      const vote = getCommentCore.data?.data.metadata.vote

      useEffect(() => {
            if (getProductWithId.isSuccess) {
                  if (user && id !== cart.cart_current_product_id) {
                        dispatch(resetAddressProduct())
                        const address_default =
                              user.user_address.length > 0 ? user?.user_address.find((address) => address.address_default === true) : false
                        if (address_default) {
                              dispatch(
                                    setAddressProduct({
                                          cart_current_product_id: id as string,
                                          cart_current_address: renderStringAddressDetailV2(address_default as UserAddress) || '',
                                          cart_current_address_type: address_default?.type as AddressType,
                                          cart_current_address_id: address_default._id,
                                          cart_current_address_ward: address_default.address_ward,
                                          cart_current_address_district: address_default.address_district,
                                          cart_current_address_province: address_default.address_province,
                                    }),
                              )
                        }
                  }
            }
      }, [getProductWithId.isSuccess, dispatch, user, id, cart])

      useEffect(() => {}, [getProductWithId.isSuccess])
      if (getProductWithId.isSuccess) {
            const message = [
                  'Sản phẩm có thể đã bị Shop sở hũu xóa đi',
                  'Đây là sản phẩm từ Shop của bạn, nó có thể đã bị chính bạn xóa đi',
            ]
            if (!getProductWithId?.data?.data?.metadata?.product?.product_thumb_image?.secure_url) {
                  return (
                        <NotFound
                              ContentHeader='Không tìm thấy sản phẩm'
                              ContentDescription={user?._id === product?.shop_id?.owner?._id ? message[1] : message[0]}
                        />
                  )
            }
      }

      return (
            <div className='flex flex-col w-full text-[12px] text-text-theme gap-[20px]'>
                  <div className=' w-full flex flex-col gap-[4px] '>
                        {getProductWithId.data?.data && (
                              <div className='flex items-center gap-[4px] p-[0px_20px_6px_20px] xl:px-0 text-[20px] font-extrabold '>
                                    <Link to='/'>Trang chủ</Link>

                                    <ChevronRight size={16} />
                                    <Link to={`/${product?.product_type}`}>{renderType(product?.product_type as ProductType)}</Link>
                                    <ChevronRight size={16} />
                                    <Link to={`/${product?.product_type}`}>{product?.attribute.type}</Link>
                              </div>
                        )}

                        {getProductWithId.isSuccess && product && (
                              <div className='  flex gap-[16px] xl:gap-[16px] xl:mt-0'>
                                    <div className='w-full xl:w-[74%] flex flex-col gap-[24px]'>
                                          <div className='top w-full min-h-[1000px] h-max flex flex-col xl:flex-row gap-[24px]'>
                                                <div className='xl:w-[40%] static xl:sticky top-[32px] xl:top-[85px] bg-color-section-theme px-[3px] py-[6px] rounded-lg  h-max flex flex-col gap-[16px] '>
                                                      <ProductDetail product={product} isSuccess={getProductWithId.isSuccess} />
                                                </div>
                                                <div className='xl:w-[60%]  min-h-[500px] h-max mt-[20px] xl:mt-0 rounded-lg '>
                                                      <ProductIntro
                                                            product={product}
                                                            totalComment={totalComment || 0}
                                                            avg={avg || vote || 0}
                                                      />
                                                </div>
                                          </div>
                                          <div className='flex flex-col gap-[10px] comment w-full min-h-[1000px] h-max  bg-color-section-theme rounded-lg  pb-[50px]'>
                                                <CommentStatistic
                                                      avg={avg || vote || product.product_votes}
                                                      totalComment={totalComment || 0}
                                                      detailComment={detailComment || []}
                                                />
                                                <CommentImageAll product_id={product._id} />
                                                <div className='w-full mt-[16px]'>
                                                      <CommentMe product={product} ownerProduct={product?.shop_id?.owner._id} />
                                                </div>
                                                <Comment product_id={product?._id} />
                                          </div>
                                    </div>
                                    <div className='hidden xl:flex w-[40%] xl:w-[26%] sticky top-[100px] xl:top-[85px] h-max pb-[15px] bg-color-section-theme  rounded-md'>
                                          <ProductPay product={product} />
                                    </div>
                              </div>
                        )}

                        {getProductWithId.isPending && <ProductSkeleton />}
                  </div>
                  <ContentProduct />
                  <Footer className='hidden xl:block bg-color-section-theme' />
            </div>
      )
}

export default Product
