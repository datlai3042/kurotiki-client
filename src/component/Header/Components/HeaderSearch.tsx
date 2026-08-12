import React, { useCallback, useEffect, useRef, useState } from 'react'
import HeaderResultSearch from './HeaderResultSearch'
import { Search, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { onShowOverload } from '../../../Redux/uiSlice'
import { RootState } from '../../../store'
import { useLocation } from 'react-router-dom'

const HeaderSeacrhInput = () => {
      const [showSearch, setShowSearch] = useState(false)
      const [textDelay, setTextDelay] = useState('')
      const [text, setText] = useState('')

      const divRef = useRef<HTMLDivElement>(null)
      const inputRef = useRef<HTMLInputElement | null>(null)
      const timer = useRef<NodeJS.Timeout>()
      const location = useLocation()
      const dispatch = useDispatch()
      const showOverload = useSelector((state: RootState) => state.uiSlice.showOverload)

      const onReset = useCallback(() => {
            setText('')
            setShowSearch(false)
            dispatch(onShowOverload({ overload: false }))
      }, [dispatch])

      useEffect(() => {
            if (location.pathname !== '/') {
                  dispatch(onShowOverload({ overload: false }))
                  setText('')
                  setShowSearch(false)
            }
      }, [location, dispatch])

      const controllShowResultSearch = useCallback(
            (e: MouseEvent) => {
                  if (divRef.current && !divRef.current.contains(e.target as Node)) {
                        setShowSearch(false)
                        dispatch(onShowOverload({ overload: false }))
                  }
            },
            [dispatch],
      )

      useEffect(() => {
            if (showSearch) document.addEventListener('click', controllShowResultSearch)
            return () => document.removeEventListener('click', controllShowResultSearch)
      }, [controllShowResultSearch, showSearch])

      useEffect(() => {
            timer.current = setTimeout(() => setTextDelay(text), 1000)
            return () => clearTimeout(timer.current)
      }, [text])

      useEffect(() => {
            document.body.style.overflow = showOverload ? 'hidden' : 'unset'
      }, [showOverload])

      const openSearch = () => {
            setShowSearch(true)
            dispatch(onShowOverload({ overload: true }))
      }

      return (
            <div
                  ref={divRef}
                  className={`relative flex h-[40px] w-full items-center overflow-visible rounded-lg border bg-white transition-all duration-200 dark:bg-color-section-theme ${
                        showSearch
                              ? 'border-[#1677ff] shadow-[0_0_0_2px_rgba(22,119,255,0.08)]'
                              : 'border-[#d7dde8] hover:border-[#9ebcf7] dark:border-[var(--border-color-input)]'
                  }`}
            >
                  <form
                        className='flex h-full w-full items-center'
                        spellCheck={false}
                        onSubmit={(event) => {
                              event.preventDefault()
                              openSearch()
                        }}
                  >
                        <div className='flex h-full w-11 shrink-0 items-center justify-center text-[#6b7a90]'>
                              <Search size={18} strokeWidth={1.8} />
                        </div>

                        <div className='relative h-full min-w-0 flex-1'>
                              <input
                                    ref={inputRef}
                                    type='text'
                                    value={text}
                                    className='h-full w-full border-none bg-transparent pr-9 text-[13px] text-[#25324b] outline-none placeholder:text-[#8d9aaf] dark:text-text-theme'
                                    placeholder='Bạn tìm gì hôm nay?'
                                    onChange={(event) => setText(event.target.value)}
                                    onFocus={openSearch}
                              />

                              {text && (
                                    <button
                                          type='button'
                                          onClick={(e) => {
                                                e.stopPropagation()
                                                setText('')
                                                inputRef.current?.focus()
                                          }}
                                          className='absolute right-1 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100'
                                          aria-label='Xóa tìm kiếm'
                                    >
                                          <X size={15} />
                                    </button>
                              )}
                        </div>

                        <button
                              type='submit'
                              className='mr-[3px] flex h-[34px] shrink-0 items-center gap-1.5 rounded-md bg-[#0b62db] px-3 sm:px-4 text-[12px] font-semibold text-white transition hover:bg-[#0757c8]'
                        >
                              <Search size={14} strokeWidth={2} />
                              <span className='hidden md:inline'>Tìm kiếm</span>
                        </button>
                  </form>

                  {showSearch && <HeaderResultSearch text={textDelay} onReset={onReset} />}
            </div>
      )
}

export default HeaderSeacrhInput
