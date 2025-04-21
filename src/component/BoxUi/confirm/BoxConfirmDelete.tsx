import React, { SetStateAction, useEffect, useRef, useState } from 'react'
import Portal from '../../Portal'
import BoxButton from '../BoxButton'
import { X } from 'lucide-react'
import BoxLoading from '../BoxLoading'

type BoxConfirmDeleteProps<ParamsActive> = {
      content: React.ReactNode
      subContent?: React.ReactNode
      ButtonConfrimContent: string
      ButtonCancellContent: string
      isLoadng?: boolean
      paramsActive: ParamsActive
      onActive: (params: ParamsActive) => void
      onClose: React.Dispatch<SetStateAction<boolean>>
}

const BoxConfirmDelete = <T,>(props: BoxConfirmDeleteProps<T>) => {
      const { content, subContent, isLoadng, ButtonCancellContent, ButtonConfrimContent, paramsActive, onActive, onClose } = props

      const wrapperRef = useRef<HTMLDivElement>(null)
      const [widthBreakLine, setWidthBreakLine] = useState<{ width: number; marginLeft: number }>({
            width: 0,
            marginLeft: 0,
      })

      useEffect(() => {
            if (wrapperRef.current) {
                  let wrapperRefPx = Number(
                        window.getComputedStyle(wrapperRef.current, null).getPropertyValue('padding-left').replace('px', ''),
                  )
                  let width = Number(wrapperRef.current.getBoundingClientRect().width)
                  setWidthBreakLine({ width, marginLeft: wrapperRefPx })
            }
      }, [widthBreakLine.width, widthBreakLine.marginLeft])

      const styleEffect = {
            onLoading: (check: boolean) => {
                  if (check) return 'bg-red-400 border-red-400 border-[1px] text-white '
                  return 'bg-[#dc2626] opacity-80 hover:opacity-100'
            },
      }

      return (
            <Portal>
                  <div className='fixed inset-0 bg-[#1145683b] flex items-center justify-center z-[900]'>
                        <div
                              className='relative  w-[80%] xl:w-[400px]  bg-color-section-theme text-text-theme rounded-lg flex flex-col gap-[24px] mx-[15px] xl:m-0 p-[14px_10px] xl:px-[24px] xl:py-[16px]'
                              ref={wrapperRef}
                        >
                              <button className='absolute top-[-15px] right-[-15px] w-[30px] h-[30px] border-[1px] border-[var(--border-color-input)] bg-white hover:bg-color-main hover:text-[#fff] hover:border-transparent rounded-full flex items-center justify-center'>
                                    <X onClick={() => onClose(false)} />
                              </button>
                              <div className='flex flex-col gap-[8px]'>
                                    <div className=' '>{content}</div>
                                    <div>{subContent}</div>
                              </div>
                              <div
                                    style={{ width: widthBreakLine.width, marginLeft: -widthBreakLine.marginLeft }}
                                    className='bg-[var(--border-color-input)] h-[1px] mt-[-10px]'
                              ></div>

                              <div className='flex justify-end gap-[8px] h-[36px] '>
                                    <div className=' '>
                                          <button
                                                className={`bg-color-main text-[#fff] opacity-80 hover:opacity-100 min-w-[100px] h-[36px] p-[8px] flex items-center justify-center gap-[8px] rounded-[4px] `}
                                                onClick={() => {
                                                      onClose(false)
                                                }}
                                          >
                                                <span>{ButtonCancellContent}</span>
                                          </button>
                                    </div>

                                    <div className=' '>
                                          <button
                                                className={`${styleEffect.onLoading(
                                                      isLoadng || false,
                                                )} min-w-[100px] text-[#fff] h-[36px] p-[8px] flex items-center justify-center gap-[8px] rounded-[4px] `}
                                                onClick={() => {
                                                      onActive(paramsActive)
                                                }}
                                          >
                                                <span>{ButtonConfrimContent}</span>
                                                {isLoadng && <BoxLoading color='text-white' />}
                                          </button>
                                    </div>
                              </div>
                        </div>
                  </div>
            </Portal>
      )
}

export default BoxConfirmDelete
