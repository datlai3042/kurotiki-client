import { useQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ShopApi from '../../apis/shop.api'
import { ProductType, TProductFull } from '../../types/product/product.type'
import { Eye, MessageSquare, ShoppingCart } from 'lucide-react'

const ShopAnalysis = () => {
      const { pathname } = useLocation()
      return (
            <ul className='flex flex-col gap-[14px] text-[12px] font-semibold'>
                  <li className=' cursor-pointer'>
                        <Link
                              className={`${
                                    pathname === '/customer/shop/top-buy' ? 'text-color-main' : 'hover:text-color-main'
                              } flex items-center gap-[8px]`}
                              to={'/customer/shop/top-buy'}
                        >
                              <ShoppingCart size={14} /> Top lượt bán
                        </Link>
                  </li>
                  <li className=' cursor-pointer'>
                        <Link
                              className={`${
                                    pathname === '/customer/shop/top-view' ? 'text-color-main' : 'hover:text-color-main'
                              }  flex items-center gap-[8px]`}
                              to={'/customer/shop/top-view'}
                        >
                              <Eye size={14} />
                              Top lượt xem
                        </Link>
                  </li>
                  <li className=' cursor-pointer'>
                        <Link
                              className={`${
                                    pathname === '/customer/shop/top-comment' ? 'text-color-main' : 'hover:text-color-main'
                              }  flex items-center gap-[8px]`}
                              to={'/customer/shop/top-comment'}
                        >
                              <MessageSquare size={14} />
                              Top bình luận
                        </Link>
                  </li>
            </ul>
      )
}

export const ShopAnalysisTopBuy = () => {
      const shopQuery = useQuery({ queryKey: ['shop-product-top-buy'], queryFn: () => ShopApi.getShopProductTopBuy() })
      const reportShop = shopQuery.data?.data.metadata?.reportShop || {}
      const productKey = Object.keys(reportShop)
      return (
            <>
                  {productKey?.map((rp, index) => (
                        <ShopAnalysisProductItem key={index} product={reportShop[rp].info} label={<>Đã bán: {reportShop[rp].quantity}</>} />
                  ))}
            </>
      )
}

export const ShopAnalysisTopView = () => {
      const shopQuery = useQuery({ queryKey: ['shop-product-top-view'], queryFn: () => ShopApi.getShopProductTopView() })
      const reportShop = shopQuery.data?.data.metadata?.reportShop || {}
      const productKey = Object.keys(reportShop)
      return (
            <>
                  {productKey?.map((rp, index) => (
                        <ShopAnalysisProductItem key={index} product={reportShop[rp].info} label={<>Lượt xem: {reportShop[rp].view}</>} />
                  ))}
            </>
      )
}

export const ShopAnalysisTopComment = () => {
      const shopQuery = useQuery({ queryKey: ['shop-product-top-comment'], queryFn: () => ShopApi.getShopProductTopComment() })
      const reportShop = shopQuery.data?.data.metadata?.reportShop || {}
      const productKey = Object.keys(reportShop)
      return (
            <>
                  {productKey?.map((rp, index) => (
                        <ShopAnalysisProductItem
                              key={index}
                              product={reportShop[rp].info}
                              label={<>Lượt bình luận: {reportShop[rp].comment}</>}
                        />
                  ))}
            </>
      )
}

export const ShopAnalysisProductItem = ({ product, label }: { product: TProductFull; label: React.ReactNode }) => {
      return (
            <Link to={`/product/${product?._id}`} className=' bg-color-section-theme   rounded-lg'>
                  {/* {CartHistory.map((product) => ( */}
                  <div className='flex gap-[40px] p-[24px]'>
                        <img src={product!.product_thumb_image?.secure_url} className='w-[200px] h-[240px] object-contain' alt='product' />

                        <div className='flex flex-col gap-[12px]'>
                              <span>Tên sản phẩm: {product!.product_name}</span>
                              <div className='text-[20px]'>{label}</div>
                        </div>
                  </div>
                  {/* ))} */}
            </Link>
      )
}

export default ShopAnalysis
