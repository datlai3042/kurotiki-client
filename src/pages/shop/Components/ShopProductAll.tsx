import { useInfiniteQuery } from '@tanstack/react-query'
import React, { SetStateAction, useEffect, useState } from 'react'
import ShopApi from '../../../apis/shop.api'
import { STALE_TIME } from '../../../component/Comment/Comment'
import { TProductDetail } from '../../../types/product/product.type'
import { getAddressDefault, renderStringAddressDetailV2 } from '../../../utils/address.util'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { UserResponse } from '../../../types/user.type'
import BoxConfirmAddress from '../../../component/BoxUi/confirm/BoxConfirmAddress'
import { fetchShopProduct } from '../../../Redux/category.slice'
import ProductMedium from '../../../component/Content/Components/ProductMedium'
import ProductApi from '../../../apis/product.api'
import { ShopResponse } from '../../../types/shop.type'

const LIMIT = 12

type TProps = {
      shop_id: string
      searchName: string
      setSearch?: React.Dispatch<SetStateAction<string>>
      mode: 'Normal' | 'Search'
      shop: ShopResponse
}

type Filter = { label: string; value: keyof TProductDetail; inc: number }

const filter: Filter[] = [
      { label: 'Phổ biến', value: 'product_votes', inc: -1 },
      { label: 'Bán chạy', value: 'product_is_bought', inc: -1 },
      { label: 'Hàng mới', value: 'product_date_create', inc: -1 },
      { label: 'Giá thấp đến cao', value: 'product_price', inc: 1 },
      { label: 'Giá cao đến thấp', value: 'product_price', inc: -1 },
]

