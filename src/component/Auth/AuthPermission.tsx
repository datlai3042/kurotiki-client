import { useState } from 'react'
import {
      BadgePercent,
      ChevronRight,
      LockKeyhole,
      PackageCheck,
      ShieldCheck,
      ShoppingBag,
      UserRound,
} from 'lucide-react'
import Portal from '../Portal'
import AuthWrapper from './AuthWrapper'

const AuthPermission = () => {
      const [showBoxAuth, setShowBoxAuth] = useState(false)

      const handleAuth = () => {
            setShowBoxAuth(true)
      }

      const benefits = [
            {
                  title: 'Mua sắm dễ dàng',
                  description: 'Lưu giỏ hàng và mua nhanh hơn',
                  icon: <ShoppingBag size={18} strokeWidth={1.8} />,
            },
            {
                  title: 'Ưu đãi riêng bạn',
                  description: 'Nhận khuyến mãi và đề xuất phù hợp',
                  icon: <BadgePercent size={18} strokeWidth={1.8} />,
            },
            {
                  title: 'Theo dõi đơn hàng',
                  description: 'Quản lý lịch sử và trạng thái đơn hàng',
                  icon: <PackageCheck size={18} strokeWidth={1.8} />,
            },
            {
                  title: 'Bảo mật thông tin',
                  description: 'Thông tin tài khoản được bảo vệ',
                  icon: <ShieldCheck size={18} strokeWidth={1.8} />,
            },
      ]

      return (
            <>
                  <div className='flex min-h-[calc(100vh-140px)] w-full items-center justify-center bg-color-section-theme px-4 py-8 text-text-theme sm:px-6 xl:px-8'>
                        <section className='w-full max-w-[1040px] overflow-hidden rounded-3xl border border-[var(--border-color-input)] bg-color-section-theme shadow-[0_20px_70px_rgba(0,0,0,0.12)]'>
                              <div className='grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr]'>
                                    {/* Illustration */}
                                    <div className='relative hidden min-h-[470px] overflow-hidden border-r border-[var(--border-color-input)] bg-gradient-to-br from-blue-500/[0.10] via-blue-500/[0.04] to-transparent p-8 lg:flex lg:items-center lg:justify-center'>
                                          <div className='absolute -left-16 top-16 h-44 w-44 rounded-full bg-blue-500/10 blur-3xl' />
                                          <div className='absolute -bottom-16 right-0 h-52 w-52 rounded-full bg-blue-500/10 blur-3xl' />

                                          <div className='relative flex flex-col items-center text-center'>
                                                <div className='relative'>
                                                      <div className='flex h-[190px] w-[190px] items-center justify-center rounded-[42px] bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-[0_24px_60px_rgba(37,99,235,0.30)]'>
                                                            <LockKeyhole size={86} strokeWidth={1.4} />
                                                      </div>

                                                      <div className='absolute -right-5 -top-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-color-section-theme text-blue-500 shadow-lg'>
                                                            <ShieldCheck size={27} />
                                                      </div>
                                                </div>

                                                <h3 className='mt-8 text-[20px] font-semibold text-text-theme'>
                                                      Tài khoản KuroTiki
                                                </h3>

                                                <p className='mt-2 max-w-[320px] text-sm leading-6 text-slate-500'>
                                                      Đăng nhập để đồng bộ giỏ hàng, đơn hàng và các tiện ích cá nhân trên mọi thiết bị.
                                                </p>
                                          </div>
                                    </div>

                                    {/* Login panel */}
                                    <div className='flex flex-col justify-center p-5 sm:p-8 lg:p-10'>
                                          <div className='mx-auto w-full max-w-[460px]'>
                                                <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500'>
                                                      <LockKeyhole size={23} />
                                                </div>

                                                <h1 className='mt-5 text-[26px] font-bold tracking-[-0.02em] text-text-theme sm:text-[32px]'>
                                                      Chức năng cần đăng nhập
                                                </h1>

                                                <p className='mt-3 text-[13px] leading-6 text-slate-500 sm:text-sm'>
                                                      Vui lòng đăng nhập để truy cập và sử dụng đầy đủ các tính năng dành riêng cho tài khoản của bạn.
                                                </p>

                                                <button
                                                      type='button'
                                                      onClick={handleAuth}
                                                      className='mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(37,99,235,0.20)] transition hover:bg-blue-700'
                                                >
                                                      <UserRound size={17} />
                                                      Đăng nhập
                                                </button>

                                                <div className='mt-3 rounded-xl border border-[var(--border-color-input)] bg-slate-500/[0.025] px-4 py-3'>
                                                      <p className='text-center text-[11px] leading-5 text-slate-500'>
                                                            Bạn chưa có tài khoản? Bạn có thể tạo tài khoản ngay trong cửa sổ đăng nhập.
                                                      </p>
                                                </div>
                                          </div>
                                    </div>
                              </div>

                              {/* Benefits */}
                              <div className='grid grid-cols-1 border-t border-[var(--border-color-input)] sm:grid-cols-2 xl:grid-cols-4'>
                                    {benefits.map((item, index) => (
                                          <div
                                                key={item.title}
                                                className={`flex items-start gap-3 px-5 py-4 ${
                                                      index !== benefits.length - 1
                                                            ? 'xl:border-r xl:border-[var(--border-color-input)]'
                                                            : ''
                                                } ${
                                                      index < 2
                                                            ? 'sm:border-b sm:border-[var(--border-color-input)] xl:border-b-0'
                                                            : ''
                                                }`}
                                          >
                                                <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500'>
                                                      {item.icon}
                                                </div>

                                                <div className='min-w-0'>
                                                      <p className='text-[12px] font-semibold text-text-theme'>
                                                            {item.title}
                                                      </p>

                                                      <p className='mt-1 text-[11px] leading-5 text-slate-500'>
                                                            {item.description}
                                                      </p>
                                                </div>
                                          </div>
                                    ))}
                              </div>
                        </section>
                  </div>

                  {showBoxAuth && (
                        <Portal>
                              <AuthWrapper setShowBoxAuth={setShowBoxAuth} />
                        </Portal>
                  )}
            </>
      )
}

export default AuthPermission