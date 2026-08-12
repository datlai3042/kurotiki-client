import { Link, useLocation, useMatch } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'

import nhaSachLogo from './img/danhMuc/nhaSachTiki.jpg'
import bachHoaOnline from './img/danhMuc/bachHoaOnline.jpg'
import dienThoaiMayTinh from './img/danhMuc/dienThoaiMayTinhBang.jpg'
import doChoiMeVaBe from './img/danhMuc/doChoiMeVaBe.jpg'
import thietBiSo from './img/danhMuc/thietBiSoVaPhuKienSo.jpg'
import dienGiaDung from './img/danhMuc/dienGiaDung.jpg'
import lamDep from './img/danhMuc/lamDepSucKhoe.jpg'
import oto from './img/danhMuc/otoXeMayVaXeDap.jpg'
import thoiTrangNu from './img/danhMuc/thoiTrangNu.jpg'
import thoiTrangNam from './img/danhMuc/thoiTrangNam.jpg'
import giayDepNam from './img/danhMuc/giayDepNam.jpg'
import giayDepNu from './img/danhMuc/giayDepNu.jpg'
import mayAnh from './img/danhMuc/mayAnhMayQuayPhim.jpg'
import dienTu from './img/danhMuc/dienTuDienLanh.jpg'
import phuKienThoiTrang from './img/danhMuc/phuKienThoiTrang.jpg'
import dongHoVaTrangTri from './img/danhMuc/dongHoVaTrangSuc.jpg'
import baloVali from './img/danhMuc/baloVaVali.jpg'
import tuiThoiTrangNam from './img/danhMuc/tuiThoiTrangNam.jpg'
import tuiThoiTrangNu from './img/danhMuc/tuiThoiTrangNu.jpg'

import tikiExchange from './img/noiBat/tikiExchange.jpg'
import goodFast from './img/noiBat/giaTotMoiNgay.jpg'
import giaReMoiNgay from './img/noiBat/giaTotMoiNgay.jpg'
import maGiamGia from './img/noiBat/maGiamGia.jpg'
import uaDaiTheVip from './img/noiBat/uaDaiTheVip.jpg'
import dongTienNapThe from './img/noiBat/dongTienNapThe.jpg'
import muaTruocTraSau from './img/noiBat/muaTruocTraSau.jpg'
import baoHiem from './img/noiBat/baoHiemTiki360.jpg'

import { ChevronRight, Store, X } from 'lucide-react'
import { useMediaQuery } from '@mantine/hooks'
import { useEffect } from 'react'
import { toDoHideSideBar } from '../../Redux/uiSlice'
import Portal from '../Portal'

const arrayCategory = [
      { image: nhaSachLogo, label: 'Nhà sách Tiki', href: '/book' },
      { image: bachHoaOnline, label: 'Ngon', href: '/food' },
      { image: dienThoaiMayTinh, label: 'Điện thoại và máy tính', href: '/phone-laptop' },
      { image: doChoiMeVaBe, label: 'Đồ chơi - Mẹ & Bé', href: '/toy' },
      { image: thietBiSo, label: 'Thiết bị số - Phụ kiện số', href: '/digital-device' },
      { image: dienGiaDung, label: 'Điện gia dụng', href: '/electronic' },
      { image: lamDep, label: 'Làm đẹp', href: '/beauty' },
      { image: oto, label: 'Xe máy', href: '/honda' },
      { image: thoiTrangNu, label: 'Thời trang nữ', href: '/fashion-female' },
      { image: thoiTrangNam, label: 'Thời trang nam', href: '/fashion-male' },
      { image: giayDepNam, label: 'Giày dép nam', href: '/shoes-man' },
      { image: giayDepNu, label: 'Giày dép nữ', href: '/shoes-female' },
      { image: mayAnh, label: 'Máy ảnh', href: '/camera' },
      { image: dienTu, label: 'Điện tử tủ lạnh', href: '/fridge' },
      { image: phuKienThoiTrang, label: 'Phụ kiện thời trang', href: '/fashion-accessory' },
      { image: dongHoVaTrangTri, label: 'Đồng hồ và trang trí', href: '/watch' },
      { image: baloVali, label: 'Balo và Vali', href: '/balo-vali' },
      { image: tuiThoiTrangNam, label: 'Túi thời trang nam', href: '/bag-man' },
      { image: tuiThoiTrangNu, label: 'Túi thời trang nữ', href: '/bag-female' },
]

