import React, { SetStateAction, useState } from 'react'
import { LockKeyhole, Plus, X } from 'lucide-react'
import { Radio, RadioChangeEvent } from 'antd'
import Portal from '../../Portal'
import FormAddress from '../../../forms/FormAddress'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { UserAddress, UserResponse } from '../../../types/user.type'
import { renderStringAddressDetailV2 } from '../../../utils/address.util'
import { AddressType, CartCurrent, setAddressProduct } from '../../../Redux/cartSlice'
import { addToast } from '../../../Redux/toast'
import { CartProduct } from '../../../types/cart.type'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import CartService from '../../../apis/cart.service'
import { Address } from '../../../types/address.type'
import AccountService from '../../../apis/account.service'
import { fetchUser } from '../../../Redux/authenticationSlice'

type TProps = {
      setOpenModal: React.Dispatch<SetStateAction<boolean>>
      product_id?: string
      mode?: 'Select' | 'Update' | 'User'
      cart_item?: CartProduct
}

const BoxConfirmAddress = (props: TProps) => {
      const user = useSelector((state: RootState) => state.authentication.user) as UserResponse
      const cartCurrent = useSelector((state: RootState) => state.cartSlice.cart_current) as CartCurrent
      const { setOpenModal, product_id, mode = 'Select', cart_item } = props
      const queryClient = useQueryClient()

      const address_default = (user?.user_address && user?.user_address.filter((address) => address.address_default === true)) || ''

      const updateAddressCart = useMutation({
            mutationKey: ['/v1/api/cart/update-cart'],
            mutationFn: ({ product_id, address_full }: { product_id: string; address_full: Address }) =>
                  CartService.updateAddresCart({ address_full, product_id }),
            onSuccess: () => {
                  queryClient.invalidateQueries({
                        queryKey: ['v1/api/cart/cart-get-my-cart'],
                  })
                  setOpenModal(false)
            },
      })

      const setAddressDefaultMutation = useMutation({
            mutationKey: ['/v1/api/account/set-address-default'],
            mutationFn: (form: Pick<UserAddress, '_id'>) => AccountService.setAddressDefault(form),
            onSuccess: (axiosResponse) => {
                  const { user } = axiosResponse.data.metadata
                  dispatch(fetchUser({ user }))
                  dispatch(addToast({ id: Math.random().toString(), message: 'Cập nhập địa chỉ thành công', type: 'SUCCESS' }))
                  handleCloseModal()
            },
      })

      const dispatch = useDispatch()

      const [valueAddress, setValueAddress] = useState<string>(() => {
            if (mode === 'Update') {
                  let foundId = user.user_address.find((address) =>
                        address.address_text.includes(cart_item?.cart_address.address_text as string),
                  )
                  return foundId?._id as string
            }

            return cartCurrent.cart_current_address_id || address_default[0]?._id || ''
      })

      const [addNew, setAddNew] = useState<boolean>(false)

      const handleCloseModal = () => {
            setOpenModal(false)
      }

      const onSuccessAddAddress = (id: string) => {
            setAddNew(true)
            setValueAddress(id)
      }

      const onVerifyAddress = () => {
            if (!valueAddress) {
                  dispatch(
                        addToast({
                              type: 'WARNNING',
                              message: `Vui lòng  ${
                                    user?.user_address.length ? `chọn 1 trong ${user?.user_address.length}` : 'chọn '
                              } địa chỉ`,
                              id: Math.random().toString(),
                        }),
                  )
                  return
            }

            if (mode === 'User') {
                  const addressSelector = user?.user_address.find((address) => address._id === valueAddress) as UserAddress
                  setAddressDefaultMutation.mutate({ _id: addressSelector._id })
                  return
                  // return
            }

            if (mode === 'Update') {
                  const addressSelector = user?.user_address.find((address) => address._id === valueAddress) as UserAddress
                  updateAddressCart.mutate({
                        product_id: product_id || '',
                        address_full: {
                              // cart_current_product_id: product_id as string,
                              address_street: renderStringAddressDetailV2(addressSelector as UserAddress) || '',

                              address_text: renderStringAddressDetailV2(addressSelector as UserAddress) || '',
                              type: addressSelector?.type as AddressType,
                              // cart_current_address_id: address_default._id,
                              address_ward: {
                                    code: addressSelector.address_ward.code,
                                    text: addressSelector.address_ward.text,
                              },
                              address_district: {
                                    code: addressSelector.address_district.code,
                                    text: addressSelector.address_district.text,
                              },
                              address_province: {
                                    code: addressSelector.address_province.code,
                                    text: addressSelector.address_province.text,
                              },
                        },
                  })
                  return
            }

            const address_default = user?.user_address.find((address) => address._id === valueAddress)
            if (address_default) {
                  dispatch(
                        setAddressProduct({
                              cart_current_product_id: product_id as string,
                              cart_current_address: renderStringAddressDetailV2(address_default as UserAddress) || '',
                              cart_current_address_type: address_default?.type as AddressType,
                              cart_current_address_id: address_default._id,
                              cart_current_address_ward: {
                                    code: address_default.address_ward.code,
                                    text: address_default.address_ward.text,
                              },
                              cart_current_address_district: {
                                    code: address_default.address_district.code,
                                    text: address_default.address_district.text,
                              },
                              cart_current_address_province: {
                                    code: address_default.address_province.code,
                                    text: address_default.address_province.text,
                              },
                              // address: renderStringAddressDetail(foundAddress as UserAddress) || '',
                              // product_id: product_id,
                              // address_type: foundAddress?.type as AddressType,
                              // address_id: foundAddress?._id as string,
                        }),
                  )
            }
            setOpenModal(false)
      }

      const handleChangeRadio = (e: RadioChangeEvent) => {
            setValueAddress(e.target.value)
      }

      const renderAddressType = (type?: UserAddress['type']) => {
            switch (type) {
                  case 'Home':
                        return 'Nhà riêng'
                  case 'Company':
                        return 'Cơ quan'
                  case 'Private':
                        return 'Nơi ở riêng'
                  default:
                        return ''
            }
      }

      const receiverName = user?.fullName || user?.nickName || user?.email || 'Chưa cập nhật tên'
      const userContact = user as UserResponse & {
            phone?: string
            phoneNumber?: string
            user_phone?: string
      }
      const receiverPhone = userContact?.phone || userContact?.phoneNumber || userContact?.user_phone || 'Chưa cập nhật SĐT'

      return (
            <Portal>
                  <div className='fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-4 backdrop-blur-[2px]'>
                        <div className='relative flex max-h-[92vh] w-full max-w-[760px] flex-col overflow-hidden rounded-[12px] border border-white/[0.08] bg-[#151922] text-text-theme shadow-[0_24px_80px_rgba(0,0,0,0.55)]'>
                              <div className='flex items-start justify-between border-b border-white/[0.08] px-6 py-5'>
                                    <div className='pr-10'>
                                          <h2 className='text-[20px] font-semibold leading-[28px] text-white'>Chọn địa chỉ giao hàng</h2>
                                          <p className='mt-1 text-[13px] leading-5 text-[#9aa4b2]'>
                                                Vui lòng chọn địa chỉ nhận hàng để được dự báo thời gian giao hàng chính xác nhất.
                                          </p>
                                    </div>

                                    <button
                                          type='button'
                                          onClick={handleCloseModal}
                                          className='absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-lg text-[#9aa4b2] transition hover:bg-white/[0.06] hover:text-white'
                                    >
                                          <X size={19} strokeWidth={1.8} />
                                    </button>
                              </div>

                              <div className='min-h-0 flex-1 overflow-y-auto px-6 py-5 scrollCustome'>
                                    <div className='mb-3 text-[12px] font-semibold uppercase tracking-[0.04em] text-[#9aa4b2]'>
                                          Địa chỉ của tôi
                                    </div>

                                    <Radio.Group
                                          className='flex w-full flex-col gap-2.5'
                                          onChange={handleChangeRadio}
                                          value={valueAddress}
                                          defaultValue={valueAddress}
                                    >
                                          {user?.user_address.map((address, index) => {
                                                const isSelected = valueAddress === address._id
                                                const addressType = renderAddressType(address.type)

                                                return (
                                                      <label
                                                            key={address._id}
                                                            className={`group flex cursor-pointer items-center gap-4 rounded-[10px] border px-4 py-4 transition-all duration-150 ${
                                                                  isSelected
                                                                        ? 'border-[#1677ff] bg-[#1677ff]/[0.06] shadow-[0_0_0_1px_rgba(22,119,255,0.12)]'
                                                                        : 'border-white/[0.09] bg-[#171c25] hover:border-white/[0.16] hover:bg-[#1a202a]'
                                                            }`}
                                                      >
                                                            <Radio value={address._id} className='shrink-0' />

                                                            <div className='min-w-0 flex-1'>
                                                                  <div className='flex flex-wrap items-center gap-2'>
                                                                        {address.address_default && (
                                                                              <span className='rounded-md bg-[#1677ff]/15 px-2 py-0.5 text-[11px] font-medium text-[#4d9cff]'>
                                                                                    Mặc định
                                                                              </span>
                                                                        )}

                                                                        {addNew && user?.user_address.length === index + 1 && (
                                                                              <span className='rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400'>
                                                                                    Mới
                                                                              </span>
                                                                        )}

                                                                        <p className='min-w-0 text-[14px] font-semibold leading-5 text-[#f1f5f9]'>
                                                                              {renderStringAddressDetailV2(address)!.replace('Địa chỉ:', '') || ''}
                                                                        </p>
                                                                  </div>

                                                                  <div className='mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-[#98a2b3]'>
                                                                        <span className='font-medium text-[#cbd5e1]'>{receiverName}</span>
                                                                        <span className='h-1 w-1 rounded-full bg-[#667085]' />
                                                                        <span>{receiverPhone}</span>
                                                                  </div>

                                                                  {addressType && (
                                                                        <div className='mt-2 flex flex-wrap items-center gap-2'>
                                                                              <span className='rounded-md bg-white/[0.06] px-2 py-1 text-[11px] font-medium text-[#9aa4b2]'>
                                                                                    {addressType}
                                                                              </span>
                                                                        </div>
                                                                  )}
                                                            </div>
                                                      </label>
                                                )
                                          })}
                                    </Radio.Group>

                                    {valueAddress === 'Other' && (
                                          <div className='mt-4 rounded-[10px] border border-white/[0.08] bg-[#11151c] p-3'>
                                                <FormAddress
                                                      onSuccessAddAddress={onSuccessAddAddress}
                                                      onClose={() => {
                                                            setValueAddress('')
                                                      }}
                                                />
                                          </div>
                                    )}
                              </div>

                              <div className='border-t border-white/[0.08] bg-[#121720] px-6 py-4'>
                                    <button
                                          type='button'
                                          className='mb-4 flex h-12 w-full items-center justify-center gap-2 rounded-[8px] border border-dashed border-[#1677ff]/70 bg-[#1677ff]/[0.03] text-[14px] font-medium text-[#3690ff] transition hover:border-[#3690ff] hover:bg-[#1677ff]/[0.08]'
                                          onClick={() => setValueAddress('Other')}
                                    >
                                          <Plus size={20} strokeWidth={1.8} />
                                          <span>Thêm địa chỉ mới</span>
                                    </button>

                                    <div className='grid grid-cols-2 gap-3'>
                                          <button
                                                type='button'
                                                onClick={handleCloseModal}
                                                className='h-12 rounded-[8px] border border-white/[0.18] bg-transparent text-[14px] font-medium text-[#d7dce3] transition hover:bg-white/[0.05] hover:text-white'
                                          >
                                                Hủy
                                          </button>

                                          <button
                                                type='button'
                                                onClick={onVerifyAddress}
                                                disabled={valueAddress === 'Other'}
                                                className='h-12 rounded-[8px] bg-[#1677ff] text-[14px] font-medium text-white transition hover:bg-[#2b84ff] disabled:cursor-not-allowed disabled:opacity-40'
                                          >
                                                Xác nhận
                                          </button>
                                    </div>

                                    <div className='mt-4 flex items-center justify-center gap-1.5 text-[11px] text-[#707b8c]'>
                                          <LockKeyhole size={13} strokeWidth={1.7} />
                                          <span>Thông tin địa chỉ của bạn được bảo mật.</span>
                                    </div>
                              </div>
                        </div>
                  </div>
            </Portal>
      )
}

export default BoxConfirmAddress