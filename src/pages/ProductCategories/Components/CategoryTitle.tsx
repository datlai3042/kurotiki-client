import React from 'react'
import { useDispatch } from 'react-redux'
import { addToast } from '../../../Redux/toast'

type TProps = {
      title: string[]
      onGetNameCategory: (name: string) => void
}

const CategoryTitle = (props: TProps) => {
      const { title, onGetNameCategory } = props
      const dispatch = useDispatch()

      return (
            <div className='hidden xl:flex  h-max bg-color-section-theme text-text-theme rounded-md flex-col gap-[16px]'>
                  <ul className='flex flex-col w-full h-max text-[12px]'>
                        {title.map((p, index) => {
                              return (
                                    <li
                                          key={index}
                                          className='w-full px-[16px] py-[10px] border-b-[1px] border-[var(--border-color-input)] '
                                          onClick={() => {
                                                dispatch(
                                                      addToast({
                                                            id: Math.random().toString(),
                                                            message: `Danh mục ${p} chưa được xây dựng`,
                                                            type: 'WARNNING',
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
