import React, { memo } from 'react'

//@handle time
import { DateTime } from 'luxon'

//@ form
import { FieldValues, Path } from 'react-hook-form'
import { TimeLineProps } from '../../../types/timeline/timeLine.type'

const Timeline = <T, HookFormType extends FieldValues>(props: TimeLineProps<T, HookFormType>) => {
      const { methods, TimeLineName, FieldName, File, Files, type, isSubmit, mode = 'UPLOAD', messageError, value } = props
      // const methods = useFormContext()
      const error = methods?.formState.errors
      //@ui

      // const context = useFor

      const width = FieldName && error![FieldName as string] ? 'w-[200px]' : 'w-[150px]'
      const widthFile =
            //  ((File?.CountFile as number) || (Files?.CountFile as number)) < 1 ?
            'w-[250px]'

      //  : 'w-[200px]'

      const styleEffect = {
            heightScale: type === 'Files' ? 85 : 70,
            heightContainer: type === 'Files' ? 75 : 70,
      }

      // console.log(type === 'Files' && Files?.FileName)

      //@element
      return (
            <div style={{ minHeight: styleEffect.heightContainer }} className={` h-auto flex`}>
                  <div className='flex gap-[12px] items-start relative'>
                        <div className='relative w-[16px] h-[16px] border-[2px] border-blue-700 rounded-full'></div>
                        <div
                              // style={{ height: styleEffect.heightScale }}
                              className={` absolute top-[16px] left-[8px] h-full translate-x-[-50%]  bg-blue-700 w-[2px] flex items-center`}
                        >
                              <p className='translate-x-[-180%] text-[12px]'>
                                    {DateTime.now().setZone('Asia/Ho_Chi_Minh').toLocaleString(DateTime.TIME_24_SIMPLE)}
                              </p>
                        </div>
                        {type === 'Text' && (
                              <div
                                    className={`${width} flex flex-col gap-[6px] mt-[-5px]  min-w-[150px]`}
                                    title={`${TimeLineName}: ${methods?.watch(FieldName as unknown as Path<HookFormType>[])}`}
                              >
                                    <p>{TimeLineName}</p>
                                    {FieldName && error![FieldName]?.message && (
                                          <span className='text-[12px] text-red-700 w-[200px] truncate'>
                                                {error![FieldName]?.message as React.ReactNode}
                                          </span>
                                    )}
                                    {FieldName && !error![FieldName]?.message && (
                                          <span className='text-blue-700 w-[200px] truncate'>
                                                {methods?.watch(FieldName as unknown as Path<HookFormType>[]) as React.ReactNode}
                                          </span>
                                    )}
                              </div>
                        )}

                        {type === 'Money' && (
                              <div
                                    className={`${width} flex flex-col gap-[6px] mt-[-5px] min-w-[150px]`}
                                    title={`Giá sản phẩm: ${methods?.watch(FieldName as unknown as Path<HookFormType>[])}`}
                              >
                                    <p>{TimeLineName}</p>
                                    {FieldName && error![FieldName]?.message && (
                                          <span className='text-[12px] text-red-700 w-[200px] truncate'>
                                                {error![FieldName]?.message as React.ReactNode}
                                          </span>
                                    )}
                                    {FieldName && !error![FieldName]?.message && (
                                          <span className=' text-blue-700 w-[200px] truncate'>
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                                      Number(methods?.watch(FieldName as unknown as Path<HookFormType>)),
                                                )}
                                          </span>
                                    )}
                              </div>
                        )}

                        {type === 'File' && (
                              <div
                                    className={`${widthFile} flex flex-col gap-[6px] mt-[-5px] transition-all duration-500 min-w-[150px]`}
                                    title={`Hình đại diện sản phẩm là bắt buộc'`}
                              >
                                    <p>{TimeLineName}</p>
                                    {isSubmit && !File?.isUploadImage && (
                                          <span className='text-[12px] text-red-700 w-[200px] truncate'>
                                                {'Hình đại diện sản phẩm là bắt buộc'}
                                          </span>
                                    )}
                                    {File?.isUploadImage && (
                                          <span className='text-[12px] text-blue-700 w-[200px] break-words'>{File?.FileName}</span>
                                    )}
                              </div>
                        )}
                        {type === 'Files' && (
                              <div className={`${widthFile} flex flex-col gap-[6px] mt-[-5px] transition-all duration-500 min-w-[150px]`}>
                                    <p>{TimeLineName}</p>

                                    {isSubmit && !Files?.isUploadImages && (
                                          <span className='text-[12px] text-red-700 w-[200px] truncate'>
                                                {'Hình đại diện sản phẩm là bắt buộc'}
                                          </span>
                                    )}
                                    {Files && (
                                          <div className='flex flex-col gap-[4px] text-blue-700'>
                                                {Files!.FileName.map((file) => (
                                                      <a
                                                            rel='noreferrer'
                                                            href={file}
                                                            target='_blank'
                                                            key={file}
                                                            className='pl-[12px] text-[12px] w-[200px] break-all relative before:absolute before:top-[10px] before:left-[-10px] before:w-[8px] before:h-[8px] before:rounded-full before:bg-blue-500 before:animate-pulse'
                                                      >
                                                            {file}
                                                      </a>
                                                ))}
                                          </div>
                                    )}
                              </div>
                        )}
                  </div>
            </div>
      )
}

export default Timeline
