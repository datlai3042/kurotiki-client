import React, { useState } from 'react'
import {
      Search,
      User,
      Bell,
      ShoppingCart,
      Moon,
      Menu,
      Camera,
      Save,
      Mail,
      Lock,
      ShieldCheck,
      Headphones,
      ChevronRight,
      Package,
      Store,
      TrendingUp,
      Eye,
      MessageSquare,
      Tag,
      MapPin,
      KeyRound,
      Pencil,
      Crown,
} from 'lucide-react'

interface SidebarMenuItem {
      label: string
      icon: React.ReactNode
      active?: boolean
      children?: { label: string; icon: React.ReactNode }[]
}

const AccountInfoPage: React.FC = () => {
      const [fullName, setFullName] = useState('newaccount304')
      const [nickName, setNickName] = useState('@newaccount304')
      const [day, setDay] = useState('07')
      const [month, setMonth] = useState('08')
      const [year, setYear] = useState('2026')
      const [gender, setGender] = useState<'male' | 'female' | 'other'>('male')

      const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'))
      const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
      const years = Array.from({ length: 100 }, (_, i) => String(2026 - i))

      const menuItems: SidebarMenuItem[] = [
            { label: 'Thông tin tài khoản', icon: <User size={18} />, active: true },
            { label: 'Thông báo của tôi', icon: <Bell size={18} /> },
            { label: 'Quản lý đơn hàng', icon: <Package size={18} /> },
            {
                  label: 'Quản lý của hàng',
                  icon: <Store size={18} />,
                  children: [
                        { label: 'Top lượt bán', icon: <TrendingUp size={16} /> },
                        { label: 'Top lượt xem', icon: <Eye size={16} /> },
                        { label: 'Top bình luận', icon: <MessageSquare size={16} /> },
                  ],
            },
            { label: 'Đăng kí bán sản phẩm', icon: <Tag size={18} /> },
            { label: 'Sổ địa chỉ', icon: <MapPin size={18} /> },
            { label: 'Cập nhật Email', icon: <Mail size={18} /> },
            { label: 'Cập nhật mật khẩu', icon: <Lock size={18} /> },
      ]

      const handleSave = () => {
            // Xử lý lưu thông tin tài khoản
            console.log('Lưu thay đổi:', { fullName, nickName, day, month, year, gender })
      }

      return (
            <div className=' text-[14px] max-w-[98vw]  w-[1360px] mx-auto min-h-full flex flex-col  pt-[15px] xl:pt-[0px]  pb-[24px] mt-0 '>
                  <div className='min-h-screen bg-gray-50'>
                        {/* Header */}

                        {/* Body */}
                        <div className='max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-6'>
                              {/* Sidebar trái */}
                              <aside className='space-y-5'>
                                    <div className='bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white'>
                                          <div className='flex items-center gap-3'>
                                                <div className='w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold border-2 border-white/40'>
                                                      TIKI
                                                </div>
                                                <div>
                                                      <p className='text-xs text-blue-100'>Tài khoản của</p>
                                                      <p className='font-semibold'>@newaccount304</p>
                                                      <span className='inline-flex items-center gap-1 bg-white/20 text-xs px-2 py-0.5 rounded-full mt-1'>
                                                            Thành viên <Crown size={12} />
                                                      </span>
                                                </div>
                                          </div>
                                    </div>

                                    <nav className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
                                          <ul>
                                                {menuItems.map((item, idx) => (
                                                      <li key={idx}>
                                                            <button
                                                                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors ${
                                                                        item.active
                                                                              ? 'bg-blue-50 text-blue-600 font-medium'
                                                                              : 'text-gray-600 hover:bg-gray-50'
                                                                  }`}
                                                            >
                                                                  {item.icon}
                                                                  <span>{item.label}</span>
                                                            </button>
                                                            {item.children && (
                                                                  <ul className='ml-8 border-l border-gray-100'>
                                                                        {item.children.map((child, cidx) => (
                                                                              <li key={cidx}>
                                                                                    <button className='w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-500 hover:text-blue-600 hover:bg-gray-50'>
                                                                                          <span className='text-gray-400'>•</span>
                                                                                          {child.icon}
                                                                                          <span>{child.label}</span>
                                                                                    </button>
                                                                              </li>
                                                                        ))}
                                                                  </ul>
                                                            )}
                                                      </li>
                                                ))}
                                          </ul>
                                    </nav>

                                    <div className='bg-blue-50 rounded-2xl p-4 border border-blue-100'>
                                          <p className='font-semibold text-gray-800 text-sm mb-1'>Bạn cần hỗ trợ?</p>
                                          <p className='text-xs text-gray-500 mb-3 leading-relaxed'>
                                                Đội ngũ Tiki luôn sẵn sàng giúp bạn 24/7
                                          </p>
                                          <button className='flex items-center gap-1 bg-white border border-blue-200 text-blue-600 text-xs font-medium px-3 py-2 rounded-lg hover:bg-blue-100'>
                                                Liên hệ ngay <ChevronRight size={14} />
                                          </button>
                                          <div className='flex justify-end -mt-8'>
                                                <Headphones size={40} className='text-blue-300' />
                                          </div>
                                    </div>
                              </aside>

                              {/* Nội dung chính */}
                              <main>
                                    <div className='mb-5'>
                                          <h1 className='text-2xl font-bold text-gray-800'>Thông tin tài khoản</h1>
                                          <p className='text-sm text-gray-500 mt-1'>Quản lý và bảo mật thông tin tài khoản của bạn</p>
                                    </div>

                                    <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-6'>
                                          <div className='flex items-center gap-2 mb-6'>
                                                <span className='bg-blue-50 text-blue-500 p-2 rounded-full'>
                                                      <User size={18} />
                                                </span>
                                                <h2 className='font-semibold text-gray-800 text-lg'>Thông tin cá nhân</h2>
                                          </div>

                                          <div className='grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 mb-6'>
                                                <div className='relative w-28 h-28 mx-auto md:mx-0'>
                                                      <div className='w-28 h-28 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl'>
                                                            TIKI
                                                      </div>
                                                      <button className='absolute bottom-0 right-0 bg-white border border-gray-200 rounded-full p-1.5 shadow-sm hover:bg-gray-50'>
                                                            <Camera size={16} className='text-gray-600' />
                                                      </button>
                                                </div>

                                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full'>
                                                      <div>
                                                            <label className='block text-sm text-gray-600 mb-1.5'>Họ và tên</label>
                                                            <input
                                                                  type='text'
                                                                  value={fullName}
                                                                  onChange={(e) => setFullName(e.target.value)}
                                                                  className='w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400'
                                                            />
                                                      </div>
                                                      <div>
                                                            <label className='block text-sm text-gray-600 mb-1.5'>NickName</label>
                                                            <input
                                                                  type='text'
                                                                  value={nickName}
                                                                  onChange={(e) => setNickName(e.target.value)}
                                                                  className='w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400'
                                                            />
                                                      </div>
                                                </div>
                                          </div>

                                          <div className='mb-6'>
                                                <label className='block text-sm text-gray-600 mb-1.5'>Ngày sinh</label>
                                                <div className='grid grid-cols-3 gap-4'>
                                                      <select
                                                            value={day}
                                                            onChange={(e) => setDay(e.target.value)}
                                                            className='border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100'
                                                      >
                                                            {days.map((d) => (
                                                                  <option key={d} value={d}>
                                                                        {d}
                                                                  </option>
                                                            ))}
                                                      </select>
                                                      <select
                                                            value={month}
                                                            onChange={(e) => setMonth(e.target.value)}
                                                            className='border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100'
                                                      >
                                                            {months.map((m) => (
                                                                  <option key={m} value={m}>
                                                                        {m}
                                                                  </option>
                                                            ))}
                                                      </select>
                                                      <select
                                                            value={year}
                                                            onChange={(e) => setYear(e.target.value)}
                                                            className='border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100'
                                                      >
                                                            {years.map((y) => (
                                                                  <option key={y} value={y}>
                                                                        {y}
                                                                  </option>
                                                            ))}
                                                      </select>
                                                </div>
                                          </div>

                                          <div className='mb-8'>
                                                <label className='block text-sm text-gray-600 mb-2'>Giới tính</label>
                                                <div className='grid grid-cols-3 gap-4'>
                                                      {(
                                                            [
                                                                  { key: 'male', label: 'Nam' },
                                                                  { key: 'female', label: 'Nữ' },
                                                                  { key: 'other', label: 'Khác' },
                                                            ] as const
                                                      ).map((g) => (
                                                            <button
                                                                  key={g.key}
                                                                  onClick={() => setGender(g.key)}
                                                                  className={`flex items-center justify-center gap-2 border rounded-xl py-3 text-sm font-medium transition-colors ${
                                                                        gender === g.key
                                                                              ? 'border-blue-500 bg-blue-50 text-blue-600'
                                                                              : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                                                  }`}
                                                            >
                                                                  <span
                                                                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                                                              gender === g.key ? 'border-blue-500' : 'border-gray-300'
                                                                        }`}
                                                                  >
                                                                        {gender === g.key && (
                                                                              <span className='w-2 h-2 rounded-full bg-blue-500' />
                                                                        )}
                                                                  </span>
                                                                  {g.label}
                                                            </button>
                                                      ))}
                                                </div>
                                          </div>

                                          <button
                                                onClick={handleSave}
                                                className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-3 rounded-xl transition-colors'
                                          >
                                                <Save size={18} />
                                                Lưu thay đổi
                                          </button>
                                    </div>
                              </main>

                              {/* Sidebar phải */}
                              <aside className='space-y-5'>
                                    <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-5'>
                                          <div className='flex items-center gap-2 mb-4'>
                                                <span className='bg-blue-50 text-blue-500 p-2 rounded-full'>
                                                      <Mail size={16} />
                                                </span>
                                                <h3 className='font-semibold text-gray-800 text-sm'>Email &amp; liên hệ</h3>
                                          </div>
                                          <p className='text-xs text-gray-400 mb-1'>Địa chỉ email</p>
                                          <p className='text-sm font-medium text-gray-800 mb-4'>newaccount304@gmail.com</p>
                                          <button className='w-full flex items-center justify-center gap-2 border border-blue-200 text-blue-600 text-sm font-medium py-2 rounded-xl hover:bg-blue-50'>
                                                <Pencil size={14} />
                                                Cập nhật
                                          </button>
                                    </div>

                                    <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-5'>
                                          <div className='flex items-center gap-2 mb-4'>
                                                <span className='bg-green-50 text-green-500 p-2 rounded-full'>
                                                      <Lock size={16} />
                                                </span>
                                                <h3 className='font-semibold text-gray-800 text-sm'>Bảo mật</h3>
                                          </div>
                                          <p className='text-xs text-gray-400 mb-1'>Mật khẩu</p>
                                          <p className='text-sm font-medium text-gray-800 mb-4'>••••••••••••</p>
                                          <button className='w-full flex items-center justify-center gap-2 border border-blue-200 text-blue-600 text-sm font-medium py-2 rounded-xl hover:bg-blue-50'>
                                                <KeyRound size={14} />
                                                Đổi mật khẩu
                                          </button>
                                    </div>

                                    <div className='bg-blue-50 rounded-2xl p-5 border border-blue-100 relative overflow-hidden'>
                                          <h3 className='font-semibold text-gray-800 text-sm mb-2'>Bảo vệ tài khoản của bạn</h3>
                                          <p className='text-xs text-gray-500 mb-4 leading-relaxed pr-10'>
                                                Kích hoạt xác thực 2 lớp để tăng cường bảo mật cho tài khoản.
                                          </p>
                                          <button className='flex items-center gap-1 bg-white text-blue-600 text-xs font-medium px-3 py-2 rounded-lg border border-blue-200 hover:bg-blue-100'>
                                                Kích hoạt ngay <ChevronRight size={14} />
                                          </button>
                                          <ShieldCheck size={70} className='text-blue-200 absolute -bottom-3 -right-3' />
                                    </div>
                              </aside>
                        </div>

                        {/* Footer */}
                        <footer className='border-t border-gray-200 bg-white mt-6'>
                              <div className='max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2'>
                                    <span>© 2024 Tiki.vn - Bảo lưu mọi quyền</span>
                                    <div className='flex items-center gap-4'>
                                          <a href='#' className='hover:text-blue-600'>
                                                Chính sách bảo mật
                                          </a>
                                          <a href='#' className='hover:text-blue-600'>
                                                Quy chế hoạt động
                                          </a>
                                          <a href='#' className='hover:text-blue-600'>
                                                Điều khoản sử dụng
                                          </a>
                                    </div>
                              </div>
                        </footer>
                  </div>
            </div>
      )
}

export default AccountInfoPage
