import React, { useCallback, useEffect, useRef, useState } from 'react'
import HeaderResultSearch from './HeaderResultSearch'
import { Search } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { onShowOverload } from '../../../Redux/uiSlice'
import { RootState } from '../../../store'
import { useLocation } from 'react-router-dom'

const HeaderSeacrhInput = () => {
      const [showSearch, setShowSearch] = useState(false)
      const [textDelay, setTextDelay] = useState<string>('')
      const [text, setText] = useState<string>('')

      const divRef = useRef<HTMLDivElement>(null)
      const inputRef = useRef<HTMLInputElement | null>(null)
      const timer = useRef<NodeJS.Timeout>()

      const location = useLocation()

      const dispatch = useDispatch()
      const showOverload = useSelector((state: RootState) => state.uiSlice.showOverload)

      const onChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = event.target
            setText(value)
      }

      const onReset = useCallback(() => {
            setText('')
            setShowSearch(false)
            dispatch(onShowOverload({ overload: false }))
      }, [])

      useEffect(() => {
            if (location.pathname !== '/') {
                  dispatch(onShowOverload({ overload: false }))
                  setText('')
                  setShowSearch(false)
            }
      }, [location, dispatch])

      const controllShowResultSearch = useCallback((e: MouseEvent) => {
            if (divRef.current && !divRef.current.contains(e.target as Node)) {
                  setShowSearch(false)
                  dispatch(onShowOverload({ overload: false }))
            }
      }, [])

      useEffect(() => {
            if (!showSearch) {
                  document.removeEventListener('click', controllShowResultSearch)
            }
            if (showSearch) {
                  document.addEventListener('click', controllShowResultSearch)
            }
            return () => {
                  document.removeEventListener('click', controllShowResultSearch)
            }
      }, [controllShowResultSearch, showSearch])

      useEffect(() => {
            timer.current = setTimeout(() => {
                  setTextDelay(text)
            }, 1000)

            return () => clearTimeout(timer.current)
      }, [text])

      useEffect(() => {
            if (showOverload) {
                  document.body.style.overflow = 'hidden'
            } else {
                  document.body.style.overflow = 'unset'
            }
      }, [showOverload])

      return (
            <div className='flex h-full border border-gray-300 rounded-lg' ref={divRef}>
                  <div className='relative grow  h-full pl-4'>
                        <form className='h-full  flex gap-4' spellCheck={false}>
                              <div className='basis-[3%]   flex items-center'>
                                    <Search />
                              </div>
                              <div className='grow ' onClick={() => setShowSearch((prev) => !prev)}>
                                    <input
                                          ref={inputRef}
                                          type='text'
                                          value={text}
                                          className='w-full h-full outline-none border-none'
                                          placeholder='Bạn tìm gì hôm nay'
                                          onChange={onChangeSearch}
                                          onClick={() => {
                                                if (showSearch) {
                                                      dispatch(onShowOverload({ overload: false }))
                                                      return
                                                }
                                                dispatch(onShowOverload({ overload: true }))
                                          }}
                                          onBlur={() => {}}
                                    />
                              </div>
                              <div className='hidden xl:flex group basis-[25%]  lg:basis-[28%] 2xl:basis-[11%]   items-center transition-all duration-200 before:content-["|"] before:text-gray-300 before:text-2xl: opacity-80 hover:before:opacity-0 hover:bg-sky-700 '>
                                    <button
                                          type='submit'
                                          className=' text-sm w-full h-full text-center text-sky-800 group-hover:text-sky-100'
                                          disabled
                                    >
                                          Tìm kiếm
                                    </button>
                              </div>
                        </form>
                        {showSearch && <HeaderResultSearch text={textDelay} onReset={onReset} />}
                  </div>
            </div>
      )
}

export default HeaderSeacrhInput
