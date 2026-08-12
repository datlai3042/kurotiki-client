import { useInViewport } from '@mantine/hooks'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { debounce } from 'lodash'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import ProductApi from '../../../apis/product.api'
import ProductMedium from './ProductMedium'
import { Link } from 'react-router-dom'
import ProductShopInfo from '../../../pages/product/Components/ProductShopInfo'
import ShopApi from '../../../apis/shop.api'
import { STALE_TIME } from '../../Comment/Comment'
//relative brother conclict

import NhaSachTikiLogo from '../../Sidebar/img/danhMuc/nhaSachTiki.jpg'
import bachHoaOnline from '../../Sidebar/img/danhMuc/bachHoaOnline.jpg'
import dongHoVaTrangSuc from '../../Sidebar/img/danhMuc/dongHoVaTrangSuc.jpg'
import dienThoaiMayTinhBang from '../../Sidebar/img/danhMuc/dienThoaiMayTinhBang.jpg'
import mayAnhCamera from '../../Sidebar/img/danhMuc/mayAnhMayQuayPhim.jpg'
import oto from '../../Sidebar/img/danhMuc/otoXeMayVaXeDap.jpg'
import { ShopResponse } from '../../../types/shop.type'
import BoxLoading from '../../BoxUi/BoxLoading'
import { Bike, BookOpen, Camera, FlaskConical, Gem, LucideIcon, MoreHorizontal, Smartphone } from 'lucide-react'
import BoxResponsiveOverflow, { BoxResponsiveFlowClose } from '../../BoxUi/BoxResponsiveFlow'

