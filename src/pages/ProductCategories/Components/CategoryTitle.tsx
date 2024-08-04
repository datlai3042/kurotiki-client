import React from 'react'
import { useDispatch } from 'react-redux'
import { addOneToastWarning } from '../../../Redux/toast'

type TProps = {
      title: string[]
      onGetNameCategory: (name: string) => void
}

const CategoryTitle = (props: TProps) => {
      const { title, onGetNameCategory } = props
      const dispatch = useDispatch()

      return (
            <div className='hidden xl:flex w-[18%] max-w-[18%] h-max bg-[#ffffff] rounded-md flex-col gap-[16px]'>
                  <h3 className='text-center h-[60px] flex justify-center items-center'>Danh mục</h3>
                  <ul className='flex flex-col w-full h-max text-[12px]'>
                        {title.map((p, index) => {
                              return (
                                    <li
                                          key={index}
                                          className='w-full px-[16px] py-[10px] border-b-[2px] border-slate-100 '
                                          onClick={() => {
                                                
                                                
                                                dispatch(
                                                      addOneToastWarning({
                                                            toast_item: {
                                                                  type: 'WARNING',
                                                                  _id: Math.random().toString(),
                                                                  core: {
                                                                        message: `Danh mục ${p} chưa được xây dựng`,
                                                                  },
                                                                  toast_title: 'Lỗi upload',
                                                            },
                                                      }),
                                                )
                                                onGetNameCategory(p)
                                          }}
                                    >
                                          {p}
                                    </li>
                              )
                        })}
                  </ul>
            </div>
      )
}

export default CategoryTitle
