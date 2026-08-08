import { useQuery } from '@tanstack/react-query'
import { memo } from 'react'
import ProductApi from '../../../apis/product.api'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { STALE_TIME } from '../../Comment/Comment'

import truyenNgan from '../assets/img/book.png'
import taiNghe from '../assets/img/taiNghe.jpg'
import nguCoc from '../assets/img/ngucoc.png'
import message from '../assets/img/message.png'

import tatVoNam from '../assets/img/tatNam.jpg'
import truyenDai from '../assets/img/truyenDai.jpg'
import milk from '../assets/img/milk.jpg'
import nhaSach from '../assets/img/nhaSach.png'
import { Rate } from 'antd'

type Props = {
      onReset: () => void
      text: string
}

const LIMIT = 3
const arrayCategory = [
      { image: truyenNgan, label: 'Truyện ngắn - tản văn - tạp văn', href: '/book' },
      { image: taiNghe, label: 'Tai nghe có dây nhét tai', href: '/digital-device' },

      { image: nguCoc, label: 'Ngũ cốc, bột', href: '/food' },
      { image: message, label: 'Máy massage toàn thân', href: '/digital-device' },
      { image: tatVoNam, label: 'Tất vớ nam', href: '/fashion-male' },
      { image: truyenDai, label: 'Truyện dài', href: '/book' },
      { image: milk, label: 'Các sản phẩm từ sữa khác', href: '/food' },
      { image: nhaSach, label: 'Nhà sách Tiki', href: '/book' },
]

