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
            <div
                  ref={divRef}
                  className={`relative flex h-[44px] min-h-[44px] w-full items-center rounded-xl border bg-color-section-theme text-text-theme transition-all duration-200 ${
                        showSearch
                              ? 'border-blue-500 shadow-[0_0_0_3px_rgba(59,130,246,0.10)]'
                              : 'border-[var(--border-color-input)] hover:border-slate-400'
                  }`}
            >
                  <form className='flex h-full w-full items-center' spellCheck={false}>
                        <div className='flex h-full w-11 shrink-0 items-center justify-center text-slate-500'>
                              <Search size={20} strokeWidth={1.8} />
                        </div>

                        <div
                              className='relative h-full min-w-0 flex-1'
                              onClick={() => setShowSearch((prev) => !prev)}
                        >
                              <input
                                    ref={inputRef}
                                    type='text'
                                    value={text}
                                    className='h-full w-full border-none bg-transparent pr-10 text-sm text-text-theme outline-none placeholder:text-slate-400'
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

                              {text && (
                                    <button
                                          type='button'
                                          onClick={(e) => {
                                                e.stopPropagation()
                                                setText('')
                                                inputRef.current?.focus()
                                          }}
                                          className='absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                                          aria-label='Xóa tìm kiếm'
                                    >
                                          <X size={16} />
                                    </button>
                              )}
                        </div>
                  </form>

                  {showSearch && (
                        <HeaderResultSearch text={textDelay} onReset={onReset} />
                  )}
            </div>
      )
}

export default HeaderSeacrhInput