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
                  <div className='fixed inset-0 bg-[rgba(0,0,0,.4)] h-screen flex items-center justify-center z-[998]'>
                        <div className='animate-authBox  h-max  mx-[10px] xl:mx-0   '>
                              <FormProvider {...form}>
                                    <div className='relative   pr-[10px'>
                                          <form
                                                spellCheck={false}
                                                className='px-[20px] flex flex-row flex-wrap w-[600px] overflow-y-auto  max-w-[90vw] max-h-[80vh]  bg-color-section-theme rounded-lg text-text-theme gap-[20px]'
                                                onSubmit={form.handleSubmit(onSubmit)}
                                          >
                                                <div className='w-full xl:w-[40%] h-full bg-color-section-theme pb-[16px] xl:pb-0 cursor-pointer'>
                                                      <div className='flex flex-col items-center mt-[30px]'>
                                                            <div
                                                                  className='relative w-[150px] h-[150px] flex flex-col items-center justify-center bg-color-section-theme rounded-full border-[6px] border-color-main'
                                                                  onClick={onClickAvatar}
                                                            >
                                                                  {preview && (
                                                                        <img
                                                                              src={preview}
                                                                              className='w-full h-full rounded-full'
                                                                              alt='avatar'
                                                                        />
                                                                  )}

                                                                  {!preview && <Camera size={30} className='text-color-main' />}
                                                            </div>

                                                            {preview && (
                                                                  <button
                                                                        className='mt-[20px] p-[12px_14px] rounded-[4px]  bg-color-main opacity-80 hover:opacity-100 text-[#fff] hover:cursor-pointer transition-all duration-300'
                                                                        onClick={onResetAvatar}
                                                                  >
                                                                        Chọn lại
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
                                                <div className='w-full xl:w-[60%] flex-1 h-full py-[16px]   flex flex-col items-center gap-[20px] bg-color-section-theme'>
                                                      <header>Đăng kí thông tin về cửa hàng</header>
                                                      <div className='flex flex-col gap-[8px] w-[100%]'>
                                                            <label htmlFor='shop_name'>Tên Shop</label>
                                                            <input
                                                                  type='text'
                                                                  placeholder='Nhập tên shop'
                                                                  id='shop_name'
                                                                  className='w-full h-[40px] p-[12px_24px] bg-color-section-theme rounded outline-none border-[1px] border-[var(--border-color-input)]'
                                                                  {...form.register('shop_name', {
                                                                        required: { value: true, message: 'Tên shop là bắt buộc' },
                                                                        minLength: { value: 3, message: 'Tối thiểu 3 kí tự' },
                                                                        maxLength: { value: 150, message: 'Tối thiểu 150 kí tự' },
                                                                  })}
                                                            />
                                                            <Controller
                                                                  control={form.control}
                                                                  name='shop_description'
                                                                  render={({ field }) => (
                                                                        <TextArea
                                                                              rows={10}
                                                                              {...field}
                                                                              placeholder='Nhập mô tả của shop'
                                                                              style={{
                                                                                    backgroundColor: 'var(--color-section-theme)',
                                                                                    border: '1px solid var(--border-color-input)',
                                                                                    color: 'var(--text-theme)',
                                                                              }}
                                                                        ></TextArea>
                                                                  )}
                                                            />
                                                      </div>
                                                      <button className='ml-auto w-max flex items-center gap-[16px] p-[12px_14px]  bg-color-main opacity-80 hover:opacity-100 text-[#fff] rounded-md  hover:cursor-pointer transition-all duration-300'>
                                                            {modeForm === 'UPDATE' ? 'Cập nhập' : 'Đăng kí'}
                                                            {registerShopMutation.isPending && <BoxLoading />}
                                                      </button>
                                                </div>
                                          </form>

                                          <button
                                                className='absolute top-[-10%] text-[#fff] right-[0px] w-[50px] py-[5px] rounded-[4px]  bg-color-main hover:border-transparent hover:text-white min-w-[100px] flex justify-center items-center'
                                                onClick={() => onClose(false)}
                                          >
                                                Đóng
                                          </button>
                                    </div>
                              </FormProvider>
                        </div>
                  </div>
            </Portal>
      )
}

export default BoxShopForm
