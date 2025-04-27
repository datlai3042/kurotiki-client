import { Link, useLocation, useMatch } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'

import nhaSachLogo from './img/danhMuc/nhaSachTiki.jpg'
import bachHoaOnline from './img/danhMuc/bachHoaOnline.jpg'
import nhaCuaDoiSong from './img/danhMuc/nhaCuaDoiSong.jpg'
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
import { Store } from 'lucide-react'
import { UserResponse } from '../../types/user.type'
import { useMediaQuery } from '@mantine/hooks'
import { useEffect } from 'react'
import { toDoHideSideBar } from '../../Redux/uiSlice'

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
      { image: maGiamGia, label: 'Mã giảm giá ', href: '/discount-price' },
      { image: uaDaiTheVip, label: 'Ưa đãi thẻ vip', href: '/card-vip' },
      { image: dongTienNapThe, label: 'Đóng tiền nạp thẻ', href: '/money-card' },
      { image: muaTruocTraSau, label: 'Mua trước trả sau', href: '/credit-card' },
      { image: baoHiem, label: 'Bảo hiểm', href: '/insurance' },
]

type TProps = {}

function Sidebar(props: TProps) {
      const showSideBar = useSelector((state: RootState) => state.uiSlice.showSideBar)
      const dispatch = useDispatch()
      const match = useMatch('/')
      const { pathname } = useLocation()
      const queryMedia = useMediaQuery(
            '(max-width: 767px)',
            false,

            {
                  getInitialValueInEffect: false,
            },
      )
      const show = queryMedia ? (showSideBar ? true : false) : match ? true : false

      let styleEffect = {
            showSideBar: ` ${show ? `flex ${queryMedia ? 'animate-showSideBarAni' : ''}` : 'hidden'}`,
      }

      useEffect(() => {
            if (queryMedia) {
                  dispatch(toDoHideSideBar())
                  styleEffect.showSideBar = 'hidden'
            }
      }, [queryMedia, dispatch])

      useEffect(() => {
            if (queryMedia && showSideBar) {
                  dispatch(toDoHideSideBar())
            }
      }, [pathname])

      return (
            <>
                  {showSideBar && queryMedia && (
                        <div
                              onClick={() => {
                                    dispatch(toDoHideSideBar())
                                    styleEffect.showSideBar = 'hidden'
                              }}
                              className='w-full h-full fixed inset-0 bg-[rgba(0,0,0,.75)] z-[19] mt-[75px]'
                        ></div>
                  )}
                  <div
                        className={`${styleEffect.showSideBar} bg-color-section-theme hide-scroll border-r-[1px] border-[var(--border-color-input)] md:border-none  fixed md:sticky  w-[180px] xl:w-[230px] min-w-[230px] top-[65px] md:top-[75px] max-h-screen overflow-y-scroll z-[20]  text-[14px] `}
                  >
                        <div className='flex flex-col gap-[20px] bg-transparent h-max mb-[50px] text-text-theme'>
                              <div className='flex flex-col gap-[10px] h-max p-[16px] bg-color-section-theme rounded-[4px] '>
                                    <h3 className='text-[14px] font-semibold '>Danh mục</h3>
                                    <ul className='w-full min-h-[250px] h-max flex flex-col gap-[4px]'>
                                          {arrayCategory.map((category) => (
                                                <li key={category.href}>
                                                      <Link to={category.href} className='flex  gap-[8px] w-full h-[40px] items-center'>
                                                            <img src={category.image} className='w-[30px] ' alt='catelogy' />
                                                            <span>{category.label}</span>
                                                      </Link>
                                                </li>
                                          ))}
                                    </ul>
                              </div>

                              <div className='flex flex-col gap-[10px] h-max p-[16px]  bg-color-section-theme   rounded-xl'>
                                    <h3 className='text-[14px] font-semibold '>Nổi bật</h3>
                                    <ul className='w-full min-h-[250px] h-max flex flex-col gap-[4px]'>
                                          {arrayPopular.map((category) => (
                                                <li key={category.href}>
                                                      <Link to={category.href} className='flex  gap-[8px] w-full h-[50px] items-center'>
                                                            <img src={category.image} className='w-[30px] ' alt='catelogy' />
                                                            <span>{category.label}</span>
                                                      </Link>
                                                </li>
                                          ))}
                                    </ul>
                              </div>

                              <Link
                                    to={'/customer/register-sell'}
                                    className='w-full h-[70px] flex items-center p-[16px_24px] rounded-lg  gap-[8px] text-slate-500 '
                              >
                                    <Store />
                                    <span>Bán hàng cùng Tiki</span>
                              </Link>
                        </div>
                  </div>
            </>
      )
}

export default Sidebar