type TagActiveArray = '/book' | '/food' | '/watch' | '/phone-laptop' | '/camera' | '/honda' | '/'
const categoryIcons = {
      book: BookOpen,
      flask: FlaskConical,
      gem: Gem,
      phone: Smartphone,
      camera: Camera,
      bike: Bike,
}
const arrayCategory: { image: LucideIcon; label: string; href: TagActiveArray }[] = [
      { image: BookOpen, label: 'Nhà sách Tiki', href: '/book' },
      { image: FlaskConical, label: 'Bách hóa Online', href: '/food' },

      { image: Gem, label: 'Đồng hồ và trang sức', href: '/watch' },
      { image: Smartphone, label: 'Điện thoại và máy tính', href: '/phone-laptop' },
      { image: Camera, label: 'Máy ảnh', href: '/camera' },
      { image: Bike, label: 'Xe máy', href: '/honda' },
]
const categories = [
      {
            id: 'book',
            name: 'Nhà sách Tiki',
            icon: <BookOpen size={18} />,
            path: '/book',
      },
      {
            id: 'food',
            name: 'Bách hóa Online',
            icon: <FlaskConical size={18} />,
            path: '/food',
      },
      {
            id: 'watch',
            name: 'Đồng hồ và trang sức',
            icon: <Gem size={18} />,
            path: '/watch',
      },
      {
            id: 'phone',
            name: 'Điện thoại và máy tính',
            icon: <Smartphone size={18} />,
            path: '/phone-laptop',
      },
      {
            id: 'camera',
            name: 'Máy ảnh',
            icon: <Camera size={18} />,
            path: '/camera',
      },
      {
            id: 'motorbike',
            name: 'Xe máy',
            icon: <Bike size={18} />,
            path: '/honda',
      },
]
const LIMIT = 24
const ContentProduct = () => {
      const refPos = useRef<HTMLDivElement | null>(null)
      const stickyRef = useRef<HTMLDivElement>(null)
      const [tagActive, setTagActive] = useState<TagActiveArray>('/')
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
      }, [getAllProduct.data, getAllProduct.isSuccess])

      const styleEffect = {
            onActive: (check: boolean) => {
                  if (check) return 'bg-color-main border-b-[3px] border-blue-500 !text-[#fff]'
                  return 'hover:bg-color-main hover:text-[#fff]'
            },
      }

      return (
            <div className=' z-[5] w-full min-h-[370px] h-max  flex flex-col gap-[8px]   text-text-theme  xl:p-0'>
                  <div className='animate-mountComponent  w-full sticky top-[105px] md:top-[135px]   z-[2] ' ref={stickyRef}>
                        <div className=' w-full shadow-[0_12px_12px_-12px_rgba(15,23,42,0.35)]  bg-color-section-theme  rounded  border[1px] border-b-[1px] border-[var(--border-color-input)]  flex flex-col gap-[8px] pt-[10px]'>
                              <h3 className='w-full pl-[20px] font-bold text-[16px]'>Gợi ý hôm nay</h3>

                              <BoxResponsiveOverflow
                                    items={categories}
                                    gap={12}
                                    className='p-[12px_20px]'
                                    itemClassName='flex-1'
                                    getKey={(category) => category.id}
                                    renderItem={(category) => {
                                          const isActive = tagActive === category.path

                                          return (
                                                <Link
                                                      to={category.path}
                                                      key={category.path + category.id}
                                                      onClick={() => setTagActive(category.path as TagActiveArray)}
                                                      className={`
                              group relative flex h-[118px] w-full
                              flex-col items-center justify-center
                              overflow-hidden rounded-2xl
                              border transition-all duration-200

                              ${
                                    isActive
                                          ? `
                                                border-blue-500/50
                                                bg-gradient-to-b
                                                from-blue-500/10
                                                to-blue-500/[0.025]
                                                shadow-[0_8px_24px_rgba(59,130,246,0.12)]
                                          `
                                          : `
                                                border-[var(--border-color-input)]
                                                bg-color-section-theme
                                                hover:-translate-y-[2px]
                                                hover:border-blue-500/30
                                                hover:shadow-[0_10px_28px_rgba(0,0,0,0.07)]
                                          `
                              }
                        `}
                                                >
                                                      <div
                                                            className={`
                                    absolute left-1/2 top-0 h-[3px]
                                    -translate-x-1/2 rounded-b-full
                                    bg-blue-500 transition-all duration-200

                                    ${isActive ? 'w-10 opacity-100' : 'w-0 opacity-0'}
                              `}
                                                      />

                                                      <div
                                                            className='
                                    absolute -right-5 -top-5
                                    h-16 w-16 rounded-full
                                    bg-blue-500/5
                                    transition-transform duration-300
                                    group-hover:scale-150
                              '
                                                      />

                                                      <div
                                                            className={`
                                    relative z-[1]
                                    flex h-12 w-12
                                    items-center justify-center
                                    rounded-2xl
                                    transition-all duration-200

                                    ${
                                          isActive
                                                ? `
                                                      bg-blue-500
                                                      text-white
                                                      shadow-[0_6px_18px_rgba(59,130,246,0.28)]
                                                `
                                                : `
                                                      bg-blue-500/[0.08]
                                                      text-blue-500
                                                      group-hover:bg-blue-500
                                                      group-hover:text-white
                                                      group-hover:shadow-[0_6px_18px_rgba(59,130,246,0.2)]
                                                `
                                    }
                              `}
                                                      >
                                                            {category.icon}
                                                      </div>

                                                      <span
                                                            className={`
                                    relative z-[1]
                                    mt-3 line-clamp-2
                                    px-2 text-center
                                    text-[12px] font-semibold
                                    leading-[17px]
                                    transition-colors

                                    ${isActive ? 'text-blue-500' : 'text-slate-500 group-hover:text-text-theme'}
                              `}
                                                      >
                                                            {category.name}
                                                      </span>
                                                </Link>
                                          )
                                    }}
                                    renderMore={({ open, hiddenCount }: any) => (
                                          <button
                                                type='button'
                                                onClick={open}
                                                className='
                        group flex h-[118px] w-full flex-col
                        items-center justify-center
                        rounded-2xl border border-dashed
                        border-[var(--border-color-input)]
                        bg-color-section-theme
                        transition-all duration-200
                        hover:-translate-y-[2px]
                        hover:border-blue-500/40
                        hover:bg-blue-500/[0.03]
                        hover:shadow-[0_10px_28px_rgba(0,0,0,0.07)]
                  '
                                          >
                                                <div
                                                      className='
                              flex h-12 w-12 items-center justify-center
                              rounded-2xl bg-blue-500/[0.08]
                              text-blue-500 transition-all duration-200
                              group-hover:bg-blue-500
                              group-hover:text-white
                              group-hover:shadow-[0_6px_18px_rgba(59,130,246,0.2)]
                        '
                                                >
                                                      <MoreHorizontal size={19} />
                                                </div>

                                                <span className='mt-3 text-[12px] font-semibold text-slate-500 transition-colors group-hover:text-text-theme'>
                                                      Xem thêm
                                                </span>

                                                {hiddenCount > 0 && (
                                                      <span className='mt-0.5 text-[10px] text-slate-400'>+{hiddenCount} danh mục</span>
                                                )}
                                          </button>
                                    )}
                                    renderExpanded={({ items, close }: any) => (
                                          <BoxResponsiveFlowClose
                                                open
                                                onClose={close}
                                                title={
                                                      <div>
                                                            <h3 className='text-base font-bold dark:text-white'>Danh mục sản phẩm</h3>

                                                            <p className='mt-0.5 text-xs text-slate-500'>Khám phá tất cả danh mục</p>
                                                      </div>
                                                }
                                          >
                                                <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
                                                      {items.map((category: (typeof categories)[0]) => {
                                                            const isActive = tagActive === category.path

                                                            return (
                                                                  <Link
                                                                        to={category.path}
                                                                        key={category.path + category.id}
                                                                        onClick={() => {
                                                                              setTagActive(category.path as TagActiveArray)
                                                                              close()
                                                                        }}
                                                                        className={`
                                                group relative flex min-h-[110px]
                                                flex-col items-center justify-center
                                                overflow-hidden rounded-2xl border p-3
                                                transition-all duration-200

                                                ${
                                                      isActive
                                                            ? `
                                                                  border-blue-500/50
                                                                  bg-blue-500/[0.08]
                                                                  text-blue-500
                                                            `
                                                            : `
                                                                  border-[var(--border-color-input)]
                                                                  bg-color-section-theme
                                                                  text-text-theme
                                                                  hover:-translate-y-[2px]
                                                                  hover:border-blue-500/30
                                                                  hover:bg-blue-500/[0.03]
                                                            `
                                                }
                                          `}
                                                                  >
                                                                        {isActive && (
                                                                              <div className='absolute left-1/2 top-0 h-[3px] w-9 -translate-x-1/2 rounded-b-full bg-blue-500' />
                                                                        )}

                                                                        <div
                                                                              className={`
                                                      flex h-11 w-11 items-center justify-center
                                                      rounded-2xl transition-all duration-200

                                                      ${
                                                            isActive
                                                                  ? 'bg-blue-500 text-white shadow-[0_6px_18px_rgba(59,130,246,0.25)]'
                                                                  : 'bg-blue-500/[0.08] text-blue-500 group-hover:bg-blue-500 group-hover:text-white'
                                                      }
                                                `}
                                                                        >
                                                                              {category.icon}
                                                                        </div>

                                                                        <span className='mt-2 line-clamp-2 px-2 text-center text-[12px] font-semibold leading-4'>
                                                                              {category.name}
                                                                        </span>
                                                                  </Link>
                                                            )
                                                      })}
                                                </div>
                                          </BoxResponsiveFlowClose>
                                    )}
                              />
                        </div>
                  </div>
                  <div className='    w-full h-max min-h-[360px] '>
                        <div className=' w-full h-full grid grid-col-2 sm:grid-cols-3 xl:grid-cols-7  grid-row-[360px] grid-flow-row auto-cols-[calc((100%-20px)/2)] xl:auto-cols-[calc((100%-120px)/7)] auto-rows-[360px] gap-[10px]'>
                              {getAllProduct.isSuccess && (
                                    <>
                                          {shopAdmin && (
                                                <div className='col-span-2 flex flex-col p-[16px] h-full bg-color-section-theme rounded-lg border-[1px] border-[var(--border-color-input)]'>
                                                      <Link to={`/shop/${shopAdmin?._id}`} className='flex justify-center h-full'>
                                                            {/* <img
                                                                  src={shopAdmin?.shop_avatar.secure_url || shopAdmin?.shop_avatar_default}
                                                                  className='object-cover w-[90%] h-full'
                                                                  alt='shop admin'
                                                            /> */}
                                                            <div className='w-full h-full flex-1 py-[6px] flex justify-center'>
                                                                  <ProductShopInfo
                                                                        shop={shopAdminQuery.data?.data.metadata.shopAdmin as ShopResponse}
                                                                  />
                                                            </div>
                                                      </Link>
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

                              {page + 1 <= totalPage && getAllProduct.isPending && (
                                    <>
                                          <div className=' col-span-2 skeleton__container'></div>
                                          {Array(10)
                                                .fill(0)
                                                ?.map((_, index) => (
                                                      <div className=' w-full h-full rounded-lg skeleton__container' key={index}></div>
                                                ))}
                                    </>
                              )}
                        </div>
                  </div>
                  <div className='w-full mt-2 flex items-center justify-center' ref={refPos}>
                        <button
                              className='  min-w-[180px] px-[16px] gap-3 w-max h-[48px] bg-color-section-theme border-[1px] border-blue-500 text-blue-500 flex items-center justify-center rounded-lg hover:bg-blue-50 hover:text-blue-500'
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
                              {getAllProduct.isLoading && <BoxLoading color='text-[#ccc]' />}{' '}
                        </button>
                  </div>
            </div>
      )
}

export default ContentProduct
