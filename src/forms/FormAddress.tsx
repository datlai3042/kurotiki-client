import { zodResolver } from '@hookform/resolvers/zod'
import React, { SetStateAction, useEffect, useMemo, useState } from 'react'
import { Controller, FieldErrors, FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { addressSchemaForm } from '../schema/addressForm.schema'
import { UserResponse } from '../types/user.type'
import { useMutation, useQuery } from '@tanstack/react-query'
import LocationService from '../apis/location.api'
import { Select } from 'antd'
import InputText from '../Customer/Sell/components/InputText'
import BoxButton from '../component/BoxUi/BoxButton'
import { useDispatch, useSelector } from 'react-redux'
import { addToast } from '../Redux/toast'
import AccountService from '../apis/account.service'
import { doOpenBoxLogin, fetchUser } from '../Redux/authenticationSlice'
import { RootState } from '../store'
import { Address } from '../types/address.type'
import Portal from '../component/Portal'

export type AddressForm = {
      address_type: 'Home' | 'Company' | 'Private'
      address_street: string
      address_ward: string
      address_district: string
      address_province: string
}

const defaultValues: AddressForm = {
      address_type: 'Home',
      address_street: '',
      address_ward: '',
      address_district: '',
      address_province: '',
}

const address_type = [
      {
            label: 'Nhà',
            value: 'Home',
      },
      { label: 'Công ty / cơ quan', value: 'Company' },
      { label: 'Nơi ở riêng', value: 'Private' },
]

type TProps = {
      onSuccessAddAddress?: (id: string) => void
      iconClose?: React.ReactNode
      onClose?: React.Dispatch<SetStateAction<boolean>>
}

const FormAddress = (props: TProps) => {
      const { onSuccessAddAddress, iconClose, onClose } = props

      const dispatch = useDispatch()

      const [province, setProvince] = useState<string>('')
      const [district, setDistrict] = useState<string>('')
      const [ward, setWard] = useState<string>('')

      const user = useSelector((state: RootState) => state.authentication.user) as UserResponse

      const addressForm = useForm<AddressForm>({
            defaultValues,
            resolver: zodResolver(addressSchemaForm),
      })

      const addressMutation = useMutation({
            mutationKey: ['/v1/api/account/add-address'],
            mutationFn: ({ payload }: { payload: Address }) => AccountService.addAddress({ payload }),
            onSuccess: (axiosResponse) => {
                  const { user } = axiosResponse.data.metadata
                  dispatch(fetchUser({ user }))
                  dispatch(addToast({ id: Math.random().toString(), type: 'SUCCESS', message: 'Thêm địa chỉ thành công' }))

                  onSuccessAddAddress && onSuccessAddAddress(user.user_address[user.user_address.length - 1]._id)
                  if (onClose) {
                        onClose(false)
                  }
            },
      })

      const onSubmit: SubmitHandler<AddressForm> = (form) => {
            if (!user) {
                  dispatch(doOpenBoxLogin())
                  return
            }
            let addressPayload: Address = {
                  type: form.address_type,
                  address_street: form.address_street,
                  address_ward: {
                        code: ward,
                        text: form.address_ward,
                  },
                  address_district: {
                        code: district,
                        text: form.address_district,
                  },
                  address_province: {
                        code: province,
                        text: form.address_province,
                  },
                  address_text: `${form.address_street} ${form.address_ward} ${form.address_district} ${form.address_province}`,
            }
            addressMutation.mutate({ payload: addressPayload })
      }

      const provinceApi = useQuery({
            queryKey: ['provinces'],
            queryFn: () => LocationService.getProvinces(),
      })

      const districtApi = useMutation({
            mutationKey: ['district'],
            mutationFn: (provinceCode: string) => LocationService.getDistrict(provinceCode),
      })

      const wardApi = useMutation({
            mutationKey: ['ward'],
            mutationFn: (districtCode: string) => LocationService.getWard(districtCode),
      })

      const renderProvinces = useMemo(() => {
            let newArray: { value: string; label: string }[] = []
            if (provinceApi.isSuccess) {
                  newArray = provinceApi.data.data.metadata.map((provinceIteam) => {
                        return {
                              value: provinceIteam.code,
                              label: provinceIteam.name,
                        }
                  })
            }
            return newArray
      }, [provinceApi.isSuccess, provinceApi.data?.data])

      const renderDistrict = useMemo(() => {
            let newArray: { value: string; label: string }[] = []
            if (districtApi.isSuccess) {
                  newArray = districtApi.data.data?.metadata.map((districtItem) => {
                        return {
                              value: districtItem.code,
                              label: districtItem.name,
                        }
                  })
            }
            return newArray
      }, [districtApi.isSuccess, districtApi.data?.data])

      const renderWard = useMemo(() => {
            let newArray: { value: string; label: string }[] = []
            if (wardApi.isSuccess) {
                  newArray = wardApi.data.data?.metadata.map((wardItem) => {
                        return {
                              value: wardItem.code,
                              label: wardItem.name,
                        }
                  })
            }
            return newArray
      }, [wardApi.isSuccess, wardApi.data?.data])

      const handleChangeProvince = (code: string) => {
            setProvince(code)
      }

      const handleChangeDistrict = (code: string) => {
            setDistrict(code)
      }

      const handleChangeWard = (code: string) => {
            setWard(code)
      }

      useEffect(() => {
            if (province) {
                  districtApi.mutate(province)
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [province])

      useEffect(() => {
            if (district) {
                  wardApi.mutate(district)
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [district])

      useEffect(() => {
            // console.log({ data: provinceApi.data?.data })
      }, [provinceApi.isSuccess, provinceApi.data?.data])

      useEffect(() => {
            if (districtApi.isSuccess) {
                  // console.log({ district: districtApi.data.data.metadata })
            }
      }, [districtApi.isSuccess, districtApi.data?.data.metadata])

      useEffect(() => {
            if (Object.keys(addressForm.formState.errors).length > 0 && addressForm.formState.isSubmitted) {
                  const renderError = (errors: FieldErrors<AddressForm>) => {
                        let text = []
                        for (let error in errors) {
                              text.push(errors[error as keyof FieldErrors<AddressForm>]?.message as string)
                        }
                        return text
                  }
                  dispatch(
                        addToast({
                              type: 'WARNNING',
                              message: 'Vui lòng điền đầy đủ thông tin',
                              subMessage: renderError(addressForm.formState.errors),
                              id: Math.random().toString(),
                        }),
                  )
                  // for (let error in addressForm.formState.errors) {
                  //       console.log(addressForm.formState.errors[error as keyof FieldErrors<AddressForm>]?.message)
                  // }
            }
      }, [addressForm.formState.errors])

      return (
            <>
                  <Portal>
                        <div
                              onClick={() => onClose && onClose(false)}
                              className='fixed inset-0 bg-[rgba(0,0,0,.9)] flex justify-center items-center z-[999]'
                        >
                              <div
                                    onClick={(e) => e.stopPropagation()}
                                    className='absolute top-0 bottom-0 w-[70vw] md:w-[40vw] p-[24px_12px] bg-color-section-theme right-0'
                              >
                                    <FormProvider {...addressForm}>
                                          <form
                                                className='relative  w-full  p-[12px]   flex flex-col gap-[20px] bg-color-section-theme text-text-theme rounded-md'
                                                onSubmit={addressForm.handleSubmit(onSubmit)}
                                                spellCheck={false}
                                          >
                                                <div className='] flex flex-col   gap-[16px]'>
                                                      <Controller
                                                            control={addressForm.control}
                                                            name='address_province'
                                                            render={({ field }) => {
                                                                  return (
                                                                        <Select
                                                                              options={renderProvinces}
                                                                              onChange={(e: string) => {
                                                                                    handleChangeProvince(e)
                                                                                    const foundNameProvince =
                                                                                          provinceApi.data?.data.metadata.find(
                                                                                                (province) => province.code === e,
                                                                                          )
                                                                                    field.onChange(foundNameProvince?.name)
                                                                              }}
                                                                              placeholder='Chọn tỉnh thành phố'
                                                                              className='w-full bg-color-section-theme border-[var(--border-color-input)] customSelect'
                                                                        />
                                                                  )
                                                            }}
                                                      />
                                                      <Controller
                                                            control={addressForm.control}
                                                            name='address_district'
                                                            render={({ field }) => {
                                                                  return (
                                                                        <Select
                                                                              options={renderDistrict}
                                                                              onChange={(e) => {
                                                                                    handleChangeDistrict(e)
                                                                                    const foundNameDistrict =
                                                                                          districtApi.data?.data.metadata.find(
                                                                                                (district) => district.code === e,
                                                                                          )
                                                                                    field.onChange(foundNameDistrict?.name)
                                                                              }}
                                                                              placeholder='Chọn quận huyện'
                                                                              className='w-full bg-color-section-theme border-[var(--border-color-input)] customSelect'
                                                                              disabled={province ? false : true}
                                                                        />
                                                                  )
                                                            }}
                                                      />

                                                      <Controller
                                                            control={addressForm.control}
                                                            name='address_ward'
                                                            render={({ field }) => {
                                                                  return (
                                                                        <Select
                                                                              options={renderWard}
                                                                              onChange={(e) => {
                                                                                    handleChangeWard(e)
                                                                                    const foundNameWard = wardApi.data?.data.metadata.find(
                                                                                          (ward) => ward.code === e,
                                                                                    )
                                                                                    field.onChange(foundNameWard?.name)
                                                                              }}
                                                                              placeholder='Chọn phường xã'
                                                                              className='w-full bg-color-section-theme border-[var(--border-color-input)] customSelect'

                                                                              // disabled={province && district ? false : true}
                                                                        />
                                                                  )
                                                            }}
                                                      />
                                                </div>

                                                <div className=''>
                                                      {/* <Controller */}
                                                      {/* control={addressForm.control} */}
                                                      {/* name='address_street' */}
                                                      {/* render={({ field }) => { */}
                                                      {/* return ( */}
                                                      <InputText
                                                            showError={false}
                                                            methods={addressForm}
                                                            FieldName='address_street'
                                                            LabelMessage='Địa chỉ cụ thể'
                                                            placehorder='Thêm thông tin về địa chỉ'
                                                            autofocus={false}
                                                            // onChange={(e) => field.onChange(e.target.value)}
                                                      />
                                                      {/* ) */}
                                                      {/* }} */}
                                                      {/* /> */}
                                                </div>
                                                <div className=''>
                                                      <Controller
                                                            control={addressForm.control}
                                                            name='address_type'
                                                            render={({ field }) => {
                                                                  return (
                                                                        <Select
                                                                              className='min-w-[200px] w-full'
                                                                              options={address_type}
                                                                              onChange={field.onChange}
                                                                              placeholder='Nơi giao hàng'
                                                                        />
                                                                  )
                                                            }}
                                                      />
                                                </div>
                                                <div className='flex justify-end gap-[8px]'>
                                                      {onClose && (
                                                            <div className='w-max h-[32px]'>
                                                                  <BoxButton
                                                                        content=' Đóng Form'
                                                                        type='submit'
                                                                        onClick={() => onClose(false)}
                                                                        className='!bg-gray-600 text-[13px]'
                                                                  />
                                                            </div>
                                                      )}
                                                      <div className='w-max h-[32px]'>
                                                            <BoxButton
                                                                  content='Cập nhập địa chỉ'
                                                                  onLoading={addressMutation.isPending}
                                                                  type='submit'
                                                                  className='! text-[13px]'
                                                            />
                                                      </div>
                                                </div>
                                          </form>
                                    </FormProvider>
                              </div>
                        </div>
                  </Portal>
            </>
      )
}

export default FormAddress
