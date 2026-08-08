import { Select } from 'antd'
import { Calendar, Check } from 'lucide-react'
import moment from 'moment'
import { memo, useCallback, useMemo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

const CustomerAccountBirth = () => {
      const {
            clearErrors,
            control,
            watch,
            formState: { errors },
      } = useFormContext()

      //tham chiếu ngày tháng hiện tại
      //instance Date
      const d = new Date()
      //lấy số ngày của tháng
      const dayCurrent = new Date(Number(watch('birth.year')), Number(watch('birth.month')), 0).getDate()

      //Năm hiện tại
      const yearCurrent = new Date().getFullYear()

      //DefaultValues - có thể từ db hoặc ngày tháng hiện tại
      const daySelectDefault = watch('birth.day')
      const monthSelectDefault = watch('birth.month')
      const yearSelectDefault = watch('birth.year')

      //render day
      const renderDay = (soNgay: number, year: number) => {
            let newDayArray = []
            for (let index = 1; index <= soNgay; index++) {
                  newDayArray.push({ value: index, label: index })
            }
            return newDayArray
      }
      //render month
      const renderMonth = useCallback(() => {
            let newMonthYear = []
            for (let index = 1; index <= 12; index++) {
                  newMonthYear.push({ value: index, label: index })
            }
            return newMonthYear
      }, [])

      //render year
      const renderYear = useCallback(() => {
            let newYearArray = []
            for (let index = yearCurrent; index > 1900; index--) {
                  newYearArray.push({ value: index, label: index })
            }
            return newYearArray
      }, [])

      const validator = (day: string, month: string, year: string) => {
            clearErrors()
            /* điều kiện bắt buộc 3 biến giá trị nhận từ select của antd là number 
phải convert sang string mới check được vaild của thư viện momnent
-> Giá trị ban đầu lúc người dùng chưa cập nhập ngày sinh thì 'Ngày' 'Tháng' 'Năm', cho phải có ngoại lệ cho 3 trường trên
tránh việc người dùng không cập nhập, sửa đổi giá trị bob sẽ gây ra lỗi
vaild -> thì return true
not -> reutrn false
giá trị mặc định không bị sữa đổi -> true
*/
            day = day.toString().trim()
            month = month.toString().trim()
            year = year.toString().trim()
            const birthFull = `${year.trim()}-${month.trim()}-${day.trim()}`
            const vaild = moment(birthFull).isValid()
            if (vaild) {
                  return true
            }
            if (!vaild && day !== 'Ngày' && month !== 'Tháng' && year !== 'Năm') {
                  return false
            }
            return true
      }

      const dayAntd = useMemo(() => renderDay(dayCurrent, watch('birth.year')), [dayCurrent, watch])
      const monthAntd = useMemo(() => renderMonth(), [renderMonth])
      const yearAntd = useMemo(() => renderYear(), [renderYear])

      return (
            <div className='ml-[0px] flex-1 flex flex-col  gap-[10px] lg:items-start  w-full lg:justify-start'>
                  <div className='flex flex-col w-full justify-between gap-[20px] xl:gap-0 sm:flex-row'>
                        <Controller
                              control={control}
                              name='birth.day'
                              rules={{
                                    required: true,
                                    validate: {
                                          isValidDay: (value) => {
                                                const year = watch('birth.year')
                                                const month = watch('birth.month')
                                                const valid = validator(value, month, year)
                                                return valid || 'Ngày không hợp lệ'
                                          },
                                    },
                              }}
                              render={({ field: { onChange: onChangeHookForm } }) => (
                                    <Select
                                          defaultValue={daySelectDefault}
                                          style={{ borderRadius: '2px', padding: '0px 6px 0px 6px', height: 35, marginTop: -6, flex: 1 }}
                                          className='w-full xl:w-[110px]'
                                          options={dayAntd}
                                          onChange={(value) => {
                                                onChangeHookForm(value)
                                          }}
                                    />
                              )}
                        />

                        <Controller
                              control={control}
                              name='birth.month'
                              rules={{
                                    required: true,
                                    validate: {
                                          isValidDay: (value) => {
                                                if (value > 9) value = `0${value}`
                                                const day = watch('birth.day')
                                                const year = watch('birth.year')
                                                const valid = validator(day, value, year)
                                                return valid || 'Ngày không hợp lệ'
                                          },
                                    },
                              }}
                              render={({ field: { onChange: onChangeHookForm } }) => (
                                    <Select
                                          defaultValue={monthSelectDefault}
                                          style={{ borderRadius: '2px', padding: '0px 6px 0px 6px', height: 35, marginTop: -6, flex: 1 }}
                                          className='w-full xl:w-[110px]'
                                          options={monthAntd}
                                          onChange={(value) => {
                                                if (+value <= 9) value = '0' + value
                                                onChangeHookForm(value)
                                          }}
                                    />
                              )}
                        />

                        <Controller
                              control={control}
                              name='birth.year'
                              rules={{
                                    required: true,
                                    validate: {
                                          isValidDay: (value) => {
                                                const day = watch('birth.day')
                                                const month = watch('birth.month')
                                                const valid = validator(day, month, value)
                                                return valid || 'Ngày không hợp lệ'
                                          },
                                    },
                              }}
                              render={({ field: { onChange: onChangeHookForm } }) => (
                                    <Select
                                    suffixIcon={<Calendar size={16} />}
                                          defaultValue={yearSelectDefault}
                                          style={{ borderRadius: '2px', padding: '0px 6px 0px 6px', height: 35, marginTop: -6, flex: 1 }}
                                          className='w-full xl:w-[110px]'
                                          options={yearAntd}
                                          onChange={(value) => {
                                                if (+value <= 9) value = '0' + value
                                                onChangeHookForm(+value)
                                          }}
                                    />
                              )}
                        />
                  </div>
                  {Object.keys(errors).length > 0 && <p className='w-full ml-[5px] text-red-400'>Ngày không hợp lệ</p>}
            </div>
      )
}

export default memo(CustomerAccountBirth)
