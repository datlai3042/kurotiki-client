import { useInViewport } from '@mantine/hooks'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { debounce } from 'lodash'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductApi from '../../../apis/product.api'
import ShopApi from '../../../apis/shop.api'
import ProductShopInfo from '../../../pages/product/Components/ProductShopInfo'
import { STALE_TIME } from '../../Comment/Comment'
import ProductMedium from './ProductMedium'
//relative brother conclict

import { ShopResponse } from '../../../types/shop.type'
import bachHoaOnline from '../../Sidebar/img/danhMuc/bachHoaOnline.jpg'
import dienThoaiMayTinhBang from '../../Sidebar/img/danhMuc/dienThoaiMayTinhBang.jpg'
import dongHoVaTrangSuc from '../../Sidebar/img/danhMuc/dongHoVaTrangSuc.jpg'
import mayAnhCamera from '../../Sidebar/img/danhMuc/mayAnhMayQuayPhim.jpg'
import NhaSachTikiLogo from '../../Sidebar/img/danhMuc/nhaSachTiki.jpg'
import oto from '../../Sidebar/img/danhMuc/otoXeMayVaXeDap.jpg'

type TagActiveArray = '/book' | '/food' | '/watch' | '/phone-laptop' | '/camera' | '/honda'

const arrayCategory: { image: string; label: string; href: TagActiveArray }[] = [
      { image: NhaSachTikiLogo, label: 'Nhà sách Tiki', href: '/book' },
      { image: bachHoaOnline, label: 'Bách hóa Online', href: '/food' },

      { image: dongHoVaTrangSuc, label: 'Đồng hồ và trang sức', href: '/watch' },
      { image: dienThoaiMayTinhBang, label: 'Điện thoại và máy tính', href: '/phone-laptop' },
      { image: mayAnhCamera, label: 'Máy ảnh', href: '/camera' },
      { image: oto, label: 'Xe máy', href: '/honda' },
]