const ShopProductAll = (props: TProps) => {
      const { shop_id, searchName, shop, setSearch } = props
      let mode = props.mode
      const user = useSelector((state: RootState) => state.authentication.user) as UserResponse
      const address_default = (user?.user_address && user?.user_address.filter((address) => address.address_default === true)) || ''

      const [filterProduct, setFilterProduct] = useState<Filter>({
            label: 'Phổ biến',
            value: 'product_votes',
            inc: -1,
      })

      const [openModelAddress, setOpenModelAddress] = useState<boolean>(false)
      const dispatch = useDispatch()
      const shop_products = useSelector((state: RootState) => state.category.shop_products)

      const getProductAll = useInfiniteQuery({
            queryKey: ['get-product-all', LIMIT, shop_id, filterProduct.value, filterProduct.inc],
            queryFn: ({ pageParam = 1 }) =>
                  ShopApi.getProductFilter({
                        shop_id: shop_id as string,
                        page: pageParam,
                        limit: LIMIT,
                        sort: filterProduct.value,
                        inc: filterProduct.inc,
                  }),
            initialPageParam: 1,
            getNextPageParam: (lastPage, allPages) =>
                  lastPage.data.metadata.shop.shop_products.length > 0 ? allPages.length + 1 : undefined,
            // enabled: !searchName,
            staleTime: STALE_TIME,
      })

      const getProductSearch = useInfiniteQuery({
            queryKey: ['get-product-name', shop_id, searchName],
            queryFn: ({ pageParam = 1 }) =>
                  ProductApi.getProductName({
                        text: searchName,
                        shop_id: shop_id as string,
                        page: pageParam,
                        limit: LIMIT,
                  }),
            initialPageParam: 1,
            getNextPageParam: (lastPage, allPages) =>
                  lastPage.data.metadata.shop.shop_products.length > 0 ? allPages.length + 1 : undefined,
            enabled: !!searchName && mode === 'Search',
            // enabled: !!shop_id,
            staleTime: STALE_TIME,
      })

      useEffect(() => {
            if (getProductSearch.isSuccess) {
                  const shop_products = getProductSearch.data.pages.flatMap((p) => p.data.metadata.shop.shop_products)
                  dispatch(fetchShopProduct({ shop_products }))
            }
      }, [getProductSearch.isSuccess, dispatch, getProductSearch.data])

      useEffect(() => {
            if (getProductAll.isSuccess) {
                  const shop_products = getProductAll.data.pages.flatMap((p) => p.data.metadata.shop.shop_products)
                  console.log({ shop_products })
                  dispatch(fetchShopProduct({ shop_products: shop_products }))
            }
      }, [getProductAll.isSuccess, dispatch, getProductAll.data?.pages])

      if (shop && shop?.shop_products.length === 0) {
            return (
                  <div className='w-full h-[500px] bg-[#ffffff] flex items-center justify-center text-[18px] font-semibold'>
                        Shop này chưa đăng sản phẩm
                  </div>
            )
      }

      const styleEffect = {
            onActive: (check: boolean) => {
                  if (check) return 'text-blue-400'
                  return 'text-stale-700'
            },
      }

      return (
            <div className='flex flex-col gap-[8px] min-h-[200px] h-max'>
                  <div className='w-full h-[170px] flex flex-col gap-[8px] bg-[#ffffff] rounded-lg p-[20px_16px]'>
                        <h3 className='text-[18px] font-semibold text-slate-900 '>Tất cả sản phẩm</h3>
                        <div className='w-full h-max min-h-[100px] xl:min-h-[40px] xl:w-[70%] flex items-center justify-between overflow-x-scroll xl:overflow-visible  '>
                              {filter.map((btn) => (
                                    <button
                                          className={`${styleEffect.onActive(
                                                btn.label === filterProduct.label,
                                          )} relative pb-[4px] xl:pb-[8px] min-w-[150px] xl:min-w-[100px] w-max h-[50px] xl:h-[30px] text-[14px]`}
                                          onClick={() => {
                                                if (setSearch) {
                                                      setSearch('')
                                                      mode = 'Normal'
                                                }
                                                dispatch(fetchShopProduct({ shop_products: [] }))
                                                setFilterProduct(btn)
                                          }}
                                          key={btn.label}
                                    >
                                          <span>{btn.label}</span>
                                          {btn.label === filterProduct.label && (
                                                <span className='absolute bottom-0 left-[50%] translate-x-[-50%] block w-[24px] h-[4px] bg-blue-400 rounded-[999px]'></span>
                                          )}
                                    </button>
                              ))}
                        </div>
                        <div className='w-[calc(100%+32px)] ml-[-16px] h-[1px] bg-slate-200 my-[5px]'></div>
                        <div className='flex-grow w-full hidden xl:flex gap-[6px] items-center justify-end text-[14px]'>
                              <div className='flex gap-[6px] text-slate-500'>
                                    <span>Giao đến</span>
                                    <span className='text-slate-800 font-medium underline'>
                                          {getAddressDefault(user?.user_address) &&
                                                `${address_default ? renderStringAddressDetailV2(address_default[0]) : ''}`}
                                    </span>
                              </div>
                              <span> - </span>
                              <button className='text-blue-700' onClick={() => setOpenModelAddress(true)}>
                                    Đổi địa chỉ
                              </button>
                        </div>

                        {openModelAddress && <BoxConfirmAddress setOpenModal={setOpenModelAddress} mode='User' />}
                  </div>
                  <div className='w-full min-h-[400px] h-max px-[10px] xl:px-0 rounded-lg grid grid-cols-2 xl:grid-cols-6 grid-rows-[390px] auto-rows-[390px] gap-[20px] grid-flow-row'>
                        {shop_products.map((product) => (
                              <ProductMedium key={product._id} product={product} />
                        ))}
                  </div>
                  <div className='w-full h-[65px] flex items-center justify-center mb-[60px] xl:mb-0'>
                        {/* {mode === 'Normal' && ( */}
                        <button
                              className='  min-w-[180px] px-[16px] w-max h-[40px] bg-[#ffffff] border-[1px] border-blue-500 text-blue-500 flex items-center justify-center rounded-lg hover:bg-blue-50 hover:text-blue-500'
                              onClick={() => getProductAll.fetchNextPage()}
                              disabled={!getProductAll.hasNextPage}
                        >
                              {/* {getProductAll.isPending && 'Đang tải dữ liệu'} */}
                              {getProductAll.hasNextPage
                                    ? 'Xem thêm'
                                    : getProductAll.isPending
                                    ? 'Đang tải dữ liệu sản phẩm'
                                    : 'Hết sản phẩm hiển thị'}
                        </button>
                        {/* )} */}
                  </div>
            </div>
      )
}

export default ShopProductAll
