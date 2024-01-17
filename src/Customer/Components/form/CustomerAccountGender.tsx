import { Radio } from 'antd'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'

export type TGender = {
      MALE: 'Male'
      FEMALE: 'Female'
      OTHERS: 'Other'
}

const CustomerAccountGender = () => {
      const { control } = useFormContext() // retrieve all hook methods
      const user = useSelector((state: RootState) => state.authentication.user)
      const [gender, setGender] = useState<keyof TGender>(user.gender || 'MALE')

      return (
            <div className='ml-[0px] 2xl:ml-[165px] flex-1 flex-col md:flex-row'>
                  <Controller
                        control={control}
                        name='gender'
                        render={({ field: { onChange: onChangeHookForm, onBlur, value, ref } }) => (
                              <Radio.Group
                                    onChange={(e) => {
                                          setGender(e.target.value)
                                          onChangeHookForm(e.target.value)
                                    }}
                                    value={gender}
                              >
                                    <Radio value={'MALE'}>Male</Radio>
                                    <Radio value={'FEMALE'}>Female</Radio>
                                    <Radio value={'OTHERS'}>Others</Radio>
                              </Radio.Group>
                        )}
                  />
            </div>
      )
}

export default CustomerAccountGender
