import React, { SetStateAction, useEffect, useRef, useState } from 'react'
import Portal from '../../Portal'
import BoxButton from '../BoxButton'
import { AlertTriangle, X } from 'lucide-react'
import BoxLoading from '../BoxLoading'

type BoxConfirmDeleteProps<ParamsActive> = {
      content: React.ReactNode
      subContent?: React.ReactNode
      ButtonConfrimContent: string
      ButtonCancellContent: string
      isLoadng?: boolean
      paramsActive: ParamsActive
      onActive: (params: ParamsActive) => void
      onClose: React.Dispatch<SetStateAction<any>>
}

const BoxConfirmDelete = <T,>(props: BoxConfirmDeleteProps<T>) => {
      const {
            content,
            subContent,
            isLoadng,
            ButtonCancellContent,
            ButtonConfrimContent,
            paramsActive,
            onActive,
            onClose,
      } = props

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
                  if (check) {
                        return 'cursor-not-allowed border-red-500/50 bg-red-500/70 text-white'
                  }

                  return 'border-red-500 bg-red-600 text-white hover:bg-red-500 hover:shadow-[0_8px_24px_rgba(220,38,38,0.22)]'
            },
      }

      return (
            <Portal>
                  <div
                        className='fixed inset-0 z-[900] flex items-center justify-center bg-black/70 px-4 backdrop-blur-[2px]'
                        onClick={() => onClose(false)}
                  >
                        <div
                              ref={wrapperRef}
                              onClick={(e) => e.stopPropagation()}
                              className='relative w-full max-w-[460px] overflow-hidden rounded-[14px] border border-white/[0.08] bg-[#151922] text-text-theme shadow-[0_24px_80px_rgba(0,0,0,0.55)]'
                        >
                              {/* Header */}
                              <div className='flex items-start justify-between gap-4 border-b border-white/[0.08] px-5 py-5'>
                                    <div className='flex min-w-0 items-start gap-3'>
                                          <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400'>
                                                <AlertTriangle size={21} strokeWidth={1.9} />
                                          </div>

                                          <div className='min-w-0'>
                                                <h3 className='text-[17px] font-semibold tracking-[-0.01em] text-white'>
                                                      Xác nhận xóa sản phẩm
                                                </h3>
                                                <p className='mt-1 text-[13px] leading-5 text-slate-400'>
                                                      Hành động này sẽ xóa sản phẩm khỏi giỏ hàng của bạn.
                                                </p>
                                          </div>
                                    </div>

                                    <button
                                          type='button'
                                          aria-label='Đóng'
                                          onClick={() => onClose(false)}
                                          className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/[0.06] hover:text-white'
                                    >
                                          <X size={18} />
                                    </button>
                              </div>

                              {/* Content */}
                              <div className='px-5 py-5'>
                                    <div className='rounded-xl border border-white/[0.07] bg-white/[0.025] p-4'>
                                          <div className='text-[14px] leading-6 text-white'>{content}</div>

                                          {subContent && (
                                                <div className='mt-3 border-t border-white/[0.06] pt-3 text-[13px] leading-5 text-slate-400'>
                                                      {subContent}
                                                </div>
                                          )}
                                    </div>

                                    <div className='mt-4 flex items-start gap-2 rounded-lg bg-red-500/[0.06] px-3 py-2.5 text-[12px] leading-5 text-red-300'>
                                          <AlertTriangle size={15} className='mt-[2px] shrink-0' />
                                          <span>Sản phẩm đã xóa có thể phải tìm và thêm lại vào giỏ hàng nếu bạn đổi ý.</span>
                                    </div>
                              </div>

                              {/* Footer */}
                              <div className='flex items-center justify-end gap-3 border-t border-white/[0.08] bg-black/[0.08] px-5 py-4'>
                                    <button
                                          type='button'
                                          className='flex h-10 min-w-[110px] items-center justify-center rounded-lg border border-white/[0.12] bg-white/[0.025] px-4 text-[14px] font-medium text-slate-200 transition hover:border-white/[0.2] hover:bg-white/[0.06]'
                                          onClick={() => {
                                                onClose(false)
                                          }}
                                    >
                                          {ButtonCancellContent}
                                    </button>

                                    <button
                                          type='button'
                                          disabled={isLoadng}
                                          className={`${styleEffect.onLoading(
                                                isLoadng || false,
                                          )} flex h-10 min-w-[124px] items-center justify-center gap-2 rounded-lg border px-4 text-[14px] font-medium transition`}
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
            </Portal>
      )
}

export default BoxConfirmDelete