import React from 'react'

const ProductLoading = () => {
      return (
            <>
                  {Array(6)
                        .fill(0)
                        .map((_, index) => {
                              return (
                                    <div
                                          className='animate-pulse bg-gray-100 flex flex-col min-w-[40%] md:min-w-[30%] lg:min-w-[15%] min-h-[200px] snap-always snap-start	 '
                                          key={index}
                                    >
                                          <div className='bg-gray-200 w-full min-h-full flex rounded'>
                                                <div className='bg-slate-300 min-w-full min-h-[85%] max-h-[85%] rounded'></div>
                                                <p className='bg-slate-300 w-full text-center h-[20px] rounded'></p>
                                          </div>
                                    </div>
                              )
                        })}
            </>
      )
}

export default ProductLoading
