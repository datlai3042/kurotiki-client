import { Check } from 'lucide-react'
import React from 'react'

type TProps = {
      content: string
}

const ProductLabel = (props: TProps) => {
      const { content } = props

      return (
            <p className='flex bg-blue-100 rounded-xl w-max text-[10px] min-h-[20px] h-max px-[6px] items-center gap-[4px]'>
                  <span className='bg-blue-800 font-extrabold w-[12px] h-[12px] rounded-full flex items-center justify-center'>
                        <Check color='white' size={10} />
                  </span>
                  <span className='uppercase text-blue-700 font-semibold mt-[1px] text-[9px]'>{content}</span>
            </p>
      )
}

export default ProductLabel
