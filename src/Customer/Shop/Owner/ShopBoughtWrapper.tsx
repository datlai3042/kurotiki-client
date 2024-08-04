import React from 'react'
import { ShopResponse } from '../../../types/shop.type'
import { useInfiniteQuery } from '@tanstack/react-query'
import ShopApi from '../../../apis/shop.api'
import { STALE_TIME } from '../../../component/Comment/Comment'
import ShopProductOrder from './ShopProductOrder'

type TProps = {
      shop: ShopResponse
}

const LIMIT = 12

const ShopBoughtWrapper = (props: TProps) => {
      const { shop } = props

      const getMyOrderShop = useInfiniteQuery({
            queryKey: ['get-my-order-shop', shop._id],
            queryFn: ({ pageParam = 1 }) => ShopApi.getMyOrderShop({ page: pageParam, limit: LIMIT, shop_id: shop._id }),

            initialPageParam: 1,
            getNextPageParam: (lastPage, allPages) => (lastPage.data.metadata.orderShop.length > 0 ? allPages.length + 1 : undefined),
            staleTime: STALE_TIME,
      })

      return (
            <div className='w-full min-h-[250px] h-max flex flex-col gap-[30px]'>
                  {getMyOrderShop.data?.pages.flatMap((page) =>
                        page.data.metadata.orderShop.map((CartHistory, index) => (
                              <ShopProductOrder key={CartHistory._id || Math.random().toString()} CartHistory={CartHistory} />
                        )),
                  )}

                  <div className='w-full h-[65px] flex items-center justify-center'>
                        <button
                              className='  min-w-[180px] px-[16px] w-max h-[40px] bg-[#ffffff] border-[1px] border-blue-500 text-blue-500 flex items-center justify-center rounded-lg hover:bg-blue-50 hover:text-blue-500'
                              onClick={() => getMyOrderShop.fetchNextPage()}
                              disabled={!getMyOrderShop.hasNextPage}
                        >
                              {/* {getMyOrderShop.isPending && 'Đang tải dữ liệu'} */}
                              {getMyOrderShop.hasNextPage
                                    ? 'Xem thêm'
                                    : getMyOrderShop.isPending
                                    ? 'Đang tải dữ liệu sản phẩm'
                                    : 'Hết sản phẩm hiển thị'}
                        </button>
                  </div>
            </div>
      )
}

export default ShopBoughtWrapper
