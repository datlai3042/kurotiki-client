import React, { SetStateAction, useState } from 'react'
import { X } from 'lucide-react'
import { Radio, RadioChangeEvent } from 'antd'
import Portal from '../../Portal'
import FormAddress from '../../../forms/FormAddress'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { UserAddress, UserResponse } from '../../../types/user.type'
import { renderStringAddressDetailV2 } from '../../../utils/address.util'
import BoxButton from '../BoxButton'
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

      return (
            <Portal>
                  <div className='fixed inset-0 bg-[rgba(0,0,0,.45)] flex justify-center items-center z-[999]'>
                        <div
                              className='relative w-[450px] max-h-[96vh] bg-color-section-theme p-[12px_8px]  xl:p-[18px_12px] mx-[16px] xl:mx-0 
 rounded'
                        >
                              <div className='flex flex-col gap-[10px] h-full'>
                                    <div className='bg-color-section-theme text-text-theme rounded-lg  py-[12px] flex flex-col gap-[12px]'>
                                          <header className='text-[20px] font-medium text-center'>Địa chỉ giao hàng</header>
                                          <div className='w-full h-[1px] bg-[var(--border-color-input)]'></div>
                                          <div className='px-[14px] mt-[24px] text-[14px]'>
                                                <span>
                                                      Hãy chọn địa chỉ nhận hàng để được dự báo thời gian giao hàng cùng phí đóng gói, vận
                                                      chuyển một cách chính xác nhất.
                                                </span>
                                          </div>
                                          <div className='max-h-[450px] overflow-y-auto scrollCustome'>
                                                <Radio.Group
                                                      className='flex flex-col gap-[12px]'
                                                      onChange={handleChangeRadio}
                                                      value={valueAddress}
                                                      defaultValue={valueAddress}
                                                >
                                                      <div
                                                            className={`${
                                                                  valueAddress === 'Other' ? 'min-h-[30px]' : ''
                                                            }  mx-[8px]  max-h-[65px] overflow-auto flex flex-col gap-[5px] text-text-theme`}
                                                      >
                                                            {user?.user_address.map((address, index) => {
                                                                  return (
                                                                        <div key={address._id}>
                                                                              <Radio
                                                                                    value={address._id}
                                                                                    defaultChecked={address.address_default}
                                                                                    className='flex flex-wrap'
                                                                              >
                                                                                    <span>
                                                                                          {renderStringAddressDetailV2(address)!.replace(
                                                                                                'Địa chỉ:',
                                                                                                '',
                                                                                          ) || ''}
                                                                                    </span>
                                                                                    {addNew && user?.user_address.length === index + 1 && (
                                                                                          <span className='ml-[6px] flex justify-center items-center w-[44px] bg-color-main rounded-[4px] p-[1px] text-white'>
                                                                                                Mới
                                                                                          </span>
                                                                                    )}
                                                                              </Radio>
                                                                        </div>
                                                                  )
                                                            })}
                                                      </div>
                                                      <Radio value={'Other'} className='text-text-theme  mx-[8px]'>
                                                            Chọn địa chỉ khác
                                                      </Radio>
                                                </Radio.Group>

                                                {valueAddress !== 'Other' && (
                                                      <div className='mt-[20px]' onClick={onVerifyAddress}>
                                                            <BoxButton content='Xác nhận' />
                                                      </div>
                                                )}

                                                {valueAddress === 'Other' && <FormAddress onSuccessAddAddress={onSuccessAddAddress} />}
                                          </div>
                                    </div>
                              </div>
                              <button
                                    className='absolute top-[-15px] right-[-15px] w-[30px] h-[30px] border-[1px] border-[var(--border-color-input)] bg-white hover:bg-color-main hover:text-[#fff] hover:border-transparent rounded-full flex items-center justify-center'
                                    onClick={handleCloseModal}
                              >
                                    <X size={18} />
                              </button>
                        </div>
                  </div>
            </Portal>
      )
}

export default BoxConfirmAddress
