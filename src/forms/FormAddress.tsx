import { zodResolver } from '@hookform/resolvers/zod'
import React, { SetStateAction, useEffect, useMemo, useState } from 'react'
import { Controller, FieldErrors, FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Select } from 'antd'
import { Building2, Home, MapPin, Navigation, TentTree, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'

import { addressSchemaForm } from '../schema/addressForm.schema'
import { UserAddress, UserResponse } from '../types/user.type'
import LocationService from '../apis/location.api'
import InputText from '../Customer/Sell/components/InputText'
import BoxButton from '../component/BoxUi/BoxButton'
import { addToast } from '../Redux/toast'
import AccountService from '../apis/account.service'
import { doOpenBoxLogin, fetchUser } from '../Redux/authenticationSlice'
import { RootState } from '../store'
import { Address } from '../types/address.type'
import Portal from '../component/Portal'
import { checkAxiosError } from '../utils/handleAxiosError'
import TErrorAxios from '../types/axios.response.error'

export type AddressForm = {
      address_receiver_name: string
      address_receiver_tel: string
      address_email_vat: string
      address_type: 'Home' | 'Company' | 'Private'
      address_street: string
      address_ward: string
      address_district: string
      address_province: string
}

const defaultValues: AddressForm = {
      address_receiver_name: '',
      address_receiver_tel: '',
      address_email_vat: '',
      address_type: 'Home',
      address_street: '',
      address_ward: '',
      address_district: '',
      address_province: '',
}

type TProps = {
      mode?: 'create' | 'update'
      address?: UserAddress
      onSuccessAddAddress?: (id: string) => void
      onSuccessUpdateAddress?: (address: UserAddress) => void
      iconClose?: React.ReactNode
      onClose?: React.Dispatch<SetStateAction<boolean>>
}

const FormAddress = (props: TProps) => {
      const { mode = 'create', address, onSuccessAddAddress, onSuccessUpdateAddress, iconClose, onClose } = props

      const dispatch = useDispatch()
      const isUpdateMode = mode === 'update' && !!address
      const [province, setProvince] = useState<string>('')
      const [district, setDistrict] = useState<string>('')
      const [ward, setWard] = useState<string>('')
      const user = useSelector((state: RootState) => state.authentication.user) as UserResponse

      const addressForm = useForm<AddressForm>({
            defaultValues: isUpdateMode
                  ? {
                          address_receiver_name: address.address_receiver_name || '',
                          address_receiver_tel: address.address_receiver_tel || '',
                          address_email_vat: address.address_email_vat || '',
                          address_type: address.type,
                          address_street: address.address_street,
                          address_ward: address.address_ward.text,
                          address_district: address.address_district.text,
                          address_province: address.address_province.text,
                    }
                  : defaultValues,
            resolver: zodResolver(addressSchemaForm),
      })
      const updateInfo = useMutation({
            mutationKey: ['update-info'],
            mutationFn: (data: any) => AccountService.updateInfo(data),
            onSuccess: async (data: any) => {
                  // console.log('dispatch', { data })
                  dispatch(fetchUser({ user: data.data.metadata.user }))
                  // setShowToast((prev) => !prev)
            },

            onError: async (error) => {
                  //@[shape] :: error.response.data.error
                  if (checkAxiosError<TErrorAxios>(error)) {
                        if (error.response?.data?.code === 403 && error.response.data.message === 'Forbidden') {
                              // setShowToast(true)
                        }

                        if (error.response?.data?.code === 400 && error.response.data.message === 'Bad Request') {
                              // setShowToast(true)
                        }
                  }
            },
      })
      const {
            control,
            handleSubmit,
            setValue,
            reset,
            formState: { errors, isSubmitted },
      } = addressForm

      const addressMutation = useMutation({
            mutationKey: [isUpdateMode ? '/v1/api/account/update-address' : '/v1/api/account/add-address', address?._id],

            mutationFn: async ({ payload }: { payload: Address }) => {
                  if (isUpdateMode && address) {
                        const updatedAddress = user.user_address.map((addressItem: UserAddress) =>
                              addressItem._id === address._id
                                    ? {
                                            ...addressItem,
                                            ...payload,
                                            _id: addressItem._id,
                                      }
                                    : addressItem,
                        )

                        const newPayload: UserResponse = {
                              ...structuredClone(user),
                              user_address: updatedAddress,
                        }

                        return await updateInfo.mutateAsync(newPayload)
                  }

                  return AccountService.addAddress({ payload })
            },

            onSuccess: (axiosResponse) => {
                  const { user } = axiosResponse.data.metadata

                  dispatch(fetchUser({ user }))

                  dispatch(
                        addToast({
                              id: Math.random().toString(),
                              type: 'SUCCESS',
                              message: isUpdateMode ? 'Cập nhật địa chỉ thành công' : 'Thêm địa chỉ thành công',
                        }),
                  )

                  if (isUpdateMode && address) {
                        const updatedAddress = user.user_address.find((addressItem: UserAddress) => addressItem._id === address._id)

                        if (updatedAddress) {
                              onSuccessUpdateAddress?.(updatedAddress)
                        }
                  } else {
                        onSuccessAddAddress?.(user.user_address[user.user_address.length - 1]._id)
                  }

                  onClose?.(false)
            },
      })
    
      const onSubmit: SubmitHandler<AddressForm> = (form) => {
            if (!user) {
                  dispatch(doOpenBoxLogin())
                  return
            }
            const addressPayload: Address & {
                  address_receiver_name: string
                  address_receiver_tel: string
                  address_email_vat: string
            } = {
                  address_receiver_name: form.address_receiver_name,
                  address_receiver_tel: form.address_receiver_tel,
                  address_email_vat: form.address_email_vat,
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

      useEffect(() => {
            if (!isUpdateMode) return

            setProvince(address.address_province.code)
            setDistrict(address.address_district.code)
            setWard(address.address_ward.code)

            reset({
                  address_receiver_name: address.address_receiver_name || '',
                  address_receiver_tel: address.address_receiver_tel || '',
                  address_email_vat: address.address_email_vat || '',
                  address_type: address.type,
                  address_street: address.address_street,
                  address_ward: address.address_ward.text,
                  address_district: address.address_district.text,
                  address_province: address.address_province.text,
            })
      }, [address, isUpdateMode, reset])

      const renderProvinces = useMemo(() => {
            if (!provinceApi.isSuccess) return []

            return provinceApi.data.data.metadata.map((provinceItem) => ({
                  value: provinceItem.code,
                  label: provinceItem.name,
            }))
      }, [provinceApi.isSuccess, provinceApi.data?.data])

      const renderDistrict = useMemo(() => {
            if (!districtApi.isSuccess) return []

            return districtApi.data.data?.metadata.map((districtItem) => ({
                  value: districtItem.code,
                  label: districtItem.name,
            }))
      }, [districtApi.isSuccess, districtApi.data?.data])

      const renderWard = useMemo(() => {
            if (!wardApi.isSuccess) return []

            return wardApi.data.data?.metadata.map((wardItem) => ({
                  value: wardItem.code,
                  label: wardItem.name,
            }))
      }, [wardApi.isSuccess, wardApi.data?.data])

      const handleChangeProvince = (code: string) => {
            setProvince(code)
            setDistrict('')
            setWard('')

            setValue('address_district', '')
            setValue('address_ward', '')
      }

      const handleChangeDistrict = (code: string) => {
            setDistrict(code)
            setWard('')

            setValue('address_ward', '')
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
            console.log({ errors, isSubmitted })
            if (Object.keys(errors).length > 0 && isSubmitted) {
                  const renderError = (formErrors: FieldErrors<AddressForm>) => {
                        const text: string[] = []

                        for (const error in formErrors) {
                              text.push(formErrors[error as keyof FieldErrors<AddressForm>]?.message as string)
                        }

                        return text
                  }

                  dispatch(
                        addToast({
                              type: 'WARNNING',
                              message: 'Vui lòng điền đầy đủ thông tin',
                              subMessage: renderError(errors),
                              id: Math.random().toString(),
                        }),
                  )
            }
      }, [errors, isSubmitted, dispatch])

      const closeForm = () => {
            if (onClose) {
                  onClose(false)
            }
      }

      return (
            <Portal>
                  <div
                        onClick={closeForm}
                        className='fixed inset-0 z-[999] flex justify-end bg-black/60 backdrop-blur-[3px]'
                  >
                        <aside
                              onClick={(e) => e.stopPropagation()}
                              className='flex h-full w-full flex-col border-l border-[var(--border-color-input)] bg-color-section-theme text-text-theme shadow-[-16px_0_48px_rgba(0,0,0,0.22)] sm:max-w-[520px]'
                        >
                              {/* Header */}
                              <div className='flex items-center justify-between border-b border-[var(--border-color-input)] px-5 py-4 sm:px-6'>
                                    <div className='flex min-w-0 items-center gap-3'>
                                          <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500'>
                                                <MapPin size={20} />
                                          </div>

                                          <div className='min-w-0'>
                                                <h2 className='text-base font-semibold sm:text-lg'>
                                                      {isUpdateMode ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
                                                </h2>
                                                <p className='mt-0.5 truncate text-[11px] text-slate-400 sm:text-xs'>
                                                      {isUpdateMode
                                                            ? 'Cập nhật thông tin giao hàng đã lưu.'
                                                            : 'Lưu địa chỉ để thanh toán nhanh hơn.'}
                                                </p>
                                          </div>
                                    </div>

                                    {onClose && (
                                          <button
                                                type='button'
                                                onClick={closeForm}
                                                className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border-color-input)] text-slate-400 transition hover:bg-slate-500/10 hover:text-text-theme'
                                                aria-label='Đóng'
                                          >
                                                {iconClose || <X size={18} />}
                                          </button>
                                    )}
                              </div>

                              <FormProvider {...addressForm}>
                                    <form
                                          className='flex min-h-0 flex-1 flex-col'
                                          onSubmit={handleSubmit(onSubmit)}
                                          spellCheck={false}
                                    >
                                          <div className='min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6'>
                                                <div className='space-y-6'>
                                                      {/* Recipient */}
                                                      <section>
                                                            <div className='mb-3 flex items-center gap-2'>
                                                                  <span className='flex h-6 w-6 items-center justify-center rounded-md bg-blue-500/10 text-[10px] font-bold text-blue-500'>
                                                                        01
                                                                  </span>
                                                                  <h3 className='text-sm font-semibold'>Người nhận</h3>
                                                            </div>

                                                            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                                                                  <div>
                                                                        <InputText
                                                                              showError={false}
                                                                              methods={addressForm}
                                                                              FieldName='address_receiver_name'
                                                                              LabelMessage='Họ và tên'
                                                                              placehorder='Nhập tên người nhận'
                                                                              autofocus={false}
                                                                        />
                                                                        {errors.address_receiver_name && (
                                                                              <p className='mt-1 text-[11px] text-red-500'>
                                                                                    {errors.address_receiver_name.message}
                                                                              </p>
                                                                        )}
                                                                  </div>

                                                                  <div>
                                                                        <InputText
                                                                              showError={false}
                                                                              methods={addressForm}
                                                                              FieldName='address_receiver_tel'
                                                                              LabelMessage='Số điện thoại'
                                                                              placehorder='0901 234 567'
                                                                              autofocus={false}
                                                                        />
                                                                        {errors.address_receiver_tel && (
                                                                              <p className='mt-1 text-[11px] text-red-500'>
                                                                                    {errors.address_receiver_tel.message}
                                                                              </p>
                                                                        )}
                                                                  </div>
                                                            </div>

                                                            <div className='mt-3'>
                                                                  <InputText
                                                                        showError={false}
                                                                        methods={addressForm}
                                                                        FieldName='address_email_vat'
                                                                        LabelMessage='Email hóa đơn VAT'
                                                                        placehorder='invoice@email.com'
                                                                        autofocus={false}
                                                                  />
                                                                  {errors.address_email_vat && (
                                                                        <p className='mt-1 text-[11px] text-red-500'>
                                                                              {errors.address_email_vat.message}
                                                                        </p>
                                                                  )}
                                                            </div>
                                                      </section>

                                                      {/* Location */}
                                                      <section className='rounded-2xl border border-[var(--border-color-input)] bg-slate-500/[0.025] p-4'>
                                                            <div className='mb-4 flex items-center gap-2'>
                                                                  <Navigation size={16} className='text-blue-500' />
                                                                  <div>
                                                                        <h3 className='text-sm font-semibold'>Khu vực giao hàng</h3>
                                                                        <p className='mt-0.5 text-[11px] text-slate-400'>
                                                                              Chọn lần lượt tỉnh, quận/huyện và phường/xã.
                                                                        </p>
                                                                  </div>
                                                            </div>

                                                            <div className='grid gap-3'>
                                                                  <Controller
                                                                        control={control}
                                                                        name='address_province'
                                                                        render={({ field }) => (
                                                                              <div>
                                                                                    <label className='mb-1.5 block text-[11px] font-medium text-slate-400'>
                                                                                          Tỉnh / Thành phố
                                                                                    </label>
                                                                                    <Select
                                                                                          showSearch
                                                                                          optionFilterProp='label'
                                                                                          value={province || undefined}
                                                                                          options={renderProvinces}
                                                                                          loading={provinceApi.isLoading}
                                                                                          onChange={(code: string) => {
                                                                                                handleChangeProvince(code)
                                                                                                const foundNameProvince =
                                                                                                      provinceApi.data?.data.metadata.find(
                                                                                                            (provinceItem) =>
                                                                                                                  provinceItem.code === code,
                                                                                                      )
                                                                                                field.onChange(foundNameProvince?.name)
                                                                                          }}
                                                                                          placeholder='Chọn tỉnh / thành phố'
                                                                                          className='customSelect h-10 w-full [&_.ant-select-selector]:!h-10 [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!items-center [&_.ant-select-selection-item]:!leading-[38px] [&_.ant-select-selection-placeholder]:!leading-[38px]'
                                                                                    />
                                                                                    {errors.address_province && (
                                                                                          <p className='mt-1 text-[11px] text-red-500'>
                                                                                                {errors.address_province.message}
                                                                                          </p>
                                                                                    )}
                                                                              </div>
                                                                        )}
                                                                  />

                                                                  <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                                                                        <Controller
                                                                              control={control}
                                                                              name='address_district'
                                                                              render={({ field }) => (
                                                                                    <div>
                                                                                          <label className='mb-1.5 block text-[11px] font-medium text-slate-400'>
                                                                                                Quận / Huyện
                                                                                          </label>
                                                                                          <Select
                                                                                                showSearch
                                                                                                optionFilterProp='label'
                                                                                                value={district || undefined}
                                                                                                options={renderDistrict}
                                                                                                loading={districtApi.isPending}
                                                                                                disabled={!province}
                                                                                                onChange={(code: string) => {
                                                                                                      handleChangeDistrict(code)
                                                                                                      const foundNameDistrict =
                                                                                                            districtApi.data?.data.metadata.find(
                                                                                                                  (districtItem) =>
                                                                                                                        districtItem.code === code,
                                                                                                            )
                                                                                                      field.onChange(foundNameDistrict?.name)
                                                                                                }}
                                                                                                placeholder={
                                                                                                      province
                                                                                                            ? 'Chọn quận / huyện'
                                                                                                            : 'Chọn tỉnh trước'
                                                                                                }
                                                                                                className='customSelect h-10 w-full [&_.ant-select-selector]:!h-10 [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!items-center [&_.ant-select-selection-item]:!leading-[38px] [&_.ant-select-selection-placeholder]:!leading-[38px]'
                                                                                          />
                                                                                          {errors.address_district && (
                                                                                                <p className='mt-1 text-[11px] text-red-500'>
                                                                                                      {errors.address_district.message}
                                                                                                </p>
                                                                                          )}
                                                                                    </div>
                                                                              )}
                                                                        />

                                                                        <Controller
                                                                              control={control}
                                                                              name='address_ward'
                                                                              render={({ field }) => (
                                                                                    <div>
                                                                                          <label className='mb-1.5 block text-[11px] font-medium text-slate-400'>
                                                                                                Phường / Xã
                                                                                          </label>
                                                                                          <Select
                                                                                                showSearch
                                                                                                optionFilterProp='label'
                                                                                                value={ward || undefined}
                                                                                                options={renderWard}
                                                                                                loading={wardApi.isPending}
                                                                                                disabled={!district}
                                                                                                onChange={(code: string) => {
                                                                                                      handleChangeWard(code)
                                                                                                      const foundNameWard =
                                                                                                            wardApi.data?.data.metadata.find(
                                                                                                                  (wardItem) =>
                                                                                                                        wardItem.code === code,
                                                                                                            )
                                                                                                      field.onChange(foundNameWard?.name)
                                                                                                }}
                                                                                                placeholder={
                                                                                                      district
                                                                                                            ? 'Chọn phường / xã'
                                                                                                            : 'Chọn quận / huyện trước'
                                                                                                }
                                                                                                className='customSelect h-10 w-full [&_.ant-select-selector]:!h-10 [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!items-center [&_.ant-select-selection-item]:!leading-[38px] [&_.ant-select-selection-placeholder]:!leading-[38px]'
                                                                                          />
                                                                                          {errors.address_ward && (
                                                                                                <p className='mt-1 text-[11px] text-red-500'>
                                                                                                      {errors.address_ward.message}
                                                                                                </p>
                                                                                          )}
                                                                                    </div>
                                                                              )}
                                                                        />
                                                                  </div>
                                                            </div>
                                                      </section>

                                                      {/* Street */}
                                                      <section>
                                                            <div className='mb-3 flex items-center gap-2'>
                                                                  <MapPin size={16} className='text-blue-500' />
                                                                  <h3 className='text-sm font-semibold'>Địa chỉ cụ thể</h3>
                                                            </div>

                                                            <InputText
                                                                  showError={false}
                                                                  methods={addressForm}
                                                                  FieldName='address_street'
                                                                  LabelMessage='Số nhà, tên đường'
                                                                  placehorder='Ví dụ: 123 Nguyễn Huệ'
                                                                  autofocus={false}
                                                            />
                                                            {errors.address_street && (
                                                                  <p className='mt-1 text-[11px] text-red-500'>
                                                                        {errors.address_street.message}
                                                                  </p>
                                                            )}
                                                      </section>

                                                      {/* Type */}
                                                      <section>
                                                            <div className='mb-3'>
                                                                  <h3 className='text-sm font-semibold'>Loại địa chỉ</h3>
                                                                  <p className='mt-0.5 text-[11px] text-slate-400'>
                                                                        Giúp bạn nhận biết nhanh địa chỉ khi thanh toán.
                                                                  </p>
                                                            </div>

                                                            <Controller
                                                                  control={control}
                                                                  name='address_type'
                                                                  render={({ field }) => (
                                                                        <div className='grid grid-cols-3 gap-2'>
                                                                              {[
                                                                                    { value: 'Home', label: 'Nhà', icon: <Home size={16} /> },
                                                                                    {
                                                                                          value: 'Company',
                                                                                          label: 'Công ty',
                                                                                          icon: <Building2 size={16} />,
                                                                                    },
                                                                                    {
                                                                                          value: 'Private',
                                                                                          label: 'Riêng tư',
                                                                                          icon: <TentTree size={16} />,
                                                                                    },
                                                                              ].map((item) => (
                                                                                    <button
                                                                                          key={item.value}
                                                                                          type='button'
                                                                                          onClick={() => field.onChange(item.value)}
                                                                                          className={`flex h-10 items-center justify-center gap-2 rounded-lg border px-2 text-xs font-medium transition ${
                                                                                                field.value === item.value
                                                                                                      ? 'border-blue-500 bg-blue-500/10 text-blue-500'
                                                                                                      : 'border-[var(--border-color-input)] text-slate-400 hover:border-blue-500/40 hover:text-text-theme'
                                                                                          }`}
                                                                                    >
                                                                                          {item.icon}
                                                                                          <span className='truncate'>{item.label}</span>
                                                                                    </button>
                                                                              ))}
                                                                        </div>
                                                                  )}
                                                            />
                                                      </section>
                                                </div>
                                          </div>

                                          {/* Footer */}
                                          <div className='border-t border-[var(--border-color-input)] bg-color-section-theme px-5 py-3 sm:px-6'>
                                                <div className='flex items-center justify-end gap-2'>
                                                      {onClose && (
                                                            <button
                                                                  type='button'
                                                                  onClick={closeForm}
                                                                  className='h-10 rounded-lg border border-[var(--border-color-input)] px-5 text-sm font-medium text-slate-400 transition hover:bg-slate-500/10 hover:text-text-theme'
                                                            >
                                                                  Hủy
                                                            </button>
                                                      )}

                                                      <button
                                                            type='submit'
                                                            disabled={addressMutation.isPending}
                                                            className='flex h-10 min-w-[150px] items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60'
                                                      >
                                                            {addressMutation.isPending
                                                                  ? isUpdateMode
                                                                        ? 'Đang cập nhật...'
                                                                        : 'Đang thêm...'
                                                                  : isUpdateMode
                                                                    ? 'Lưu thay đổi'
                                                                    : 'Thêm địa chỉ'}
                                                      </button>
                                                </div>
                                          </div>
                                    </form>
                              </FormProvider>
                        </aside>
                  </div>
            </Portal>
      )
}

export default FormAddress