import React, { SetStateAction, useEffect, useState } from 'react'
import { TModeAuth } from './AuthWrapper'
import { Eye, EyeOff, LockKeyhole, MailCheck, ShieldX } from 'lucide-react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import Auth from '../../apis/auth.api'
import { useDispatch } from 'react-redux'
import { doCloseBoxLogin, fetchUser } from '../../Redux/authenticationSlice'
import { addToast } from '../../Redux/toast'
import { checkAxiosError } from '../../utils/handleAxiosError'
import Input from '../input/Input'
import BoxLoading from '../BoxUi/BoxLoading'
type TProps = {
      setModeAuth: React.Dispatch<SetStateAction<TModeAuth>>
}

const registerSchema = z
      .object({
            email: z
                  .string()
                  .min(1, { message: 'Email là bắt buộc' })
                  .email({ message: 'Email không hợp lệ' })
                  .max(50, { message: 'Giới hạn 50 kí tự' }),
            password: z.string().min(1, { message: 'Mật khẩu là bắt buộc' }).max(50, { message: 'Tối đa 50 kí tự' }),
            confirm_password: z.string().min(1, { message: 'Xác thực mật khẩu là bắt buộc' }).max(50, { message: 'Tối đa 50 kí tự' }),
      })
      .refine((form) => form.password === form.confirm_password, {
            message: 'Mật khẩu không khớp',
            path: ['confirm_password'],
      })

type TRegisterZodSchema = z.infer<typeof registerSchema>
const defaultValues: TRegisterZodSchema = {
      email: '',
      password: '',
      confirm_password: '',
}

const AuthRegister = (props: TProps) => {
      //Mode auth => Login | register
      const { setModeAuth } = props
      const dispatch = useDispatch()

      //react hooks form
      const {
            handleSubmit,
            register,
            formState: { errors },
            watch,
      } = useForm<TRegisterZodSchema>({
            defaultValues,
            resolver: zodResolver(registerSchema),
      })

      const authRegister = useMutation({
            mutationKey: ['register'],
            mutationFn: (data: Omit<TRegisterZodSchema, 'confirm_password'>) => Auth.register(data),
            onSuccess: (res) => {
                  dispatch(fetchUser({ user: res.data.metadata.user }))
                  dispatch(addToast({ type: 'SUCCESS', message: 'Welcome các bạn đến với project của mình', id: Math.random().toString() }))
                  dispatch(doCloseBoxLogin())
            },

            onError: (error: unknown) => {
                  if (checkAxiosError<{ code: number; detail: string; message: string }>(error)) {
                        if (
                              error.response?.data.code === 400 &&
                              error.response.data.detail === 'Email đã được đăng kí' &&
                              error.response.data.message === 'Bad Request'
                        ) {
                              dispatch(addToast({ id: Math.random().toString(), type: 'ERROR', message: error.response.data.detail }))
                        }
                  }
            },
      })

    

      const onSubmit = (data: TRegisterZodSchema) => {
            authRegister.mutate(data)
      }

      // useEffect(() => {
      //       if (Object.keys(errors).length > 0) {
      //             const subMessage: string[] = []
      //             Object.keys(errors).map((key) => {
      //                   subMessage.push(`Field ${key} đã xảy ra lỗi, vui lòng ${errors[key as keyof TRegisterZodSchema]?.message}`)
      //             })

      //             dispatch(addToast({ id: Math.random().toString(), subMessage, message: 'Error', type: 'WARNNING' }))
      //       }
      // }, [errors, dispatch])

      return (
            <div className=' flex flex-col rounded-md items-center gap-[24px] px-[24px] py-[48px] min-w-[550px] bg-[#fff] text-[#000]'>
                  <div className='mb- w-full flex gap-[4px]  gradient-app-name text-left'>
                        <h1 className='text-4xl font-black  mb-1'>@Hi, Welcome...</h1>
                  </div>
                  <form className='flex flex-1 flex-col gap-[26px] mt-[12px] w-full' noValidate onSubmit={handleSubmit(onSubmit)}>
                        <Input<TRegisterZodSchema>
                              FieldKey='email'
                              placeholder='email'
                              type='email'
                              register={register}
                              watch={watch}
                              error={errors}
                              icon={<MailCheck />}
                        />
                        <Input<TRegisterZodSchema>
                              FieldKey='password'
                              placeholder='mật khẩu'
                              type='password'
                              register={register}
                              watch={watch}
                              error={errors}
                              icon={<LockKeyhole />}

                              // formState={registerForm.formState}
                        />
                        <Input<TRegisterZodSchema>
                              FieldKey='confirm_password'
                              placeholder='xác nhận mật khẩu'
                              type='password'
                              register={register}
                              watch={watch}
                              error={errors}
                              icon={<LockKeyhole />}
                        />

                        <div className=' mt-[8px] flex flex-col gap-[13px]'>
                              <div className=' flex gap-[10px]'>
                                    <button
                                          type='submit'
                                          disabled={authRegister.isPending}
                                          className='!w-[150px] font-semibold text-[15px] flex items-center justify-center text-[#fff] gap-[6px] !h-[46px] !bg-[var(--color-main)] !rounded-[999px]'
                                    >
                                          Đăng kí
                                          {authRegister.isPending && <BoxLoading />}
                                    </button>

                                    <button
                                          onClick={() => setModeAuth('Login')}
                                          className='!bg-background-page-color hover:!bg-[#36a420] border-[1px] !text-[#333] hover:!text-[#fff] hover:border-border-page-color font-semibold text-[15px] !h-[46px]  !rounded-[999px] !w-[150px] '
                                    >
                                          Đăng nhập
                                    </button>
                              </div>
                        </div>
                        
                  </form>
            </div>
      )
}

export default AuthRegister
