import React, { SetStateAction, useEffect, useState } from 'react'
import { TModeAuth } from './AuthWrapper'
import { LockKeyhole, MailCheck } from 'lucide-react'
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
            confirm_password: z
                  .string()
                  .min(1, { message: 'Xác thực mật khẩu là bắt buộc' })
                  .max(50, { message: 'Tối đa 50 kí tự' }),
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
      const { setModeAuth } = props
      const dispatch = useDispatch()

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
                  dispatch(
                        addToast({
                              type: 'SUCCESS',
                              message: 'Welcome các bạn đến với project của mình',
                              id: Math.random().toString(),
                        }),
                  )
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

      return (
            <div className='flex w-full flex-col px-6 py-8 sm:px-8 lg:px-10'>
                  <div className='mb-7'>
                        <span className='inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'>
                              Bắt đầu ngay
                        </span>

                        <h1 className='mt-4 text-3xl font-semibold tracking-[-0.03em] text-slate-900 '>
                              Tạo tài khoản
                        </h1>

                        <p className='mt-2 text-sm leading-6 text-slate-500'>
                              Đăng ký nhanh để bắt đầu mua sắm và sử dụng đầy đủ tính năng.
                        </p>
                  </div>

                  <form
                        className='flex w-full flex-col gap-4'
                        noValidate
                        onSubmit={handleSubmit(onSubmit)}
                  >
                        <Input<TRegisterZodSchema>
                              FieldKey='email'
                              placeholder='Email'
                              type='email'
                              register={register}
                              watch={watch}
                              error={errors}
                              icon={<MailCheck />}
                        />

                        <Input<TRegisterZodSchema>
                              FieldKey='password'
                              placeholder='Mật khẩu'
                              type='password'
                              register={register}
                              watch={watch}
                              error={errors}
                              icon={<LockKeyhole />}
                        />

                        <Input<TRegisterZodSchema>
                              FieldKey='confirm_password'
                              placeholder='Xác nhận mật khẩu'
                              type='password'
                              register={register}
                              watch={watch}
                              error={errors}
                              icon={<LockKeyhole />}
                        />

                        <button
                              type='submit'
                              disabled={authRegister.isPending}
                              className='mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(37,99,235,0.22)] transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60'
                        >
                              Đăng kí
                              {authRegister.isPending && <BoxLoading />}
                        </button>

                        <div className='flex items-center gap-3 py-1'>
                              <div className='h-px flex-1 bg-slate-200 dark:bg-slate-700' />
                              <span className='text-xs text-slate-400'>Đã có tài khoản?</span>
                              <div className='h-px flex-1 bg-slate-200 dark:bg-slate-700' />
                        </div>

                        <button
                              type='button'
                              onClick={() => setModeAuth('Login')}
                              className='h-12 w-full rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:bg-[#121720] dark:text-slate-200'
                        >
                              Quay lại đăng nhập
                        </button>
                  </form>
            </div>
      )
}

export default AuthRegister