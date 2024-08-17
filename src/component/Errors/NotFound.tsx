import React from 'react'
import { useRef } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

type TProps = {
      ContentHeader?: string
      ContentDescription?: string
      countTime?: boolean
      onBack?: () => void
}

const NotFound = (props: TProps) => {
      const { ContentHeader, ContentDescription, countTime = true, onBack } = props

      const [count, setCount] = useState(5)
      const navigate = useNavigate()

      let xoaInter = useRef<NodeJS.Timeout>()
      let xoaTimout = useRef<NodeJS.Timeout>()
      useEffect(() => {
            if (!countTime) return

            if (count > 0) {
                  xoaInter.current = setInterval(() => {
                        setCount((prev) => prev - 1)
                  }, 1000)
                  xoaTimout.current = setTimeout(() => {
                        navigate(-1)
                  }, 5000)
            }
            return () => {
                  clearInterval(xoaInter.current)
            }
      }, [])

      useEffect(() => {
            xoaTimout.current = setTimeout(() => {
                  navigate(-1)
            }, 5000)
            return () => {
                  clearTimeout(xoaTimout.current)
            }

      }, [])

      return (
            <div
                  style={{
                        // marginTop: 20,
                        height: 'calc(100vh-50px)',
                        width: '100%',
                        minWidth: '100%',
                  }}
            >
                  <main className='grid min-h-full w-full place-items-center bg-white  py-24 sm:py-32 '>
                        <div className='text-center'>
                              <p className='text-base font-semibold text-indigo-600'>404</p>
                              <h1 className='mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl'>
                                    {ContentHeader || 'Không tìm thấy trang'}
                              </h1>
                              <p className='mt-6 text-base leading-7 text-gray-600'>
                                    {ContentDescription || 'Trang này chưa được xây dựng'}
                              </p>
                              <div className='mt-10 flex items-center justify-center gap-x-6'>
                                    <Link
                                          to='/Contact'
                                          className='rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                                    >
                                          Gửi hỗ trợ
                                    </Link>
                                    {!onBack ? (
                                          <Link to='/' className='text-sm font-semibold text-gray-900'>
                                                Quay về sau {countTime ? count : ''}
                                          </Link>
                                    ) : (
                                          <button className='text-sm font-semibold text-gray-900' onClick={onBack}>
                                                Đóng thông báo
                                          </button>
                                    )}
                              </div>
                        </div>
                  </main>
            </div>
      )
}

export default NotFound
