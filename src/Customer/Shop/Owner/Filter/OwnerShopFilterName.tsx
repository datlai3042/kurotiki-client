import { useInfiniteQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import ShopApi from '../../../../apis/shop.api'
import ShopSearchProduct from '../../../../pages/shop/Components/ShopSearchProduct'
import { ShopResponse } from '../../../../types/shop.type'
import ProductApi from '../../../../apis/product.api'
import { STALE_TIME } from '../../../../component/Comment/Comment'
import ProductOwner from '../../ProductOwner'
import { useDispatch, useSelector } from 'react-redux'
import { fetchShopOwnerProduct } from '../../../../Redux/category.slice'
import { RootState } from '../../../../store'

type TProps = {
      shop: ShopResponse
}

const LIMIT = 12

const OwnerShopFilterName = (props: TProps) => {
      const { shop } = props

      const [mode, setMode] = useState<'NORMAL' | 'SEARCH'>('NORMAL')
      const [search, setSearch] = useState<string>('')
      const dispatch = useDispatch()
      const shop_owner_products = useSelector((state: RootState) => state.category.shop_owner_products)
      const getProductMyShop = useInfiniteQuery({
            queryKey: ['get-product-my-shop', shop._id],
            queryFn: ({ pageParam = 1 }) => ShopApi.getProductMyShop({ page: pageParam, limit: LIMIT, shop_id: shop._id }),

            initialPageParam: 1,
            getNextPageParam: (lastPage, allPages) =>
                  lastPage.data.metadata.shop.shop_products.length > 0 ? allPages.length + 1 : undefined,
            enabled: mode === 'NORMAL',
            staleTime: STALE_TIME,
      })

      const getProductSearch = useInfiniteQuery({
            queryKey: ['get-product-name', shop._id, search],
            queryFn: ({ pageParam = 1 }) =>
                  ProductApi.getProductName({
                        text: search,
                        shop_id: shop._id as string,
                        page: pageParam,
                        limit: 1,
                  }),
            initialPageParam: 1,
            getNextPageParam: (lastPage, allPages) =>
                  lastPage.data.metadata.shop.shop_products.length > 0 ? allPages.length + 1 : undefined,
            enabled: !!search && mode === 'SEARCH',
            // enabled: !!shop_id,
            staleTime: STALE_TIME,
      })

      useEffect(() => {
            if (search) {
                  setMode('SEARCH')
                  return
            }

            setMode('NORMAL')
      }, [search])

      useEffect(() => {
            if (getProductMyShop.isSuccess) {
                  const shop_owner_products = getProductMyShop.data.pages.flatMap((p) => p.data.metadata.shop.shop_products)
                  dispatch(fetchShopOwnerProduct({ shop_owner_products }))
            }
      }, [getProductMyShop.isSuccess, dispatch, getProductMyShop.data])

      useEffect(() => {
            if (getProductSearch.isSuccess) {
                  const shop_owner_products = getProductSearch.data.pages.flatMap((p) => p.data.metadata.shop.shop_products)
                  dispatch(fetchShopOwnerProduct({ shop_owner_products }))
            }
      }, [getProductSearch.isSuccess, dispatch, getProductSearch.data])

      return (
            <div className='flex gap-[16px] flex-wrap'>
                  <div className='w-full h-max text-right'>
                        <ShopSearchProduct search={search} setSearch={setSearch} />
                  </div>

                  {shop_owner_products?.map((product) => {
                        return <ProductOwner product={product} key={product?._id} />
                  })}
                  <div className='w-full h-[65px] flex items-center justify-center'>
                        <button
                              className='  min-w-[180px] px-[16px] w-max h-[40px] bg-[#ffffff] border-[1px] border-blue-500 text-blue-500 flex items-center justify-center rounded-lg hover:bg-blue-50 hover:text-blue-500'
                              onClick={() => getProductMyShop.fetchNextPage()}
                              disabled={!getProductMyShop.hasNextPage}
                        >
                              {/* {getProductMyShop.isPending && 'Đang tải dữ liệu'} */}
                              {getProductMyShop.hasNextPage
                                    ? 'Xem thêm'
                                    : getProductMyShop.isPending
                                    ? 'Đang tải dữ liệu sản phẩm'
                                    : 'Hết sản phẩm hiển thị'}
                        </button>
                  </div>
            </div>
      )
}

export default OwnerShopFilterName
