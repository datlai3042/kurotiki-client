import React from 'react'

const ProductSkeleton = () => {
      return (
            <div className='animate-pulse bg-color-section-theme flex gap-[16px]'>
                  <div className=' w-full flex flex-col gap-[16px] p-[8px]'>
                        <div className=' w-[240px] h-[30px] skeleton__container comment  rounded-lg'></div>

                        <div className='top w-full h-screen flex flex-col xl:flex-row gap-[16px]'>
                              <div className='basis-[25%]  static  h-screen xl:sticky top-[16px]    flex flex-col gap-[16px]'>
                                    <div className=' skeleton__container  basis-[55%] w-full  rounded-lg'></div>
                                    <div className='flex  h-[65px] gap-[12px] '>
                                          {Array(3)
                                                .fill(0)
                                                .map((skeleton, index) => (
                                                      <div
                                                            className=' skeleton__container  rounded-lg w-[25%] flex items-center justify-center'
                                                            key={index}
                                                      ></div>
                                                ))}
                                    </div>
                                    <div className=' flex-1 skeleton__container w-full'></div>
                              </div>
                              <div className=' basis-[60%]   mt-[20px] xl:mt-0  flex flex-col gap-[16px] '>
                                    <div className='w-full h-[300px]  skeleton__container rounded-lg '></div>

                                    <div className='w-full h-[400px]  skeleton__container rounded-lg'></div>
                                    <div className='w-full h-[500px]  skeleton__container rounded-lg'></div>

                                    {/* <ProductIntro product={product} /> */}
                              </div>

                              <div className=' basis-[25%] skeleton__container    mt-[20px] xl:mt-0 rounded-lg '>
                                    {/* <ProductIntro product={product} /> */}
                              </div>
                        </div>
                        <div className='  skeleton__container comment w-full h-[1000px] '></div>
                  </div>
                  {/* <div className='animate-pulse bg-gray-400 basis-[20%] sticky top-[16px] h-[300px]'></div> */}
            </div>
      )
}

export default ProductSkeleton
