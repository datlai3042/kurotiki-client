import React from 'react'

const CustomerWrapperItem = ({ children }: { children: React.ReactNode }) => {
      return (
            <div className='flex w-full flex-1 rounded-md min-h-full h-max  xl:mt-0 xl:min-h-[150px] max-h-auto  max-h-auto xl:p-[0] '>
                  {children}
            </div>
      )
}

// bg-[#ffffff] shadow-lg

export default CustomerWrapperItem
