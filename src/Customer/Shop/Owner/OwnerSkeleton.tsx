import React from 'react'

const OwnerSkeleton = () => {
      return (
            <div className='relative animate-pulse bg-gray-400 w-full h-[200px] flex flex-col'>
                  <div className='w-full h-[50%] bg-gray-100 flex items-center justify-center'>
                        <p className='tracking-[4px] text-[18px] bg-gray-100'></p>
                  </div>
                  <div className='w-full h-[50%]  skeleton__container'></div>
                  <div className='absolute top-[50%] translate-y-[-50%] left-[60px] rounded-full w-[160px] h-[160px] bg-gray-300'></div>
            </div>
      )
}

export default OwnerSkeleton
