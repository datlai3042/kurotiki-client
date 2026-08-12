import React, { useEffect, useRef, useState } from 'react'
import { UserAddress, UserResponse } from '../../types/user.type'
import { Anchor, Building2, Home, Pencil, TentTree, Trash2 } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import AccountService from '../../apis/account.service'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUser } from '../../Redux/authenticationSlice'
import BoxWeatherApi from '../../component/BoxUi/BoxWeatherApi'
import FormAddress from '../../forms/FormAddress'
import { RootState } from '../../store'
import TErrorAxios from '../../types/axios.response.error'
import { checkAxiosError } from '../../utils/handleAxiosError'

type TProps = {
      address: UserAddress
      index: number
      onEditAddress?: (address: UserAddress) => void
}

const AddressItem = (props: TProps) => {
      const { address, index, onEditAddress } = props

      const [detailAddress, setDetailAdress] = useState<boolean>(false)
      const [loadingIframe, setLoadingIframe] = useState<boolean>(true)
      const iframeRef = useRef<HTMLIFrameElement>(null)
      const dispatch = useDispatch()
      const [openModalAddress, setOpenModalAddress] = useState(false)
      const user = useSelector((state: RootState) => state.authentication.user) as UserResponse

      const setAddressDefaultMutation = useMutation({
            mutationKey: ['/v1/api/account/set-address-default'],
            mutationFn: (form: Pick<UserAddress, '_id'>) => AccountService.setAddressDefault(form),
            onSuccess: (axiosResponse) => {
                  const { user } = axiosResponse.data.metadata
                  dispatch(fetchUser({ user }))
            },
      })

      const deleteAddressMutation = useMutation({
            mutationKey: ['/v1/api/account/delete-address'],
            mutationFn: ({ address_id }: { address_id: string }) => AccountService.deleteAddress({ address_id }),
            onSuccess: (axiosResponse) => {
                  const { user } = axiosResponse.data.metadata

                  dispatch(fetchUser({ user }))
            },
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
      const handleSetDefaultAddress = (_id: string) => {
            if (address.address_default) {
                  if (_id === address._id) {
                        const new_payload: UserResponse = {
                              ...structuredClone(user),
                              user_address: user?.user_address?.map((address) =>
                                    address._id === _id ? { ...structuredClone(address), address_default: false } : address,
                              ),
                        }

                        updateInfo.mutate(new_payload)
                  }

                  return
            }
            setAddressDefaultMutation.mutate({ _id })
      }

      const handleDeleteAddress = (_id: string) => {
            deleteAddressMutation.mutate({ address_id: _id })
      }

      const openSearchGoogle = (address: string) => {
            window.open(
                  `https://google.com/search?q=${address}`,
                  '_blank',
                  'toolbar=yes, scrollbar=yes,resizeable=yes,top=200,left=200,width=600,height=400',
            )
      }

      useEffect(() => {
            if (iframeRef.current) {
                  const addressApi = `Phường ${address.address_ward.text} ${address.address_district.text} ${address.address_province.text}`
                  const src = `https://maps.google.com/maps?&q="+${addressApi}"&output=embed`

                  iframeRef.current.src = src
                  // console.log({state: iframeRef.current.})
            }
      }, [detailAddress])

      const AddressType = address.type === 'Home' ? <Home /> : address.type === 'Company' ? <Building2 /> : <TentTree />

      const styleEffect = {
            btnAddressDefault: address.address_default
                  ? 'animate-Custome bg-color-main text-[#fff] '
                  : ' border-[1px] border-[var(--border-color-input)] rounded  text-text-theme hover:bg-color-main hover:text-[#fff] font-semibold',
      }
      const fullAddress = `${address.address_street}, ${address.address_ward.text}, ${address.address_district.text}, ${address.address_province.text}`

      return (
            <div
                  className='relative overflow-hidden rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme text-text-theme shadow-[0_8px_28px_rgba(0,0,0,0.08)] transition-all duration-300'
                  key={address._id}
            >
                  <div className='p-4 sm:p-5 xl:p-6'>
                        {/* Header */}
                        <div className='flex items-start justify-between gap-3'>
                              <div className='flex min-w-0 items-start gap-3'>
                                    <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 tetext-blue-500'>
                                          {AddressType}
                                    </div>

                                    <div className='min-w-0'>
                                          <div className='flex flex-wrap items-center gap-2'>
                                                <h3 className='text-sm font-semibold sm:text-[15px]'>Địa chỉ #{index + 1}</h3>
                                                <span className='h-1 w-1 rounded-full bg-[#667085]' />

                                                <span className='rounded-full bg-slate-500/10 px-2.5 py-1 text-[10px] font-semibold text-text-theme'>
                                                      {address.type === 'Home'
                                                            ? 'Nhà'
                                                            : address.type === 'Company'
                                                            ? 'Công ty / cơ quan'
                                                            : 'Nơi ở riêng tư'}
                                                </span>

                                                {address.address_default && (
                                                      <span className='inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-1 text-[10px] font-semibold text-blue-500'>
                                                            <Anchor size={11} />
                                                            Mặc định
                                                      </span>
                                                )}
                                          </div>

                                          <p className='mt-1 text-[11px] text-slate-500 sm:text-xs'>Địa chỉ giao hàng đã lưu của bạn</p>
                                          <div className='mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-text-theme'>
                                                <span className='font-medium '>
                                                      {address?.address_receiver_name || 'Chưa thiết lập người nhận'}
                                                </span>
                                                <span className='h-1 w-1 rounded-full bg-[#667085]' />
                                                <span>{address?.address_receiver_tel || 'Chưa thiết lập SĐT nhận'}</span>

                                                <span className='h-1 w-1 rounded-full bg-[#667085]' />

                                                <div className='flex gap-x-2'>
                                                      <span>Email nhận hóa đơn điện tử: </span>
                                                      <span>{address?.address_email_vat || 'null'}</span>
                                                </div>
                                          </div>
                                    </div>
                              </div>

                              <div className='flex shrink-0 items-center gap-2'>
                                    <button
                                          type='button'
                                          onClick={() => setOpenModalAddress(true)}
                                          className='flex h-9 w-9 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-500 transition hover:bg-blue-500 hover:text-white'
                                          aria-label='Chỉnh sửa địa chỉ'
                                          title='Chỉnh sửa địa chỉ'
                                    >
                                          <Pencil size={16} />
                                    </button>

                                    <button
                                          type='button'
                                          onClick={() => handleDeleteAddress(address._id)}
                                          disabled={deleteAddressMutation.isPending}
                                          className='flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50'
                                          aria-label='Xóa địa chỉ'
                                          title='Xóa địa chỉ'
                                    >
                                          <Trash2 size={16} />
                                    </button>
                              </div>
                        </div>

                        {/* Main address */}
                        <button
                              type='button'
                              onClick={() => openSearchGoogle(fullAddress)}
                              className='group mt-5 flex w-full items-start gap-3 rounded-xl border border-[var(--border-color-input)] bg-slate-500/[0.025] p-4 text-left transition hover:border-blue-500/30 hover:bg-blue-500/[0.035]'
                        >
                              <div className='mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500'>
                                    <Home size={17} />
                              </div>

                              <div className='min-w-0'>
                                    <p className='text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400'>Địa chỉ đầy đủ</p>

                                    <p className='mt-1 text-[13px] font-semibold leading-5 text-text-theme transition group-hover:text-blue-500 sm:text-sm'>
                                          {address.address_street}, {address.address_ward.text}, {address.address_district.text}
                                    </p>

                                    <p className='mt-0.5 text-[12px] text-slate-500 sm:text-[13px]'>{address.address_province.text}</p>
                              </div>
                        </button>

                        {/* Address details */}
                        <div className='mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3'>
                              <button
                                    type='button'
                                    onClick={() => openSearchGoogle(address.address_ward.text)}
                                    className='rounded-xl border border-[var(--border-color-input)] p-3 text-left transition hover:border-blue-500/30 hover:bg-blue-500/[0.03]'
                              >
                                    <p className='text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400'>Phường / Xã</p>
                                    <p className='mt-1.5 truncate text-[12px] font-medium text-blue-500 sm:text-[13px]'>
                                          {address.address_ward.text}
                                    </p>
                              </button>

                              <button
                                    type='button'
                                    onClick={() => openSearchGoogle(address.address_district.text)}
                                    className='rounded-xl border border-[var(--border-color-input)] p-3 text-left transition hover:border-blue-500/30 hover:bg-blue-500/[0.03]'
                              >
                                    <p className='text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400'>Quận / Huyện</p>
                                    <p className='mt-1.5 truncate text-[12px] font-medium text-blue-500 sm:text-[13px]'>
                                          {address.address_district.text}
                                    </p>
                              </button>

                              <button
                                    type='button'
                                    onClick={() => openSearchGoogle(address.address_province.text)}
                                    className='rounded-xl border border-[var(--border-color-input)] p-3 text-left transition hover:border-blue-500/30 hover:bg-blue-500/[0.03]'
                              >
                                    <p className='text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400'>Tỉnh / Thành phố</p>
                                    <p className='mt-1.5 truncate text-[12px] font-medium text-blue-500 sm:text-[13px]'>
                                          {address.address_province.text}
                                    </p>
                              </button>
                        </div>

                        {/* Actions */}
                        <div className='mt-4 flex flex-col-reverse gap-2 border-t border-[var(--border-color-input)] pt-4 sm:flex-row sm:items-center sm:justify-between'>
                              <button
                                    type='button'
                                    onClick={() => setDetailAdress((prev) => !prev)}
                                    className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-4 text-xs font-medium transition sm:justify-start ${
                                          detailAddress
                                                ? 'border-blue-500/30 bg-blue-500/10 text-blue-500'
                                                : 'border-[var(--border-color-input)] text-slate-500 hover:border-blue-500/30 hover:text-blue-500'
                                    }`}
                              >
                                    <TentTree size={15} />
                                    {detailAddress ? 'Ẩn thông tin khu vực' : 'Xem vị trí & khu vực'}
                              </button>

                              <button
                                    type='button'
                                    className={`${styleEffect.btnAddressDefault} inline-flex h-10 items-center justify-center gap-2  rounded-xl px-4 text-xs font-semibold transition sm:min-w-[160px]`}
                                    onClick={() => handleSetDefaultAddress(address._id)}
                                    disabled={setAddressDefaultMutation.isPending}
                              >
                                    {address.address_default ? (
                                          <>
                                                <Anchor size={14} />
                                                Bỏ làm địa chỉ mặc định
                                          </>
                                    ) : (
                                          `Đặt làm mặc định`
                                    )}
                              </button>
                        </div>

                        {/* Expandable area */}
                        {detailAddress && (
                              <div className='mt-4 grid animate-mountComponent grid-cols-1 gap-3 border-t border-[var(--border-color-input)] pt-4 lg:grid-cols-2'>
                                    <div className='min-h-[240px] overflow-hidden rounded-xl border border-[var(--border-color-input)]'>
                                          <BoxWeatherApi locationName={address.address_district.text} />
                                    </div>

                                    <div className='relative min-h-[240px] overflow-hidden rounded-xl border border-[var(--border-color-input)] bg-slate-500/5'>
                                          {loadingIframe && <div className='absolute inset-0 z-[1] animate-pulse bg-slate-500/10' />}

                                          <iframe
                                                ref={iframeRef}
                                                onLoad={() => setLoadingIframe(false)}
                                                title='address'
                                                className='h-[240px] w-full'
                                                loading='lazy'
                                                referrerPolicy='no-referrer-when-downgrade'
                                          />
                                    </div>
                              </div>
                        )}
                  </div>

                  {openModalAddress && (
                        <div className='mt-4 rounded-[10px] border border-white/[0.08] bg-[#11151c] p-3'>
                              <FormAddress
                                    address={address}
                                    mode='update'
                                    // onSuccessAddAddress={onSuccessAddAddress}
                                    onClose={() => {
                                          setOpenModalAddress(false)
                                    }}
                              />
                        </div>
                  )}
            </div>
      )
}

export default AddressItem
