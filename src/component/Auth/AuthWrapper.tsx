import React, { SetStateAction, useState } from 'react'
import AuthLogin from './AuthLogin'
import AuthRegister from './AuthRegister'
import { useDispatch } from 'react-redux'
import { doCloseBoxLogin } from '../../Redux/authSlice'

export type TModeAuth = 'Login' | 'Register'

type TProps = {
      setShowBoxAuth: React.Dispatch<SetStateAction<boolean>>
}

const AuthWrapper = (props: TProps) => {
      const { setShowBoxAuth } = props
      const [modeAuth, setModeAuth] = useState<TModeAuth>('Login')
      const dispatch = useDispatch()

      const handleHideBoxAuth = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            // setShowBoxAuth(false)
            // alert(123)
            dispatch(doCloseBoxLogin())
            setShowBoxAuth(false)
      }
      return (
            <div
                  className='fixed w-full min-h-screen top-0 left-0 flex justify-center items-center bg-[rgba(0,0,0,.7)] z-[999] px-[15px]'
                  onClick={() => {
                        dispatch(doCloseBoxLogin())
                        setShowBoxAuth(false)
                  }}
            >
                  <div
                        className='animate-authBox max-w-[90vw] md:max-w-max relative  bg-color-section-theme text-text-theme  h-auto shadow-lg rounded-lg p-[8px]'
                        onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => e.stopPropagation()}
                  >
                        {modeAuth === ('Login' as const) ? (
                              <AuthLogin setModeAuth={setModeAuth} />
                        ) : (
                              <AuthRegister setModeAuth={setModeAuth} />
                        )}

                        <button
                              className='absolute bottom-[102%] right-[0px] w-[50px] py-[5px] rounded-[4px]  bg-color-main hover:border-transparent text-white min-w-[100px] flex justify-center items-center'
                              onClick={handleHideBoxAuth}
                        >
                              Đóng
                        </button>
                  </div>
            </div>
      )
}

export default AuthWrapper
