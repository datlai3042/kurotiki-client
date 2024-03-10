import React, { useCallback, useEffect, useRef, useState } from 'react'
import { debounce } from 'lodash'
import HeaderResultSearch from './HeaderResultSearch'
import { Search } from 'lucide-react'
import { useDebounce } from 'use-debounce'
import { useDispatch } from 'react-redux'
import { onShowOverload } from '../../../Redux/uiSlice'

const HeaderSeacrhInput = () => {
      const [showSearch, setShowSearch] = useState(false)
      const divRef = useRef<HTMLDivElement>(null)
      const [text, setText] = useState<string>('')
      const inputRef = useRef<HTMLInputElement | null>(null)
      const [textDelay, setTextDelay] = useState<string>('')
      const timer = useRef<NodeJS.Timeout>()
      const dispatch = useDispatch()

      const onChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = event.target
            setText(value)
      }

      const onReset = useCallback(() => {
            setText('')
            setShowSearch(false)
            dispatch(onShowOverload({ overload: false }))
      }, [])

      const controllShowResultSearch = useCallback(
            (e: MouseEvent) => {
                  if (divRef.current && !divRef.current.contains(e.target as Node)) {
                        setShowSearch(false)
                        dispatch(onShowOverload({ overload: false }))
                  }
            },
            [setShowSearch],
      )

      useEffect(() => {
            console.log('check')
            document.addEventListener('click', controllShowResultSearch)
            return () => {
                  console.log('remove')
                  document.removeEventListener('click', controllShowResultSearch)
            }
      }, [controllShowResultSearch])

      useEffect(() => {
            timer.current = setTimeout(() => {
                  console.log('OK')
                  setTextDelay(text)
            }, 1000)

            return () => clearTimeout(timer.current)
      }, [text])

      return (
            <div className='flex h-full border border-gray-300 rounded-lg' ref={divRef}>
                  <div className='relative grow  h-full pl-4'>
                        <form className='h-full  flex gap-4'>
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
                                          onClick={() => dispatch(onShowOverload({ overload: true }))}
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
