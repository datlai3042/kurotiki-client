import { ArrowRight } from 'lucide-react'
import React, { SetStateAction, useState } from 'react'
import { MAX_PRICE } from '../../../component/BoxUi/BoxFilterProduct'

type PriceFilter = 'MAX_40' | 'MAX_120' | 'MAX_180' | 'MIN_180'

type TProps = {
      setPrice: React.Dispatch<SetStateAction<{ minPrice: number; maxPrice: number; onVote: number }>>
      parentController: { minPrice: number; maxPrice: number; onVote: number }
}

const FilterProductPrice = (props: TProps) => {
      const { setPrice, parentController } = props

      const [active, setActive] = useState<number>(0)

      const onValueChange = (index: number, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.stopPropagation()
            e.preventDefault()
            if (index === 1) {
                  setActive(1)
                  setPrice((prev) => ({ ...prev, minPrice: 1, maxPrice: 40000 }))
                  return
            }

            if (index === 2) {
                  setActive(2)
                  setPrice((prev) => ({ ...prev, minPrice: 40000, maxPrice: 120000 }))
                  return
            }

            if (index === 3) {
                  setActive(3)
                  setPrice((prev) => ({ ...prev, minPrice: 120000, maxPrice: 180000 }))
                  return
            }

            if (index === 4) {
                  setActive(4)
                  setPrice((prev) => ({ ...prev, minPrice: 180000, maxPrice: MAX_PRICE }))
                  return
            }
      }

      const styleEffect = {
            onActive: (state: boolean) => {
                  if (state) return 'border-[1px] border-blue-700 hover:bg-blue-50 text-blue-700'
                  return 'border-[1px] border-gray-200 bg-[#ffffff] hover:bg-gray-300'
            },
      }

      return (
            <div className='w-full h-max flex flex-col gap-[16px] text-[14px]'>
                  <h5 className='w-full text-[18px] text-slate-800'>Giá</h5>
                  <div className='w-full flex flex-wrap gap-[20px]'>
                        <button
                              className={`${styleEffect.onActive(active === 1)} min-w-[120px] h-[40px] rounded-[999px] `}
                              onClick={(e) => {
                                    onValueChange(1, e)
                              }}
                        >
                              Dưới 40.0000
                        </button>

                        <button
                              className={`${styleEffect.onActive(
                                    active === 2,
                              )} min-w-[120px] h-[40px] rounded-[999px]  flex gap-[4px] w-max items-center justify-center px-[8px] `}
                              onClick={(e) => onValueChange(2, e)}
                        >
                              <span>40.0000</span>
                              <ArrowRight size={14} />
                              <span>120.000</span>
                        </button>

                        <button
                              className={`${styleEffect.onActive(
                                    active === 3,
                              )} min-w-[120px] h-[40px] rounded-[999px]  flex gap-[4px] w-max items-center px-[8px]`}
                              onClick={(e) => onValueChange(3, e)}
                        >
                              <span>120.0000</span>
                              <ArrowRight size={14} />

                              <span>180.000</span>
                        </button>

                        <button
                              className={`${styleEffect.onActive(
                                    active === 4,
                              )} min-w-[120px] h-[40px] rounded-[999px]  flex gap-[4px] w-max items-center px-[8px]`}
                              onClick={(e) => onValueChange(4, e)}
                        >
                              <span>Trên 180.0000</span>
                        </button>
                  </div>

                  <h5 className='w-full text-[18px] text-slate-800'>Tự nhập khoảng giá</h5>
                  <div className='w-full flex flex-wrap gap-[20px] mt-[20px] '>
                        <input
                              className='w-[180px] h-[40px] border-[1px] border-gray-200 outline-none px-[12px] py-[6px] rounded-md'
                              type='number'
                              value={parentController.minPrice}
                              onChange={(e) => {
                                    setPrice((prev) => ({ ...prev, minPrice: Number(e.target.value) }))
                              }}
                              placeholder='Từ'
                        />
                        <input
                              className='w-[180px] h-[40px] border-[1px] border-gray-200 outline-none px-[12px] py-[6px] rounded-md'
                              type='number'
                              value={parentController.maxPrice}
                              onChange={(e) => {
                                    setPrice((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))
                              }}
                              placeholder='Đến'
                        />
                  </div>
            </div>
      )
}

export default FilterProductPrice
