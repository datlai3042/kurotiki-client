import { useEffect, useRef } from 'react'
import BoxCenter from './BoxCenter'

type Props = {
      Quantity: number
      ClassName?: string
}

const BoxIsBought = (props: Props) => {
      const containerBoughtRef = useRef<HTMLDivElement>(null)
      const boxBoughtRef = useRef<HTMLDivElement>(null)

      useEffect(() => {
            if (boxBoughtRef.current && containerBoughtRef.current) {
                  const width = containerBoughtRef.current.getBoundingClientRect().width - 5
                  const widthPercent = Math.ceil(width) / 10

                  //     //console.log(([^)]+))
                  //  console.log(([^)]+))
                  boxBoughtRef.current.style.width = `${
                        props.Quantity > 0 || props.Quantity !== 0 || props.Quantity <= 10
                              ? `${props.Quantity * (widthPercent && props.Quantity < 3 ? 30 : widthPercent)}`
                              : props.Quantity < 10
                              ? width
                              : '25'
                  }px`
            }
      }, [])

      return (
            <div
                  className={`${props.ClassName ? props.ClassName : ''} bg-red-200 rounded-[999px] relative  w-full `}
                  ref={containerBoughtRef}
            >
                  <div className={`absolute z-[20] bg-[red] w-[25px]  h-full rounded-[999px]`} ref={boxBoughtRef}></div>

                  <BoxCenter
                        ClassName='h-full'
                        content={
                              <span className='absolute z-[20] text-white'>
                                    {props.Quantity && props.Quantity > 0 ? `Đã bán ${props.Quantity}` : 'Vừa mở bán'}
                              </span>
                        }
                  />
            </div>
      )
}

export default BoxIsBought
