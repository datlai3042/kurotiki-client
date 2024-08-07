import { useState } from 'react'
import Portal from '../Portal'
import AuthWrapper from './AuthWrapper'

const AuthPermission = () => {
      const [showBoxAuth, setShowBoxAuth] = useState(false)

      const handleAuth = () => {
            setShowBoxAuth(true)
      }

      return (
            <div className='bg-white w-full min-h-[34rem]   flex flex-col sm:flex-row justify-center items-center text-[42px] font-bold gap-[20px]'>
                  <span className='text-center'>Chức năng cần đăng nhập</span>
                  <button
                        className='text-[14px] font-normal w-[150px] h-[45px] hover:bg-blue-400 hover:text-white border-[1px] bg-white border-blue-400 text-blue-400 rounded-md'
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
