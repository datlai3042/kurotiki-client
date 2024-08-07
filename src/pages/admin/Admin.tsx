import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import NotFound from '../../component/Errors/NotFound'

type TFormDefaultValue = {
      name: string
      url_thumb: string
      url_sub: string[]
      price: number
      quantity: number
}

const defaultValues: TFormDefaultValue = {
      name: '',
      price: 0,
      quantity: 0,
      url_sub: [],
      url_thumb: '',
}

const Admin = () => {
      const {
            register,
            formState: { errors },
            handleSubmit,
      } = useForm<TFormDefaultValue>({ defaultValues })
      const navigate = useNavigate()

      const [nameFile, setNameFile] = useState('')
      const [preview, setPreview] = useState<string | undefined>('')
      const [selectedFile, setSelectedFile] = useState<File>()
      const [selectedFiles, setSelectedFiles] = useState<File[]>()
      const [previewList, setPreviewList] = useState<{ preview: string }[]>()
      const [money, setMoney] = useState('')

      useEffect(() => {
            if (!selectedFile) {
                  setPreview(undefined)
                  return
            }

            const objectUrl = URL.createObjectURL(selectedFile)
            setPreview(objectUrl)

            // free memory when ever this component is unmounted
            return () => URL.revokeObjectURL(objectUrl)
      }, [selectedFile])
      if (!localStorage.getItem('token')) {
            return <NotFound />
      }
      // const token = JSON.parse(localStorage.getItem('token') || 'none')
      // const decode = jwtDecode<{ email: string; _id: string; roles: string[] }>(token)
      // if (!decode.roles.includes('admin')) {
      //     // navigate('/customer/account')
      //     return <NotFound />
      // }

      const selectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!e.target.files || e.target.files.length === 0) {
                  setSelectedFile(undefined)
                  return
            }

            // I've kept this example simple by using the first image instead of multiple
            setSelectedFile(e.target.files[0])
            setNameFile(e.target.value.split(/(\\|\/)/g).pop() as string)
      }

      const selectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!e.target.files || e.target.files.length === 0) {
                  setSelectedFile(undefined)
                  return
            }
            const fileList = Array.from(e.target.files)
            setSelectedFiles(fileList)
            const mappedFiles = fileList.map((file) => ({
                  ...file,
                  preview: URL.createObjectURL(file),
            }))
            setPreviewList(mappedFiles)
            // I've kept this example simple by using the first image instead of multiple
            setNameFile(e.target.value.split(/(\\|\/)/g).pop() as string)
      }

      return (
            <div className='flex justify-center items-center min-h-screen'>
                  <form className='w-[400px] h-auto min-h-[750px] border-[1px] border-cyan-500 rounded-lg p-[24px] flex flex-col gap-[20px]'>
                        <div className='flex flex-col gap-[8px]'>
                              <label htmlFor='product_name'>Tên sản phẩm</label>
                              <input type='text' id='product_name' />
                        </div>

                        <div className='flex flex-col gap-[8px]'>
                              <label htmlFor='product_url'>Hình ảnh chính</label>
                              <label
                                    htmlFor='product_url'
                                    className='w-[50px] h-[50px] bg-blue-500 rounded-full flex justify-center items-center text-white text-2xl'
                              >
                                    +
                              </label>

                              <input type='file' id='product_url' className='hidden' onChange={selectFile} />
                              {selectedFile && <img src={preview} className='w-[50px] h-[50px]' />}
                              {nameFile && <span>{nameFile}</span>}
                        </div>

                        <div className='flex flex-col gap-[8px]'>
                              <label htmlFor='product_url_sub'>Hình ảnh khác</label>
                              <input type='file' id='product_url_sub' multiple onChange={selectFiles} />

                              {previewList && previewList?.length > 0 && (
                                    <div className='flex gap-[15px]'>
                                          {previewList.map((i: any) => (
                                                <img
                                                      className='w-[50px] h-[50px]'
                                                      src={i.preview}
                                                      onClick={() => window.open(i.preview, '_blank', 'noreferrer')}
                                                ></img>
                                          ))}
                                    </div>
                              )}
                              <div className='flex flex-col gap-[8px] '>
                                    <label htmlFor='product_price'>Giá sản phẩm</label>
                                    <div className='relative'>
                                          <input
                                                className='w-full'
                                                type='number'
                                                id='product_price'
                                                value={money}
                                                onChange={(e) => {
                                                      setMoney(e.target.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'))
                                                }}
                                          />
                                          <div className='absolute top-[10%] px-[10px] py-[5px] right-[10px] bg-blue-700 text-white rounded-[4px]'>
                                                VND
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </form>
            </div>
      )
}

export default Admin
