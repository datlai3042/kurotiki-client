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
      // products: TProductDetail[]
      // onIncreasePage: () => void
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
            <div className='w-full min-h-full h-max'>
                  {products && products.length > 0 && (
                        <>
                              <div className='grid grid-cols-2 xl:grid-cols-4 grid-rows-[450px] gap-[28px] auto-rows-[450px] '>
                                    {products.map((product, index) => (
                                          <Link
                                                to={`/product/${product._id}`}
                                                key={product._id}
                                                className='bg-[#ffffff] p-[12px] flex flex-col gap-[20px] rounded-md border-[1px] border-gray-50 hover:shadow-lg'
                                          >
                                                <div className='w-full h-[40%] xl:h-[50%] flex justify-center '>
                                                      <img
                                                            src={product.product_thumb_image?.secure_url}
                                                            className='xw-full min-h-full max-h-full h-full'
                                                            alt='product '
                                                      />
                                                </div>
                                                <div className='flex-1 flex flex-col gap-[10px]'>
                                                      <p className='text-slate-800 text-[20px] font-extrabold'>
                                                            {new Intl.NumberFormat('vi-VN', {
                                                                  style: 'currency',
                                                                  currency: 'VND',
                                                            }).format(product.product_price)}
                                                      </p>
                                                      <div className='flex flex-col gap-[8px] text-[16px]'>
                                                            <p className='truncate max-w-[90%] text-slate-900 font-bold'>{product.shop_id.shop_name}</p>
                                                            <p className='break-all line-clamp-2'>{product.product_name}</p>
                                                            <div className='flex flex-col xl:flex-row gap-[8px] text-[14px] xl:items-center'>
                                                                  <Rate
                                                                        disabled
                                                                        defaultValue={product.product_votes}
                                                                        style={{ fontSize: 14 }}
                                                                  />

                                                                  <p>Đã bán {product.product_is_bought}</p>
                                                            </div>
                                                      </div>
                                                </div>
                                                <footer className='self-end w-full h-[36px] xl:h-[28px] flex items-center pt-[2px] border-t-[1px] border-gray-200'>
                                                      <p className='w-full flex flex-col xl:flex-row xl:items-center justify-between'>
                                                            <span className='hidden xl:inline-block'>Giao vào {convertWeekday(d)}</span>
                                                            <span>{convertDateToString(d)}</span>
                                                      </p>
                                                </footer>
                                          </Link>
                                    ))}
                              </div>
                              <div className='mt-[30px] w-full h-max flex justify-center'>
                                    <button
                                          className='min-w-[150px] w-max h-[40px] px-[32px] bg-[#ffffff] flex items-center justify-center gap-[8px] border-[1px] border-blue-400 text-blue-400 rounded'
                                          onClick={() => onIncreasePage()}
                                    >
                                          {getProductCategory.hasNextPage ? 'Xem thêm' : 'Hết dữ liệu sản phẩm'}
                                          {(getProductCategory.isPending || getProductCategory.isFetchingNextPage) && (
                                                <BoxLoading color='text-blue-400' />
                                          )}
                                    </button>
                              </div>
                        </>
                  )}
                  {products && products.length === 0 && !getProductCategory.isPending && (
                        <div className='w-full h-[300px] bg-[#ffffff] flex items-center justify-center text-[28px] font-extrabold'>
                              Không tìm thấy sản phẩm
                        </div>
                  )}

                  {products && getProductCategory.isPending && (
                        <div className='w-full h-[300px] rounded-lg bg-gray-200 animate-pulse'></div>
                  )}
            </div>
      )
}

export default ProductSection
