import React, { SetStateAction, useState } from 'react'
import AuthLogin from './AuthLogin'
import AuthRegister from './AuthRegister'
import { useDispatch } from 'react-redux'
import { doCloseBoxLogin } from '../../Redux/authSlice'
import background from './bg.png'
import { X } from 'lucide-react'

export type TModeAuth = 'Login' | 'Register'

type TProps = {
      setShowBoxAuth: React.Dispatch<SetStateAction<boolean>>
}

const AuthWrapper = (props: TProps) => {
      const { setShowBoxAuth } = props
      const [modeAuth, setModeAuth] = useState<TModeAuth>('Login')
      const dispatch = useDispatch()

      const handleHideBoxAuth = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            dispatch(doCloseBoxLogin())
            setShowBoxAuth(false)
      }

      return (
            <div
                  className='fixed inset-0 z-[999] flex min-h-screen items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-[3px]'
                  onClick={() => {
                        dispatch(doCloseBoxLogin())
                        setShowBoxAuth(false)
                  }}
            >
                  <div
                        className='animate-authBox relative grid w-full max-w-[980px] overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-[0_30px_100px_rgba(0,0,0,0.35)] lg:grid-cols-[430px_minmax(0,1fr)] dark:border-slate-700/70 dark:bg-[#0f131a]'
                        onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => e.stopPropagation()}
                  >
                        <button
                              type='button'
                              className='absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-black/25 text-white backdrop-blur-md transition hover:bg-black/40'
                              onClick={handleHideBoxAuth}
                              aria-label='Đóng'
                        >
                              <X size={19} />
                        </button>

                        <div className='relative z-10 flex min-h-[560px] items-center bg-white dark:bg-[#0f131a]'>
                              {modeAuth === 'Login' ? <AuthLogin setModeAuth={setModeAuth} /> : <AuthRegister setModeAuth={setModeAuth} />}
                        </div>

                        <div className='relative hidden min-h-[560px] overflow-hidden lg:block'>
                              <img src={background} className='absolute inset-0 h-full w-full object-cover' alt='product' />

                              <div className='absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10' />

                              <div className='absolute bottom-5 left-5 rounded-full border border-white/30 bg-black/25 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md'>
                                    Ưu đãi dành cho bạn
                              </div>
                        </div>
                  </div>
            </div>
      )
}

export default AuthWrapper
