import { Check } from 'lucide-react'
import React from 'react'

type TProps = {
      content: string
}

const ProductLabel = (props: TProps) => {
      const { content } = props

      return (
            <div className='flex w-max items-center gap-[5px] rounded-full border border-blue-200 bg-blue-50 px-[7px] py-[3px] dark:border-blue-500/20 dark:bg-blue-500/10'>
                  <span className='flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-full bg-blue-600 dark:bg-blue-500'>
                        <Check size={9} strokeWidth={3} className='text-white' />
                  </span>

                  <span className='text-[10px] font-semibold uppercase leading-none tracking-[0.01em] text-blue-700 dark:text-blue-400'>
                        {content}
                  </span>
            </div>
      )
}

export default ProductLabel