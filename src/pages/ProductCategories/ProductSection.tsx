import React, { useEffect } from 'react'
import { ProductType, TProductDetail } from '../../types/product/product.type'
import { Link } from 'react-router-dom'
import { convertDateToString, convertWeekday } from '../../utils/date.utils'
import { Rate } from 'antd'
import { useInfiniteQuery } from '@tanstack/react-query'
import ProductApi from '../../apis/product.api'
import { fetchProduct } from '../../Redux/category.slice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import BoxLoading from '../../component/BoxUi/BoxLoading'

type TProps = {
      product_type: ProductType
}

const ProductSection = (props: TProps) => {
      const { product_type } = props
      const dispatch = useDispatch()
      const products = useSelector((state: RootState) => state.category.products)
      const d = new Date()

      const getProductCategory = useInfiniteQuery({
            queryKey: ['getAllProductWithType'],
            queryFn: ({ pageParam = 1 }) => ProductApi.getAllProductWithType({ product_type, page: pageParam }),
            initialPageParam: 1,
            getNextPageParam: (lastPage, allPages) => (lastPage.data.metadata.products.length > 0 ? allPages.length + 1 : undefined),
      })

      useEffect(() => {
            if (getProductCategory.isSuccess) {
                  const products: TProductDetail[] = []
                  getProductCategory.data.pages.flatMap((product) => product.data.metadata.products.map((p) => products.push(p)))
                  dispatch(fetchProduct({ products }))
            }
      }, [getProductCategory.data?.pages.length, dispatch, getProductCategory?.data?.pages, getProductCategory.isSuccess])

      const onIncreasePage = () => {
            getProductCategory.fetchNextPage()
      }

      return (
            <div className='h-max min-h-full w-full'>
                  {products && products.length > 0 && (
                        <>
                              <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4'>
                                    {products.map((product, index) => (
                                          <Link
                                                to={`/product/${product._id}`}
                                                key={product._id}
                                                className='group flex min-h-[390px] flex-col overflow-hidden rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme transition duration-300 hover:-translate-y-[2px] hover:border-blue-500/40 hover:shadow-[0_14px_35px_rgba(0,0,0,0.20)]'
                                          >
                                                <div className='flex h-[220px] w-full items-center justify-center bg-color-section-theme p-4'>
                                                      <img
                                                            src={product.product_thumb_image?.secure_url}
                                                            className='h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]'
                                                            alt='product'
                                                      />
                                                </div>

                                                <div className='flex flex-1 flex-col p-4'>
                                                      <p className='line-clamp-2 min-h-[42px] text-sm font-medium leading-5 text-text-theme'>
                                                            {product.product_name}
                                                      </p>

                                                      <p className='mt-2 truncate text-xs text-slate-500'>{product.shop_id.shop_name}</p>

                                                      <p className='mt-3 text-lg font-semibold text-blue-500'>
                                                            {new Intl.NumberFormat('vi-VN', {
                                                                  style: 'currency',
                                                                  currency: 'VND',
                                                            }).format(product.product_price)}
                                                      </p>

                                                      <div className='mt-2 flex flex-wrap justify-between items-center gap-2 text-xs '>
                                                            <span className='text-slate-500'>Đã bán {product.product_is_bought}</span>

                                                            <div className='flex items-center gap-1'>
                                                                  <span>{product.product_votes}</span>
                                                                  <Rate
                                                                        count={1}
                                                                        style={{ fontSize: 12 }}
                                                                        defaultValue={1}
                                                                  />
                                                            </div>

                                                      </div>

                                                      <div className='mt-2 border-t border-[var(--border-color-input)] pt-3 text-[11px] text-slate-500'>
                                                            <p className='flex flex-col justify-between gap-1 xl:flex-row xl:items-center'>
                                                                  <span className='hidden xl:inline-block'>
                                                                        Giao vào {convertWeekday(d)}
                                                                  </span>
                                                                  <span>{convertDateToString(d)}</span>
                                                            </p>
                                                      </div>
                                                </div>
                                          </Link>
                                    ))}
                              </div>

                              <div className='mt-6 flex h-max w-full justify-center'>
                                    <button
                                          className='flex h-11 min-w-[180px] items-center justify-center rounded-xl border border-blue-500/60 bg-color-section-theme px-5 text-sm font-medium text-blue-400 transition hover:bg-blue-500/10'
                                          onClick={() => onIncreasePage()}
                                    >
                                          {getProductCategory.hasNextPage ? 'Xem thêm' : 'Hết dữ liệu sản phẩm'}
                                    </button>
                              </div>
                        </>
                  )}

                  {products && products.length === 0 && (
                        <div className='flex h-[300px] w-full items-center justify-center rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme text-xl font-semibold text-text-theme'>
                              Không tìm thấy sản phẩm
                        </div>
                  )}
            </div>
      )
}

export default ProductSection
