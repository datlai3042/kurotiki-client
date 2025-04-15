import { useState } from 'react'
import Portal from '../Portal'
import AuthWrapper from './AuthWrapper'

const AuthPermission = () => {
      const [showBoxAuth, setShowBoxAuth] = useState(false)

      const handleAuth = () => {
            setShowBoxAuth(true)
      }

      return (
            <div className='bg-color-section-theme text-text-theme w-full h-full min-h-[80%] flex flex-col justify-center items-center text-[42px] font-bold gap-[20px]'>
                  <span className=' text-center'>Chức năng cần đăng nhập</span>
                  <button
                        className='text-[14px] font-normal w-[150px] h-[45px] hover:bg-color-main hover:text-white border-[1px] bg-white border-[var(--border-color-input)] hover:border-transparent text-slate-900 rounded-md'
                        onClick={handleAuth}
                  >
                        Đăng nhập
                  </button>
                  {showBoxAuth && (
                        <Portal>
                              <AuthWrapper setShowBoxAuth={setShowBoxAuth} />
                        </Portal>
                  )}
            </div>
      )
}

export default AuthPermission
