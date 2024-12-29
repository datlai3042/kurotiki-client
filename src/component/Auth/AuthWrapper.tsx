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
                        className='animate-authBox relative w-[420px] max-w-[420px] bg-white min-h-[400px] h-auto shadow-lg rounded-lg p-[8px]'
                        onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => e.stopPropagation()}
                  >
                        {modeAuth === ('Login' as const) ? (
                              <AuthLogin setModeAuth={setModeAuth} />
                        ) : (
                              <AuthRegister setModeAuth={setModeAuth} />
                        )}

                        <button
                              className='absolute top-[-20px] right-[-10px] w-[50px] h-[50px] border-[1px] border-slate-900 bg-white hover:bg-slate-900 hover:text-white  rounded-full flex justify-center items-center'
                              onClick={handleHideBoxAuth}
                        >
                              X
                        </button>
                  </div>
            </div>
      )
}

export default AuthWrapper
