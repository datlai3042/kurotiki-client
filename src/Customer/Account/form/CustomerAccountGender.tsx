import { Radio } from 'antd'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'

export type TGender = {
      Male: 'Male'
      Female: 'Female'
      Other: 'Other'
}

const CustomerAccountGender = () => {
      const { control } = useFormContext() // retrieve all hook methods
      const user = useSelector((state: RootState) => state.authentication.user)
      const [gender, setGender] = useState<keyof TGender>(user?.gender || 'Male')

      return (
            <div className='w-full xl:w-[70%] text-left  flex-1 flex-col sm:flex-row'>
                  <Controller
                        control={control}
                        name='gender'
                        render={({ field: { onChange: onChangeHookForm, onBlur, value, ref } }) => {
                              return (
                                    <>
                                          <div className='grid grid-cols-3 gap-4'>
                                                {(
                                                      [
                                                            { key: 'Male', label: 'Nam' },
                                                            { key: 'Female', label: 'Nữ' },
                                                            { key: 'Other', label: 'Khác' },
                                                      ] as const
                                                ).map((g) => (
                                                      <button
                                                            key={g.key}
                                                            onClick={(e) => {
                                                                  e.preventDefault()
                                                                  e.stopPropagation()
                                                                  setGender(g.key)
                                                                  // onChangeHookForm(g.key)
                                                            }}
                                                            className={`flex items-center justify-center gap-2 border rounded-xl py-3 text-sm font-medium transition-colors ${
                                                                  gender === g.key
                                                                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                                                                        : 'border-gray-200 text-text-theme hover:border-gray-300'
                                                            }`}
                                                      >
                                                            <span
                                                                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                                                        gender === g.key ? 'border-blue-500' : 'border-gray-300'
                                                                  }`}
                                                            >
                                                                  {gender === g.key && (
                                                                        <span className='w-2 h-2 rounded-full bg-blue-500' />
                                                                  )}
                                                            </span>
                                                            {g.label}
                                                      </button>
                                                ))}
                                          </div>
                                        
                                    </>
                              )
                        }}
                  />
            </div>
      )
}

export default CustomerAccountGender
