import React, { useEffect, useRef, useState } from 'react'
import { UserAddress } from '../../types/user.type'
import BoxButton from '../../component/BoxUi/BoxButton'
import { Anchor, Building2, Home, TentTree, Trash2 } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import AccountService from '../../apis/account.service'
import { useDispatch } from 'react-redux'
import { fetchUser } from '../../Redux/authenticationSlice'
import BoxWeatherApi from '../../component/BoxUi/BoxWeatherApi'

type TProps = {
      address: UserAddress
      index: number
}

const AddressItem = (props: TProps) => {
      const { address, index } = props

      const [detailAddress, setDetailAdress] = useState<boolean>(false)
      const [loadingIframe, setLoadingIframe] = useState<boolean>(true)
      const iframeRef = useRef<HTMLIFrameElement>(null)
      const dispatch = useDispatch()

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

      const handleSetDefaultAddress = (_id: string) => {
            if (address.address_default) return
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
                  : ' border-[1px] border-color-main rounded  text-color-main hover:bg-color-main hover:text-[#fff]',
      }
      return (
            <div
                  style={{ height: detailAddress ? 'max-content !important' : '' }}
                  className='relative overflow-hidden rounded-2xl border border-slate-800/70 bg-[#11151c] text-text-theme shadow-[0_12px_35px_rgba(0,0,0,0.16)] transition-all duration-300'
                  key={address._id}
            >
                  {/* Main address content */}
                  <div className='flex flex-col gap-5 p-5 xl:p-6'>
                        <div className='flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between'>
                              {/* Address info */}
                              <div className='min-w-0 flex-1'>
                                    <div className='flex flex-wrap items-center gap-3'>
                                          <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500'>
                                                {AddressType}
                                          </div>

                                          <div className='min-w-0'>
                                                <div className='flex flex-wrap items-center gap-2'>
                                                      <h3 className='text-sm font-semibold text-white'>
                                                            Địa chỉ #{index + 1}
                                                      </h3>

                                                      <span className='rounded-full bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-400'>
                                                            {address.type === 'Home'
                                                                  ? 'Nhà'
                                                                  : address.type === 'Company'
                                                                    ? 'Công ty / cơ quan'
                                                                    : 'Nơi ở riêng tư'}
                                                      </span>

                                                      {address.address_default && (
                                                            <span className='inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-1 text-[11px] font-medium text-blue-400'>
                                                                  <Anchor size={12} />
                                                                  Mặc định
                                                            </span>
                                                      )}
                                                </div>

                                                <p className='mt-1 text-xs text-slate-500'>
                                                      Địa chỉ giao hàng đã lưu của bạn
                                                </p>
                                          </div>
                                    </div>

                                    <div className='mt-5 grid grid-cols-1 gap-4 rounded-xl border border-slate-800 bg-[#0d1117] p-4 xl:grid-cols-2'>
                                          <div>
                                                <p className='text-[11px] font-medium uppercase tracking-[0.08em] text-slate-500'>
                                                      Địa chỉ
                                                </p>

                                                <button
                                                      type='button'
                                                      className='mt-1.5 text-left text-sm font-medium leading-6 text-blue-400 transition hover:text-blue-300'
                                                      onClick={() =>
                                                            openSearchGoogle(
                                                                  address.address_street +
                                                                        ' Phường ' +
                                                                        address.address_ward.text +
                                                                        ' ' +
                                                                        address.address_district.text +
                                                                        ' ' +
                                                                        address.address_province.text,
                                                            )
                                                      }
                                                >
                                                      {address.address_street}
                                                </button>
                                          </div>

                                          <div>
                                                <p className='text-[11px] font-medium uppercase tracking-[0.08em] text-slate-500'>
                                                      Phường / Xã
                                                </p>

                                                <button
                                                      type='button'
                                                      className='mt-1.5 text-left text-sm font-medium text-blue-400 transition hover:text-blue-300'
                                                      onClick={() => openSearchGoogle(address.address_ward.text)}
                                                >
                                                      {address.address_ward.text}
                                                </button>
                                          </div>

                                          <div>
                                                <p className='text-[11px] font-medium uppercase tracking-[0.08em] text-slate-500'>
                                                      Quận / Huyện
                                                </p>

                                                <button
                                                      type='button'
                                                      className='mt-1.5 text-left text-sm font-medium text-blue-400 transition hover:text-blue-300'
                                                      onClick={() => openSearchGoogle(address.address_district.text)}
                                                >
                                                      {address.address_district.text}
                                                </button>
                                          </div>

                                          <div>
                                                <p className='text-[11px] font-medium uppercase tracking-[0.08em] text-slate-500'>
                                                      Tỉnh / Thành phố
                                                </p>

                                                <button
                                                      type='button'
                                                      className='mt-1.5 text-left text-sm font-medium text-blue-400 transition hover:text-blue-300'
                                                      onClick={() => openSearchGoogle(address.address_province.text)}
                                                >
                                                      {address.address_province.text}
                                                </button>
                                          </div>
                                    </div>
                              </div>

                              {/* Actions */}
                              <div className='flex shrink-0 flex-row gap-2 xl:flex-col xl:items-end'>
                                    <button
                                          className={`${styleEffect.btnAddressDefault} inline-flex h-10 min-w-[150px] items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium transition`}
                                          onClick={() => handleSetDefaultAddress(address._id)}
                                    >
                                          <span>{address.address_default ? 'Địa chỉ mặc định' : 'Đặt làm mặc định'}</span>
                                          {address.address_default && <Anchor size={15} />}
                                    </button>

                                    <button
                                          type='button'
                                          onClick={() => {
                                                handleDeleteAddress(address._id)
                                          }}
                                          className='inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 transition hover:bg-red-500 hover:text-white'
                                          aria-label='Xóa địa chỉ'
                                    >
                                          <Trash2 size={17} />
                                    </button>
                              </div>
                        </div>

                        {/* Detail area, logic unchanged */}
                        <div className='flex flex-col flex-wrap md:flex-row'>
                              {detailAddress && (
                                    <div className='mt-2 h-[250px] overflow-hidden rounded-xl border border-slate-800 xl:h-[300px]'>
                                          <BoxWeatherApi locationName={address.address_district.text} />
                                    </div>
                              )}

                              <div className='flex-1'>
                                    {detailAddress && (
                                          <div className='h-full'>
                                                {loadingIframe && (
                                                      <div className='h-full w-full animate-pulse rounded-xl bg-slate-800'></div>
                                                )}
                                                <iframe
                                                      ref={iframeRef}
                                                      onLoad={() => {
                                                            setLoadingIframe(false)
                                                            if (iframeRef.current) {
                                                                  iframeRef.current.style.height = '92%'
                                                            }
                                                      }}
                                                      style={{ height: 0 }}
                                                      title='address'
                                                      className='mt-[20px] w-full animate-mountComponent rounded-xl'
                                                      loading='lazy'
                                                      referrerPolicy='no-referrer-when-downgrade'
                                                ></iframe>
                                          </div>
                                    )}
                              </div>
                        </div>
                  </div>
            </div>
      )
}

export default AddressItem