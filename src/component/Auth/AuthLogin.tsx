import React, { SetStateAction, useEffect, useRef, useState } from 'react'
import { TModeAuth } from './AuthWrapper'
import { Eye, EyeOff, ShieldX } from 'lucide-react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Auth from '../../apis/auth.api'
import { useDispatch } from 'react-redux'
import { checkAxiosError } from '../../utils/handleAxiosError'
import TErrorAxios from '../../types/axios.response.error'
import { fetchUser } from '../../Redux/authenticationSlice'
import { addToast } from '../../Redux/toast'
import BoxLoading from '../BoxUi/BoxLoading'
import { doCloseBoxLogin } from '../../Redux/authSlice'

type TProps = {
      setModeAuth: React.Dispatch<SetStateAction<TModeAuth>>
}

export type TFormLogin = {
      email: string
      password: string
}

const defaultValues: TFormLogin = {
      email: '',
      password: '',
}

const loginSchema = z.object({
      email: z
            .string()
            .min(1, { message: 'Email là bắt buộc' })
            .email({ message: 'Email không hợp lệ' })
            .max(50, { message: 'Giới hạn 50 kí tự' }),
      password: z.string().min(1, { message: 'Mật khẩu là bắt buộc' }).max(50, { message: 'Tối đa 50 kí tự' }),
})

export type TloginZodSchema = z.infer<typeof loginSchema>

const AuthLogin = (props: TProps) => {
      //Mode Login | register
      const { setModeAuth } = props
      const [toast, setShowToast] = useState(false)
      const countRef = useRef(0)
      //state type password
      const [typePassword, setTypePassword] = useState<'password' | 'text'>('password')
      const queryClient = useQueryClient()
      //react-hook-form
      const {
            register,
            handleSubmit,
            formState: { errors },
      } = useForm<TloginZodSchema>({
            defaultValues,
            resolver: zodResolver(loginSchema),
      })

      useEffect(() => {}, [])
      countRef.current += 1

      const dispatch = useDispatch()

      const authLogin = useMutation({
            mutationKey: ['login'],
            mutationFn: (data: TloginZodSchema) => Auth.login(data),
            onSuccess: (res) => {
                  dispatch(doCloseBoxLogin())
                  dispatch(fetchUser({ user: res.data.metadata.user }))
                  queryClient.invalidateQueries()
            },
            onError: async (error: unknown) => {
                  //@[shape] :: error.response.data.error
                  if (checkAxiosError<TErrorAxios>(error)) {
                        if (
                              error?.response?.status === 404 &&
                              error?.response?.statusText === 'Not Found' &&
                              error?.response?.data?.detail === 'Not found Email'
                        ) {
                              dispatch(
                                    addToast({
                                          id: Math.random().toString(),
                                          message: 'Không tìm thấy thông tin đăng nhập',
                                          type: 'ERROR',
                                    }),
                              )
                        }
                  }
            },
            retry: 1,
      })

      //change type passsword
      const handleShowHidePassword = () => {
            if (typePassword === 'password') {
                  setTypePassword('text')
                  return
            } else {
                  setTypePassword('password')
            }
      }

      const onSubmit = (form: TFormLogin) => {
            authLogin.mutate(form)
      }

      useEffect(() => {
            if (Object.keys(errors).length > 0) {
                  const subMessage: string[] = []
                  Object.keys(errors).map((key) => {
                        subMessage.push(`Field ${key} đã xảy ra lỗi, vui lòng ${errors[key as keyof TFormLogin]?.message}`)
                  })

                  dispatch(addToast({ id: Math.random().toString(), subMessage, message: 'Error', type: 'WARNNING' }))
            }
      }, [errors, dispatch])

      return (
            <div className=' flex flex-col items-center gap-[15px] px-[24px] py-[35px] min-w-[360px] bg-color-section-theme text-text-theme'>
                  <h3 className={` font-black text-[24px]`}>
                        Đăng nhập vào <span className='text-color-main font-bold'>KuroTiki</span>
                  </h3>
                  <form className='flex flex-1 flex-col gap-[16px] mt-[12px] w-[85%]' noValidate onSubmit={handleSubmit(onSubmit)}>
                        <div className='w-full flex flex-col gap-[16px]'>
                              <input
                                    {...register('email')}
                                    type='text'
                                    className={`h-[36px] w-full border-[1px]  outline-none px-[12px] py-[4px] rounded-[3px]  placeholder:text-stone-500  inputCommon`}
                                    placeholder='Email'
                              />
                        </div>
                        <div className='w-full relative flex items-center'>
                              <input
                                    {...register('password')}
                                    type={typePassword}
                                    className={`h-[36px] w-full border-[1px]  outline-none px-[12px] py-[4px] rounded-[3px]  placeholder:text-stone-500 inputCommon`}
                                    placeholder='Mật khẩu'
                              />
                              <span className='absolute right-[5px]' onClick={handleShowHidePassword}>
                                    {typePassword === 'text' ? <EyeOff size={'20px'} /> : <Eye size={'20px'} />}
                              </span>
                        </div>

                        <div className='w-full flex justify-start gap-[6px]'>
                              Bạn chưa có tài khoản,{' '}
                              <span
                                    className='underline text-color-main cursor-pointer text-[15px]'
                                    onClick={() => setModeAuth('Register')}
                              >
                                    đăng kí nhé
                              </span>
                        </div>
                        <button
                              type='submit'
                              className='flex justify-center items-center gap-[8px] w-full min-h-[20px] p-[10px] rounded-[4px] bg-color-main text-white disabled:opacity-40 disabled:cursor-not-allowed'
                              disabled={authLogin.isPending && Object.keys(errors).length > 0}
                              title={Object.keys(errors).length > 0 ? 'Vui lòng nhập thông tin hợp lệ' : `Đăng nhập`}
                        >
                              <span>Đăng nhập</span>
                              {authLogin.isPending && <BoxLoading />}
                        </button>
                  </form>
            </div>
      )
}

export default AuthLogin