const LIMIT = 12
const ContentProduct = () => {
      const refPos = useRef<HTMLDivElement | null>(null)
      const stickyRef = useRef<HTMLDivElement>(null)
      const [tagActive, setTagActive] = useState<TagActiveArray>('/book')
      const [totalPage, setTotalPage] = useState<number>(1)
      const [page, setPage] = useState<number>(1)

      const { ref, inViewport } = useInViewport()

      const getAllProduct = useInfiniteQuery({
            queryKey: ['/v1/api/product/get-all-product'],
            queryFn: ({ pageParam = 1 }) => ProductApi.getAllProduct({ page: pageParam, limit: LIMIT }),
            initialPageParam: 1,
            getNextPageParam: (lastPage, allPages) => {
                  if (lastPage.data.metadata.products.length > 0) {
                        return lastPage.data.metadata.products.length > 0 ? allPages.length + 1 : undefined
                  }
            },
      })

      const getShopAdmin = useQuery({
            queryKey: ['/v1/api/shop/get-shop-admin'],
            queryFn: () => ShopApi.getShopAdmin(),
            staleTime: STALE_TIME,
      })

      const onGetPositionTop = useCallback(
            debounce(() => {
                  const bottomSticky = stickyRef.current?.getBoundingClientRect().bottom || 0

                  const top = refPos.current?.getBoundingClientRect().top
                  if ((top || 0) - 10 < bottomSticky && stickyRef.current) {
                        // stickyRef.current.style.display = 'none'
                        stickyRef.current.style.opacity = '0'
                        stickyRef.current.style.transition = 'opacity 2s'
                  } else {
                        if (stickyRef.current) {
                              stickyRef.current.style.opacity = '1'
                              stickyRef.current.style.transition = 'opacity 1s'
                        }
                  }
                  return top
            }, 50),
            [],
      )

      useEffect(() => {
            window.addEventListener(
                  'scroll',

                  onGetPositionTop,
            )
            if (!inViewport) {
                  window.removeEventListener(
                        'scroll',

                        onGetPositionTop,
                  )
            }

            // }
      }, [inViewport, onGetPositionTop])

      const shopAdminQuery = useQuery({
            queryKey: ['/v1/api/shop/get-shop-admin'],
            queryFn: () => ShopApi.getShopAdmin(),
            staleTime: STALE_TIME,
      })

      const _page = getAllProduct.data?.pages.flatMap((page) => page.data.metadata.products)
      const shopAdmin = getShopAdmin.data?.data.metadata.shopAdmin

      useEffect(() => {
            if (getAllProduct.isSuccess && totalPage === 1) {
                  getAllProduct.data?.pages.flatMap((page) => {
                        setTotalPage(page.data.metadata.totalPage)
                        return []
                  })
            }
            if(getAllProduct.isSuccess) {

            setPage(getAllProduct.data.pages.length)

            }
      }, [getAllProduct.data?.pages, getAllProduct.isSuccess, getAllProduct])

      const styleEffect = {
            onActive: (check: boolean) => {
                  if (check) return 'bg-blue-50 border-b-[3px] border-blue-500'
                  return 'hover:bg-slate-200'
            },
      }


      return (
            <div className=' z-[5] w-full min-h-[370px] h-max  flex flex-col gap-[28px]  bg-[rgb(245_245_250)] pb-[50px] xl:p-0'>
                  <div
                        className='animate-mountComponent h-[155px] w-full sticky top-[70px] xl:top-[0px] bg-[rgb(245_245_250)] pt-[16px] z-[2] '
                        ref={stickyRef}
                  >
                        <div className=' w-full h-[145px] bg-[#ffffff]  rounded  border[1px] border-b-[1px] border-gray-200  flex flex-col gap-[10px] pt-[10px]'>
                              <h3 className='w-full pl-[20px] text-slate-900 font-bold'>Gợi ý hôm nay</h3>
                              <div className='grow grid  grid-cols-[repeat(3,150px)] auto-cols-[150px] grid-flow-col  xl:grid-flow-row  xl:grid-cols-6  justify-items-center overflow-x-scroll xl:overflow-x-visible'>
                                    {arrayCategory.map((category) => (
                                          <Link
                                                to={category.href}
                                                key={category.href + category.label}
                                                className={`${styleEffect.onActive(
                                                      tagActive === category.href,
                                                )} flex w-full h-full items-center flex-col gap-[8px] `}
                                                onClick={() => setTagActive(category.href)}
                                          >
                                                <img
                                                      src={category.image}
                                                      className='w-[65px] h-[65px] rounded-full border-[1px] border-gray-300 p-[8px]'
                                                      alt='category'
                                                />
                                                <span className='text-[13px]'>{category.label}</span>
                                          </Link>
                                    ))}
                              </div>
                        </div>
                  </div>
                  <div className='    w-full h-max min-h-[370px] '>
                        <div className=' w-full h-full grid grid-col-2 sm:grid-cols-3 xl:grid-cols-6  grid-row-[370px] grid-flow-row auto-cols-[calc((100%-20px)/2)] xl:auto-cols-[calc((100%-120px)/6)] auto-rows-[370px] gap-[10px]'>
                              {getAllProduct.isSuccess && (
                                    <>
                                          {shopAdmin && (
                                                <div className='col-span-2 flex flex-col p-[16px] h-full bg-[#ffffff] rounded-lg'>
                                                      <Link to={`/shop/${shopAdmin?._id}`} className='h-[55%] flex justify-center'>
                                                            <img
                                                                  src={shopAdmin?.shop_avatar.secure_url || shopAdmin?.shop_avatar_default}
                                                                  className='w-[75%] h-full'
                                                                  alt='shop admin'
                                                            />
                                                      </Link>
                                                      <div className='w-full h-[35%] flex justify-center'>
                                                            <ProductShopInfo
                                                                  shop={shopAdminQuery.data?.data.metadata.shopAdmin as ShopResponse}
                                                            />
                                                      </div>
                                                </div>
                                          )}

                                          {_page?.map((product, index) => (
                                                <ProductMedium
                                                      product={product}
                                                      key={product._id}
                                                      TikiBest={index % 2 === 0 ? true : false}
                                                      ship={index % 2 !== 0 ? true : false}
                                                />
                                          ))}
                                    </>
                              )}

                              {page === 1 && getAllProduct.isPending && (
                                    <>
                                          <div className='animate-pulse col-span-2 bg-slate-400'></div>
                                          {Array(10)
                                                .fill(0)
                                                ?.map((_, index) => (
                                                      <div
                                                            className='animate-pulse w-full h-full rounded-lg bg-slate-400'
                                                            key={index}
                                                      ></div>
                                                ))}
                                    </>
                              )}

                        </div>
                  </div>
                  <div className='w-full h-[65px] flex items-center justify-center' ref={refPos}>
                        <button
                              className='  min-w-[180px] px-[16px] w-max h-[40px] bg-[#ffffff] border-[1px] border-blue-500 text-blue-500 flex items-center justify-center rounded-lg hover:bg-blue-50 hover:text-blue-500'
                              ref={ref}
                              onClick={() => getAllProduct.fetchNextPage()}
                              disabled={!getAllProduct.hasNextPage}
                        >
                              {/* {getAllProduct.isPending && 'Đang tải dữ liệu'} */}
                              {getAllProduct.hasNextPage
                                    ? 'Xem thêm'
                                    : getAllProduct.isPending
                                    ? 'Đang tải dữ liệu sản phẩm'
                                    : 'Hết sản phẩm hiển thị'}
                        </button>
                  </div>
            </div>
      )
}

export default ContentProduct