const HeaderResultSearch = (props: Props) => {
      const { text, onReset } = props

      const searchQuery = useQuery({
            queryKey: ['/v1/api/product/get-product-shop-name', text],
            queryFn: () => ProductApi.getProductShopName({ text }),
            enabled: Boolean(text),
      })

      const getProductTopSearch = useQuery({
            queryKey: ['get-product-top-search'],
            queryFn: () => ProductApi.getTopProductSearch({ limit: LIMIT }),
            enabled: !text,
            staleTime: STALE_TIME,
      })

      const products = searchQuery.data?.data.metadata.products
      const shops = searchQuery.data?.data.metadata.shops

      const onNavigate = () => {
            // setText('')
            onReset()
      }

      return (
            <>
                  <div className='absolute left-0 right-0 top-[calc(100%+10px)] z-[9999] w-[80vw] overflow-hidden rounded-2xl border border-slate-200/70 bg-color-section-theme text-text-theme shadow-[0_24px_70px_rgba(15,23,42,0.16)] md:w-full dark:border-slate-700/70'>
                        {/* Search suggestions */}
                        <div className='border-b border-[var(--border-color-input)] px-3 py-3 border-[var(--border-color-input)]'>
                              {!text && getProductTopSearch.isSuccess && getProductTopSearch.data.data.metadata.products.length === 0 && (
                                    <div className='px-3 py-4 text-sm text-slate-500'>
                                          Hãy nhập từ khóa để tìm kiếm sản phẩm hoặc cửa hàng
                                    </div>
                              )}

                              {!text &&
                                    getProductTopSearch.isSuccess &&
                                    getProductTopSearch.data.data.metadata.products.map((product) => (
                                          <Link
                                                key={product._id}
                                                to={`/product/${product._id}`}
                                                className='group flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2 text-sm transition hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10'
                                                onClick={onNavigate}
                                          >
                                                <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition group-hover:bg-blue-100 group-hover:text-blue-600 dark:bg-slate-800'>
                                                      <Search size={16} />
                                                </div>
                                                <span className='line-clamp-1'>{product.product_name}</span>
                                          </Link>
                                    ))}

                              {searchQuery.isSuccess && (
                                    <div className='flex flex-col gap-1'>
                                          {products &&
                                                products.length > 0 &&
                                                products.map((product) => (
                                                      <Link
                                                            key={product._id}
                                                            to={`/product/${product._id}`}
                                                            className='group flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2 text-sm transition hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10'
                                                            onClick={onNavigate}
                                                      >
                                                            <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition group-hover:bg-blue-100 group-hover:text-blue-600 dark:bg-slate-800'>
                                                                  <Search size={16} />
                                                            </div>
                                                            <span className='line-clamp-1'>{product.product_name}</span>
                                                      </Link>
                                                ))}

                                          {shops &&
                                                shops.length > 0 &&
                                                shops.map((shop) => (
                                                      <Link
                                                            key={shop._id}
                                                            to={`/shop/${shop._id}`}
                                                            className='flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-blue-50 dark:hover:bg-blue-500/10'
                                                            onClick={onNavigate}
                                                      >
                                                            <img
                                                                  src={shop.shop_avatar?.secure_url || shop.shop_avatar_default}
                                                                  className='h-11 w-11 shrink-0 rounded-xl border border-slate-200 object-cover dark:border-slate-700'
                                                                  alt=''
                                                            />

                                                            <div className='min-w-0 flex-1'>
                                                                  <p className='truncate text-sm font-semibold text-text-theme'>
                                                                        {shop.shop_name}
                                                                  </p>

                                                                  <div className='mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500'>
                                                                        <div className='flex items-center gap-1'>
                                                                              <span>
                                                                                    {shop.shop_vote ? shop.shop_vote.toString() : 4.5}
                                                                              </span>

                                                                              <Rate
                                                                                    defaultValue={1}
                                                                                    count={1}
                                                                                    allowHalf
                                                                                    disabled
                                                                                    className='text-[10px]'
                                                                              />
                                                                        </div>

                                                                        <span className='h-1 w-1 rounded-full bg-slate-300' />

                                                                        <span>{shop.shop_count_total_vote.toString()} đánh giá</span>
                                                                  </div>
                                                            </div>
                                                      </Link>
                                                ))}

                                          {products?.length === 0 && shops?.length === 0 && (
                                                <div className='flex min-h-[110px] flex-col items-center justify-center px-4 text-center'>
                                                      <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800'>
                                                            <Search size={18} />
                                                      </div>
                                                      <p className='mt-3 text-sm font-medium text-text-theme'>Không tìm thấy kết quả</p>
                                                      <p className='mt-1 text-xs text-slate-500'>Thử tìm kiếm bằng từ khóa khác.</p>
                                                </div>
                                          )}
                                    </div>
                              )}
                        </div>

                        {/* Featured categories */}
                        <div className='px-4 py-4'>
                              <div className='mb-3 flex items-center justify-between'>
                                    <p className='text-sm font-semibold text-text-theme'>Danh mục nổi bật</p>
                                    <span className='text-xs text-slate-400'>Khám phá nhanh</span>
                              </div>

                              <div className='grid auto-cols-[118px] grid-flow-col grid-rows-[145px] gap-2 overflow-x-auto pb-1 xl:grid-flow-row xl:grid-cols-4 xl:auto-rows-[150px] xl:overflow-x-visible'>
                                    {arrayCategory.map((category) => (
                                          <Link
                                                to={category.href}
                                                key={category.href + category.label}
                                                className='group flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl border border-transparent p-2 text-center transition hover:border-blue-200 hover:bg-blue-50 dark:hover:border-blue-500/20 dark:hover:bg-blue-500/10'
                                                onClick={onNavigate}
                                          >
                                                <div className='h-[84px] w-[84px] overflow-hidden rounded-full border border-[var(--border-color-input)] bg-white p-1 shadow-sm transition-transform duration-300 group-hover:scale-105 dark:border-slate-700'>
                                                      <img
                                                            src={category.image}
                                                            className='h-full w-full rounded-full object-cover'
                                                            alt='category'
                                                      />
                                                </div>

                                                <span className='line-clamp-2 text-xs leading-5  transition group-hover:text-blue-600  dark:group-hover:text-white  '>
                                                      {category.label}
                                                </span>
                                          </Link>
                                    ))}
                              </div>
                        </div>
                  </div>
            </>
      )
}

export default memo(HeaderResultSearch)
