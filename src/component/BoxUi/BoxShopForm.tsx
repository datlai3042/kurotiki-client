import { Camera, Plus, X } from 'lucide-react'
import React, { SetStateAction, useEffect, useRef, useState } from 'react'
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import ShopApi, { RegisterShop, StateFile } from '../../apis/shop.api'
import { useDispatch } from 'react-redux'
import { addToast } from '../../Redux/toast'
import BoxLoading from './BoxLoading'
import { fetchUser } from '../../Redux/authenticationSlice'
import TextArea from 'antd/es/input/TextArea'
import Portal from '../Portal'

type TForm = {
      shop_name: string
      shop_description: string
}

/*
      mode upload [] -> defaultValues, preview 
*/

export type ModeForm = 'UPLOAD' | 'UPDATE'

type TProps = {
      onClose: React.Dispatch<SetStateAction<boolean>>
      modeForm: ModeForm
      defaultValues: { shop_name: string; shop_avatar: string; shop_description: string }
}

const BoxShopForm = (props: TProps) => {
      const { onClose, modeForm, defaultValues } = props

      const inputAvatar = useRef<HTMLInputElement | null>(null)
      const [preview, setPreview] = useState<string>(defaultValues.shop_avatar)
      const [imageAvatar, setImageAvatar] = useState<File>()

      const queryClieny = useQueryClient()
      const dispatch = useDispatch()

      const form = useForm<TForm>({
            defaultValues: { shop_name: defaultValues.shop_name, shop_description: defaultValues.shop_description },
      })

      const onClickAvatar = () => {
            if (inputAvatar) {
                  inputAvatar.current?.click()
            }
      }

      const onChangeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
            // if(!)
            const url = URL.createObjectURL(e?.target?.files![0])
            setPreview(url)
            setImageAvatar(e?.target.files![0])
      }

      const onResetAvatar = () => {
            URL.revokeObjectURL(preview)
            setPreview('')
            if (inputAvatar) {
                  inputAvatar.current?.click()
            }
      }

      const registerShopMutation = useMutation({
            mutationKey: ['register-shop'],
            mutationFn: ({ data, state }: { data: RegisterShop; state: StateFile; mode: ModeForm }) =>
                  ShopApi.registerShop(data, state, modeForm),
            onSuccess: (axiosResponse) => {
                  const { user } = axiosResponse.data.metadata

                  queryClieny.invalidateQueries({
                        queryKey: ['get-my-shop'],
                  })
                  dispatch(addToast({ id: Math.random().toString(), type: 'SUCCESS', message: 'Cập nhập thành công' }))
                  dispatch(fetchUser({ user }))
                  onClose(false)
            },
      })

      const onSubmit: SubmitHandler<TForm> = (dataForm) => {
            // console.log({ form: dataForm })
            if (!preview && modeForm === 'UPLOAD') {
                  dispatch(addToast({ id: Math.random().toString(), type: 'WARNNING', message: 'Vui lòng upload hình đại diện' }))
                  return
            }
            const formData: RegisterShop = new FormData()
            formData.append('file', imageAvatar as File)
            formData.append('shop_name', dataForm.shop_name)
            formData.append('shop_description', dataForm.shop_description)
            registerShopMutation.mutate({ data: formData, state: imageAvatar ? 'Full' : 'no-file', mode: modeForm })
      }

      useEffect(() => {
            return () => {
                  URL.revokeObjectURL(preview)
            }
      }, [preview])

      return (
            <Portal>
                  <div className='fixed inset-0 z-[998] flex min-h-screen items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-[2px]'>
                        <div className='animate-authBox w-full max-w-[760px]'>
                              <FormProvider {...form}>
                                    <div className='relative overflow-hidden rounded-2xl border border-blue-500/20 bg-[#0b111b] text-text-theme shadow-[0_30px_90px_rgba(0,0,0,0.55)]'>
                                          {/* Header */}
                                          <div className='flex items-center justify-between border-b border-slate-800 bg-gradient-to-r from-[#0d1b32] via-[#0b1628] to-[#0b111b] px-5 py-4 xl:px-6'>
                                                <div>
                                                      <h2 className='text-lg font-semibold text-white'>
                                                            {modeForm === 'UPDATE'
                                                                  ? 'Chỉnh sửa thông tin cửa hàng'
                                                                  : 'Đăng kí thông tin cửa hàng'}
                                                      </h2>

                                                      <p className='mt-1 text-xs text-slate-400'>
                                                            Cập nhật hình đại diện, tên và mô tả cửa hàng của bạn.
                                                      </p>
                                                </div>

                                                <button
                                                      type='button'
                                                      onClick={() => onClose(false)}
                                                      className='flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/60 text-slate-400 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white'
                                                      aria-label='Đóng'
                                                >
                                                      <X size={18} />
                                                </button>
                                          </div>

                                          <form
                                                spellCheck={false}
                                                onSubmit={form.handleSubmit(onSubmit)}
                                                className='grid max-h-[82vh] grid-cols-1 overflow-y-auto xl:grid-cols-[250px_minmax(0,1fr)]'
                                          >
                                                {/* Avatar */}
                                                <div className='border-b border-slate-800 bg-[#0d131d] px-5 py-6 xl:border-b-0 xl:border-r xl:px-6 xl:py-7'>
                                                      <div className='flex h-full flex-col items-center'>
                                                            <p className='mb-4 self-start text-sm font-medium text-slate-300'>
                                                                  Ảnh đại diện
                                                            </p>

                                                            <button
                                                                  type='button'
                                                                  onClick={onClickAvatar}
                                                                  className='group relative flex h-[148px] w-[148px] items-center justify-center overflow-hidden rounded-full border-4 border-blue-600 bg-slate-900 shadow-[0_16px_35px_rgba(37,99,235,0.18)]'
                                                            >
                                                                  {preview ? (
                                                                        <>
                                                                              <img
                                                                                    src={preview}
                                                                                    className='h-full w-full object-cover'
                                                                                    alt='avatar'
                                                                              />

                                                                              <div className='absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/35'>
                                                                                    <Camera
                                                                                          size={26}
                                                                                          className='scale-90 text-white opacity-0 transition group-hover:scale-100 group-hover:opacity-100'
                                                                                    />
                                                                              </div>
                                                                        </>
                                                                  ) : (
                                                                        <div className='flex flex-col items-center gap-2 text-blue-500'>
                                                                              <Camera size={32} />
                                                                              <span className='text-xs'>Chọn ảnh</span>
                                                                        </div>
                                                                  )}
                                                            </button>

                                                            <p className='mt-4 text-center text-xs leading-5 text-slate-500'>
                                                                  Nên dùng ảnh vuông, rõ nét.
                                                                  <br />
                                                                  JPG, PNG hoặc WEBP.
                                                            </p>

                                                            {preview && (
                                                                  <button
                                                                        type='button'
                                                                        className='mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-blue-500/40 bg-blue-500/10 px-4 text-sm font-medium text-blue-400 transition hover:bg-blue-500/20'
                                                                        onClick={onResetAvatar}
                                                                  >
                                                                        <Camera size={16} />
                                                                        Chọn lại ảnh
                                                                  </button>
                                                            )}

                                                            <input
                                                                  type='file'
                                                                  className='hidden'
                                                                  id='avatar_shop'
                                                                  onChange={(e) => {
                                                                        onChangeAvatar(e)
                                                                  }}
                                                                  ref={(e) => {
                                                                        inputAvatar.current = e
                                                                  }}
                                                            />
                                                      </div>
                                                </div>

                                                {/* Form fields */}
                                                <div className='flex flex-col gap-5 px-5 py-6 xl:px-7 xl:py-7'>
                                                      <div className='flex flex-col gap-2'>
                                                            <label
                                                                  htmlFor='shop_name'
                                                                  className='text-sm font-medium text-slate-300'
                                                            >
                                                                  Tên Shop
                                                            </label>

                                                            <input
                                                                  type='text'
                                                                  placeholder='Nhập tên shop'
                                                                  id='shop_name'
                                                                  className='h-11 w-full rounded-xl border border-slate-700 bg-[#10151d] px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10'
                                                                  {...form.register('shop_name', {
                                                                        required: {
                                                                              value: true,
                                                                              message: 'Tên shop là bắt buộc',
                                                                        },
                                                                        minLength: {
                                                                              value: 3,
                                                                              message: 'Tối thiểu 3 kí tự',
                                                                        },
                                                                        maxLength: {
                                                                              value: 150,
                                                                              message: 'Tối thiểu 150 kí tự',
                                                                        },
                                                                  })}
                                                            />

                                                            {form.formState.errors.shop_name?.message && (
                                                                  <span className='text-xs text-red-400'>
                                                                        {form.formState.errors.shop_name.message}
                                                                  </span>
                                                            )}
                                                      </div>

                                                      <div className='flex flex-1 flex-col gap-2'>
                                                            <label
                                                                  htmlFor='shop_description'
                                                                  className='text-sm font-medium text-slate-300'
                                                            >
                                                                  Mô tả cửa hàng
                                                            </label>

                                                            <Controller
                                                                  control={form.control}
                                                                  name='shop_description'
                                                                  render={({ field }) => (
                                                                        <TextArea
                                                                              id='shop_description'
                                                                              rows={9}
                                                                              {...field}
                                                                              placeholder='Nhập mô tả của shop'
                                                                              className='shop-description-textarea'
                                                                              style={{
                                                                                    backgroundColor: '#10151d',
                                                                                    border: '1px solid #334155',
                                                                                    color: '#fff',
                                                                                    borderRadius: '12px',
                                                                                    padding: '12px 14px',
                                                                                    resize: 'vertical',
                                                                              }}
                                                                        />
                                                                  )}
                                                            />

                                                            <p className='text-xs leading-5 text-slate-500'>
                                                                  Mô tả ngắn gọn về cửa hàng, sản phẩm và phong cách phục vụ.
                                                            </p>
                                                      </div>

                                                      {/* Footer actions */}
                                                      <div className='mt-1 flex flex-col-reverse gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:justify-end'>
                                                            <button
                                                                  type='button'
                                                                  onClick={() => onClose(false)}
                                                                  className='h-10 rounded-xl border border-slate-700 px-5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white'
                                                            >
                                                                  Hủy
                                                            </button>

                                                            <button className='inline-flex h-10 min-w-[120px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-medium text-white shadow-[0_8px_20px_rgba(37,99,235,0.20)] transition hover:bg-blue-500'>
                                                                  {modeForm === 'UPDATE' ? 'Cập nhập' : 'Đăng kí'}
                                                                  {registerShopMutation.isPending && <BoxLoading />}
                                                            </button>
                                                      </div>
                                                </div>
                                          </form>
                                    </div>
                              </FormProvider>
                        </div>
                  </div>
            </Portal>
      )
}

export default BoxShopForm