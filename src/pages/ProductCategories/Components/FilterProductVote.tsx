import { Rate } from 'antd'
import { Check } from 'lucide-react'
import React, { SetStateAction, memo, useEffect, useReducer, useRef } from 'react'
import filterProductReducer, { Actions, initialValue } from '../../../reducer/filterProduct.reducer'
type TProps = {
      setVote: React.Dispatch<SetStateAction<{ minPrice: number; maxPrice: number; onVote: number }>>
}

const FilterProductVote = (props: TProps) => {
      const { setVote } = props

      const inputRef1 = useRef<HTMLInputElement>(null)
      const inputRef2 = useRef<HTMLInputElement>(null)
      const inputRef3 = useRef<HTMLInputElement>(null)

      const [state, setState] = useReducer(filterProductReducer, initialValue)

      const onChangeInput = ({ type, e }: { type: Actions; e: React.MouseEvent<HTMLButtonElement, MouseEvent> }) => {
            e.preventDefault()
            if (type === 'ON_CHECKED_HIGH') {
                  if (state.onCheckedHigh) {
                        setState({ type: 'ON_CHECKED_RESET' })
                        setVote((prev) => ({ ...prev, onVote: 1 }))
                        return
                  }
                  setVote((prev) => ({ ...prev, onVote: 5 }))
                  setState({ type })
            }

            if (type === 'ON_CHECKED_MID') {
                  if (state.onCheckedMid) {
                        setState({ type: 'ON_CHECKED_RESET' })
                        setVote((prev) => ({ ...prev, onVote: 1 }))

                        return
                  }
                  setVote((prev) => ({ ...prev, onVote: 4 }))
                  setState({ type })
            }

            if (type === 'ON_CHECKED_LOW') {
                  if (state.onCheckedLow) {
                        setState({ type: 'ON_CHECKED_RESET' })
                        setVote((prev) => ({ ...prev, onVote: 1 }))

                        return
                  }
                  setVote((prev) => ({ ...prev, onVote: 3 }))
                  setState({ type })
            }
      }

      const styleEffect = {
            onSelect: (state: boolean) => {
                  if (state) return 'bg-blue-600 border-blue-600 '
                  return 'bg-[#ffffff] border-gray-300 hover:border-[2px] hover:border-blue-700 hover:shadow-lg '
            },
      }

      return (
            <div>
                  <div className='w-full flex flex-wrap  gap-[30px] py-[16px]'>
                        <h5 className='w-full'>Đánh giá</h5>
                        <button
                              className='min-:w-[42%] flex items-center gap-[14px] text-[14px]'
                              onClick={(e) => onChangeInput({ type: 'ON_CHECKED_HIGH', e })}
                        >
                              <input className='hidden' defaultChecked={state.onCheckedHigh} type='radio' ref={inputRef1} />
                              <div
                                    className={`${styleEffect.onSelect(
                                          state.onCheckedHigh,
                                    )} relative w-[24px] h-[24px]  border-[1px] hover:border-[2px] `}
                              >
                                    {state.onCheckedHigh && (
                                          <Check
                                                className='animate-mountComponent absolute  top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'
                                                size={14}
                                                color='white'
                                          />
                                    )}
                              </div>
                              <Rate disabled defaultValue={5} className='text-[14px]' />
                              <p>Từ 5 sao</p>
                        </button>

                        <button
                              className='min-w-[42%] flex items-center gap-[12px] text-[14px]'
                              onClick={(e) => onChangeInput({ type: 'ON_CHECKED_MID', e })}
                        >
                              <input className='hidden' defaultChecked={state.onCheckedMid} type='radio' ref={inputRef2} />
                              <div className={`${styleEffect.onSelect(state.onCheckedMid)} relative w-[24px] h-[24px]  border-[1px] `}>
                                    {state.onCheckedMid && (
                                          <Check
                                                className='animate-mountComponent absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'
                                                size={14}
                                                color='white'
                                          />
                                    )}
                              </div>
                              <Rate disabled defaultValue={4} className='text-[14px]' />
                              <p>Từ 4 sao</p>
                        </button>

                        <button
                              className='min-w-[50%] flex items-center gap-[14px]'
                              onClick={(e) => onChangeInput({ type: 'ON_CHECKED_LOW', e })}
                        >
                              <input className='hidden' defaultChecked={state.onCheckedLow} type='radio' ref={inputRef3} />
                              <div className={`${styleEffect.onSelect(state.onCheckedLow)} relative w-[24px] h-[24px]  border-[1px] `}>
                                    {state.onCheckedLow && (
                                          <Check
                                                className='animate-mountComponent absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'
                                                size={14}
                                                color='white'
                                          />
                                    )}
                              </div>
                              <Rate disabled defaultValue={3} className='text-[14px] gap-[2px]' />
                              <p>Từ 3 sao</p>
                        </button>
                  </div>
            </div>
      )
}

export default memo(FilterProductVote)