const arrayPopular = [
      { image: tikiExchange, label: 'Tiki Exchange', href: '/tiki-exchange' },
      { image: goodFast, label: 'Tốt & nhanh', href: '/good-fast' },
      { image: giaReMoiNgay, label: 'Giá rẻ mỗi ngày', href: '/price-down' },
      { image: maGiamGia, label: 'Mã giảm giá', href: '/discount-price' },
      { image: uaDaiTheVip, label: 'Ưu đãi thẻ VIP', href: '/card-vip' },
      { image: dongTienNapThe, label: 'Đóng tiền nạp thẻ', href: '/money-card' },
      // { image: muaTruocTraSau, label: 'Mua trước trả sau', href: '/credit-card' },
      // { image: baoHiem, label: 'Bảo hiểm', href: '/insurance' },
]

function Sidebar() {
      const showSideBar = useSelector((state: RootState) => state.uiSlice.showSideBar)
      const dispatch = useDispatch()
      const { pathname } = useLocation()

      const queryMedia = useMediaQuery(
            '(max-width: 767px)',
            false,
            {
                  getInitialValueInEffect: false,
            },
      )

      const closeSidebar = () => {
            dispatch(toDoHideSideBar())
      }

      useEffect(() => {
            if (queryMedia) {
                  dispatch(toDoHideSideBar())
            }
      }, [queryMedia, dispatch])

      useEffect(() => {
            if (queryMedia && showSideBar) {
                  dispatch(toDoHideSideBar())
            }
      }, [pathname])

      useEffect(() => {
            if (!showSideBar) return

            const currentOverflow = document.body.style.overflow
            document.body.style.overflow = 'hidden'

            const onKeyDown = (event: KeyboardEvent) => {
                  if (event.key === 'Escape') closeSidebar()
            }

            window.addEventListener('keydown', onKeyDown)

            return () => {
                  document.body.style.overflow = currentOverflow
                  window.removeEventListener('keydown', onKeyDown)
            }
      }, [showSideBar])

      return (
            <Portal>
                  {showSideBar && (
                        <>
                              <button
                                    type='button'
                                    aria-label='Đóng sidebar'
                                    onClick={closeSidebar}
                                    className='fixed inset-0 z-[998] bg-slate-950/75 backdrop-blur-[2px]'
                              />

                              <aside
                                    className='
                                          fixed right-0 top-0 z-[999]
                                          flex h-dvh w-[min(500px,92vw)] flex-col
                                          overflow-hidden
                                          border-l border-slate-200
                                          bg-white
                                          shadow-[-20px_0_60px_rgba(15,23,42,0.18)]
                                          animate-showSideBarAni

                                          dark:border-slate-700
                                          dark:bg-[#151a21]
                                          dark:text-slate-100
                                    '
                              >
                                    {/* Header */}
                                    <div
                                          className='
                                                sticky top-0 z-10
                                                flex items-center justify-between
                                                border-b border-slate-200
                                                bg-white/95
                                                px-5 py-4
                                                backdrop-blur

                                                dark:border-slate-700
                                                dark:bg-[#151a21]/95
                                          '
                                    >
                                          <div>
                                                <p className='text-[11px] font-medium uppercase tracking-[0.12em] text-blue-600 dark:text-blue-400'>
                                                      KuroTiki
                                                </p>
                                                <h2 className='mt-0.5 text-[18px] font-bold text-slate-900 dark:text-white'>
                                                      Danh mục sản phẩm
                                                </h2>
                                          </div>

                                          <button
                                                type='button'
                                                onClick={closeSidebar}
                                                className='
                                                      flex h-9 w-9 items-center justify-center
                                                      rounded-full
                                                      text-slate-500
                                                      transition
                                                      hover:bg-slate-100 hover:text-slate-900

                                                      dark:text-slate-400
                                                      dark:hover:bg-slate-800
                                                      dark:hover:text-white
                                                '
                                                aria-label='Đóng'
                                          >
                                                <X size={20} />
                                          </button>
                                    </div>

                                    <div className='hide-scroll flex-1 overflow-y-auto px-4 py-4'>
                                          {/* Categories */}
                                          <section className=''>
                                                <div className='mb-2 flex items-center justify-between px-1'>
                                                      <h3 className='text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400'>
                                                            Danh mục
                                                      </h3>
                                                      <span className='text-[11px] text-slate-400'>
                                                            {arrayCategory.length} mục
                                                      </span>
                                                </div>

                                                <div className='grid gap-1.5 max-h-[350px] overflow-auto'>
                                                      {arrayCategory.map((category) => {
                                                            const active = pathname === category.href

                                                            return (
                                                                  <Link
                                                                        key={category.href}
                                                                        to={category.href}
                                                                        onClick={closeSidebar}
                                                                        className={`
                                                                              group flex min-h-[52px] items-center
                                                                              gap-3 rounded-xl px-2.5 py-2
                                                                              transition-all

                                                                              ${
                                                                                    active
                                                                                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
                                                                                          : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/80'
                                                                              }
                                                                        `}
                                                                  >
                                                                        <div
                                                                              className='
                                                                                    flex h-9 w-9 shrink-0
                                                                                    items-center justify-center
                                                                                    overflow-hidden
                                                                                    rounded-xl
                                                                                    border border-slate-200
                                                                                    bg-white

                                                                                    dark:border-slate-700
                                                                                    dark:bg-slate-800
                                                                              '
                                                                        >
                                                                              <img
                                                                                    src={category.image}
                                                                                    alt={category.label}
                                                                                    className='h-full w-full object-cover'
                                                                              />
                                                                        </div>

                                                                        <span className='min-w-0 flex-1 truncate text-[13px] font-medium'>
                                                                              {category.label}
                                                                        </span>

                                                                        <ChevronRight
                                                                              size={16}
                                                                              className='shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 dark:text-slate-600'
                                                                        />
                                                                  </Link>
                                                            )
                                                      })}
                                                </div>
                                          </section>

                                          {/* Popular */}
                                          <section className='mt-6 border-t border-slate-200 pt-5 dark:border-slate-700'>
                                                <div className='mb-3 flex items-center justify-between px-1'>
                                                      <div>
                                                            <h3 className='text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400'>
                                                                  Nổi bật
                                                            </h3>
                                                            <p className='mt-0.5 text-[11px] text-slate-400'>
                                                                  Tiện ích và ưu đãi
                                                            </p>
                                                      </div>
                                                </div>

                                                <div className='grid grid-cols-2 gap-2'>
                                                      {arrayPopular.map((category) => {
                                                            const active = pathname === category.href

                                                            return (
                                                                  <Link
                                                                        key={category.href}
                                                                        to={category.href}
                                                                        onClick={closeSidebar}
                                                                        className={`
                                                                              flex min-h-[74px] flex-col
                                                                              items-start justify-between
                                                                              rounded-2xl border p-3
                                                                              transition

                                                                              ${
                                                                                    active
                                                                                          ? 'border-blue-300 bg-blue-50 dark:border-blue-500/40 dark:bg-blue-500/10'
                                                                                          : 'border-slate-200 bg-slate-50 hover:border-blue-200 hover:bg-blue-50/50 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-slate-600'
                                                                              }
                                                                        `}
                                                                  >
                                                                        <img
                                                                              src={category.image}
                                                                              alt={category.label}
                                                                              className='h-7 w-7 rounded-lg object-cover'
                                                                        />

                                                                        <span className='mt-2 line-clamp-2 text-[12px] font-medium leading-[16px] text-slate-700 dark:text-slate-200'>
                                                                              {category.label}
                                                                        </span>
                                                                  </Link>
                                                            )
                                                      })}
                                                </div>
                                          </section>

                                          {/* Seller CTA */}
                                          <section className='mt-6 border-t border-slate-200 pt-5 dark:border-slate-700'>
                                                <Link
                                                      to='/customer/register-sell'
                                                      onClick={closeSidebar}
                                                      className='
                                                            group flex items-center gap-3
                                                            rounded-2xl
                                                            bg-gradient-to-r from-blue-600 to-blue-500
                                                            p-4
                                                            text-white
                                                            shadow-[0_8px_24px_rgba(37,99,235,0.22)]
                                                            transition
                                                            hover:translate-y-[-1px]
                                                      '
                                                >
                                                      <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15'>
                                                            <Store size={20} />
                                                      </div>

                                                      <div className='min-w-0 flex-1'>
                                                            <p className='text-[13px] font-semibold'>
                                                                  Bán hàng cùng KuroTiki
                                                            </p>
                                                            <p className='mt-0.5 text-[11px] text-blue-100'>
                                                                  Mở gian hàng và bắt đầu kinh doanh
                                                            </p>
                                                      </div>

                                                      <ChevronRight
                                                            size={18}
                                                            className='shrink-0 transition-transform group-hover:translate-x-0.5'
                                                      />
                                                </Link>
                                          </section>
                                    </div>
                              </aside>
                        </>
                  )}
            </Portal>
      )
}

export default Sidebar