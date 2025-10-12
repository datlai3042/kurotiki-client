import { AlertCircle } from 'lucide-react'
import React from 'react'

const InputError = ({ message = 'Ops, Có lỗi gì đó đâu đây' }: { message?: string }) => {
      return (
            <div className=' min-h-[10px] flex items-center text-[1.4rem] text-[rgb(230_105_105)] font-bold bg-[rgb(251_213_213)]'>
                  <div className='p-[6px_10px] w-[90px] flex-center'>
                        <AlertCircle className='ml-[-9px]' />
                  </div>
                  {<p>{message}</p>}
            </div>
      )
}

export default InputError
