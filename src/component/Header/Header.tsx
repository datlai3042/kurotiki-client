import { memo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Menu } from 'lucide-react'
import HeaderActions from './Components/HeaderActions'
import HeaderLogoToggle from './Components/HeaderLogoToggle'
import HeaderSeacrhInput from './Components/HeaderSearch'
import { getAddressDefault, renderStringAddressDetailV2 } from '../../utils/address.util'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import { UserResponse } from '../../types/user.type'
import { toDoHideSideBar, toDoShowSideBar } from '../../Redux/uiSlice'
import { ui } from '../../Customer/Sell/RegisterProductForm/ProductFormUpload'

function Header() {
      useEffect(() => {
            window.scrollTo(0, 0)
      }, [])
      const user = useSelector((state: RootState) => state.authentication.user) as UserResponse
      const address_default = (user?.user_address && user?.user_address.filter((address) => address.address_default === true)) || ''
      const location =
            (getAddressDefault(user?.user_address) && `${address_default ? renderStringAddressDetailV2(address_default[0]) : ''}`) || ''
      const uiSlice = useSelector((state: RootState) => state.uiSlice.showSideBar)
      const dispatch = useDispatch()
      const onShowSideBarAction = () => {
            return uiSlice ? dispatch(toDoHideSideBar()) : dispatch(toDoShowSideBar())
      }
      return (
            <header className='fixed left-0 top-0 z-[100] w-full border-b border-[#edf0f5] bg-white text-[#1d2b45] shadow-[0_1px_3px_rgba(15,23,42,0.03)] dark:border-[var(--border-color-input)] dark:bg-color-section-theme dark:text-text-theme'>
                  {/* Desktop utility bar */}
                  <div className='hidden h-[24px] bg-[#0b62db] text-white lg:block'>
                        <div className='mx-auto flex h-full max-w-[1480px] items-center justify-end gap-5 px-6 text-[10px] font-medium'>
                              <span>TikiNOW</span>
                              <span>Tiki Trading</span>
                              <span>Chăm sóc khách hàng</span>
                        </div>
                  </div>

                  {/* Main row: mobile = logo/actions, tablet+ = full row */}
                  <div className='mx-auto max-w-[1480px] px-3 sm:px-4 lg:px-0'>
                        <div className='flex h-[58px] items-center gap-2 sm:h-[64px] md:gap-4 lg:gap-6'>
                              <div className='flex shrink-0 items-center md:w-[120px] lg:w-[145px]'>
                                    <HeaderLogoToggle />
                              </div>
                              {user && location.length >0 && (
                                    <div className='hidden min-w-0 items-center gap-2 text-[11px] text-[#66748a] lg:flex lg:w-[180px] lg:shrink-0'>
                                          <MapPin size={16} strokeWidth={1.7} className='shrink-0 text-[#557399]' />
                                          <div title={location} className='min-w-0 leading-[14px] cursor-pointer'>
                                                <div>Giao đến:</div>
                                                <button className='max-w-[150px] truncate font-medium text-[#25324b] dark:text-text-theme'>
                                                      {location}
                                                </button>
                                          </div>
                                    </div>
                              )}

                              <div className='hidden min-w-0 flex-1 sm:block'>
                              
                                    <HeaderSeacrhInput />
                              </div>

                              <div className='ml-auto shrink-0'>
                                    <HeaderActions />
                              </div>
                        </div>

                        {/* Mobile search gets its own full-width row */}
                        <div className='pb-3 sm:hidden'>
                              <HeaderSeacrhInput />
                        </div>
                  </div>

                  {/* Only desktop gets the large navigation row */}
                  <nav className='hidden h-[46px] border-t border-[#f3f5f8] lg:block dark:border-[var(--border-color-input)]'>
                        <div className='mx-auto flex h-full max-w-[1480px] items-center gap-8 overflow-hidden px-6 lg:px-0 text-[11px] font-semibold'>
                              <button
                                    onClick={onShowSideBarAction}
                                    className='flex h-[34px] min-w-[190px] shrink-0 items-center gap-2 rounded-lg bg-[#1677ff] px-4 text-white shadow-[0_3px_8px_rgba(22,119,255,0.18)]'
                              >
                                    <Menu size={17} strokeWidth={2} />
                                    <span>Danh mục sản phẩm</span>
                              </button>
                              <Link to='/' className='shrink-0 text-[#1677ff]'>
                                    Trang chủ
                              </Link>
                              <a href='#flash-sale' className='shrink-0 transition hover:text-[#1677ff]'>
                                    Flash Sale
                              </a>
                              <a href='#tiki-card' className='shrink-0 transition hover:text-[#1677ff]'>
                                    Tiki Card
                              </a>
                              <a href='#ma-giam-gia' className='shrink-0 transition hover:text-[#1677ff]'>
                                    Mã giảm giá
                              </a>
                              <a href='#doi-tac' className='shrink-0 transition hover:text-[#1677ff]'>
                                    Ưu đãi đối tác
                              </a>
                              <a href='#ban-hang' className='shrink-0 transition hover:text-[#1677ff]'>
                                    Bán hàng cùng Tiki
                              </a>
                        </div>
                  </nav>
            </header>
      )
}

export default memo(Header)
