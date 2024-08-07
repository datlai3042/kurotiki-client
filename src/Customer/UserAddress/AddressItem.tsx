import { useMutation } from '@tanstack/react-query'
import { Anchor, Building2, Home, TentTree, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchUser } from '../../Redux/authenticationSlice'
import AccountService from '../../apis/account.service'
import BoxButton from '../../component/BoxUi/BoxButton'
import BoxWeatherApi from '../../component/BoxUi/BoxWeatherApi'
import { UserAddress } from '../../types/user.type'

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
                  //console.log(([^)]+))
            }
      }, [detailAddress])

      const AddressType = address.type === 'Home' ? <Home /> : address.type === 'Company' ? <Building2 /> : <TentTree />

      const styleEffect = {
            btnAddressDefault: address.address_default
                  ? 'animate-Custome border-[2px] border-blue-700 rounded bg-[#fffff] text-blue-700 '
                  : ' border-[1px] border-blue-300 rounded  text-blue-300',
      }
      return (
            <div
                  style={{ height: detailAddress ? 'max-content !important' : 200 }}
                  className={`${
                        detailAddress ? 'h-max' : 'h-[375px] xl:h-[240px]'
                  } relative transition-all  duration-300 flex flex-col gap-[20px] bg-[#ffffff] p-[16px]`}
                  key={address._id}
            >
                  <div className='flex flex-col xl:flex-row xl:gap-[20px]'>
                        <div className='w-full xl:w-[60%]'>
                              <div className='h-[55px] w-full flex items-center gap-[8px]'>
                                    <span>Số địa chỉ: </span>
                                    <span className='  bg-slate-900 text-white  w-[20px] h-[20px] rounded-full flex items-center justify-center'>
                                          {index + 1}
                                    </span>
                              </div>
                              <div className='flex flex-col gap-[24px] w-full '>
                                    <div className='w-max flex flex-col xl:flex-row gap-[20px] xl:gap-[4px]'>
                                          <span>Địa chỉ:</span>
                                          <div
                                                className='hover:cursor-pointer  bg-blue-300 text-white p-[12px_6px] min-w-[50px] w-[auto] max-w-[400px] h-[20px] rounded flex items-center justify-center gap-[8px]'
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
                                                <span>{address.address_street}</span>
                                                <p className='w-max flex gap-[2px] items-center'>
                                                      <span>Phường/Xã:</span>
                                                      <button
                                                            className='  bg-blue-300 text-white p-[12px_6px] min-w-[20px] w-[auto] max-w-[250px] h-[20px] rounded flex items-center justify-center'
                                                            onClick={() => openSearchGoogle(address.address_ward.text)}
                                                      >
                                                            {address.address_ward.text}
                                                      </button>
                                                </p>
                                          </div>
                                          <div className='ml-[6px] flex gap-[6px] items-center'>
                                                {AddressType}
                                                <span>
                                                      (
                                                      {address.type === 'Home'
                                                            ? 'Nhà'
                                                            : address.type === 'Company'
                                                            ? 'Công ty / cơ quan'
                                                            : 'Nơi ở riêng tư'}
                                                      )
                                                </span>
                                          </div>
                                    </div>

                                    <div className='flex flex-col xl:flex-row gap-[16px]  xl:gap-[4px]'>
                                          <p className='w-max flex gap-[4px]'>
                                                <span>Quận/Huyện:</span>
                                                <button
                                                      className='  bg-blue-300 text-white p-[12px_6px] min-w-[50px] w-[auto] max-w-[250px] h-[20px] rounded flex items-center justify-center'
                                                      onClick={() => openSearchGoogle(address.address_district.text)}
                                                >
                                                      {address.address_district.text}
                                                </button>
                                          </p>

                                          <p className='w-max flex gap-[4px]'>
                                                <span>Tỉnh/Thành phố:</span>
                                                <button
                                                      className='  bg-blue-300 text-white p-[12px_6px] min-w-[50px] w-[auto] max-w-[250px] h-[20px] rounded flex items-center justify-center'
                                                      onClick={() => openSearchGoogle(address.address_province.text)}
                                                >
                                                      {address.address_province.text}
                                                </button>
                                          </p>
                                    </div>
                                    {/* <p>{renderStringAddressDetail(address)}</p> */}
                                    <div className='w-[120px] h-[36px]'>
                                          <BoxButton
                                                content={`${detailAddress ? 'Đóng bản đồ' : 'Xem bản đồ'}`}
                                                onClick={() => {
                                                      setDetailAdress((prev) => !prev)
                                                      setLoadingIframe(true)
                                                }}
                                          />
                                    </div>
                              </div>
                              {detailAddress && (
                                    <div className='mt-[20px] w-full h-[250px] xl:h-[300px]'>
                                          <BoxWeatherApi locationName={address.address_district.text} />
                                    </div>
                              )}
                        </div>
                        <div className=' flex-1'>
                              {detailAddress && (
                                    <div className='pt-[20px] xl:pt-[80px] h-full'>
                                          {loadingIframe && <div className='animate-pulse w-full xl:w-[100%] h-full bg-slate-300'></div>}
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
                                                className='mt-[30px] w-full xl:w-[100%]  animate-mountComponent'
                                                loading='lazy'
                                                referrerPolicy='no-referrer-when-downgrade'
                                          ></iframe>
                                    </div>
                              )}
                        </div>
                  </div>

                  <div className='absolute top-0 xl:top-[20px] right-0 xl:right-[20px] flex items-center gap-[12px]'>
                        <button
                              className={`${styleEffect.btnAddressDefault} w-[145px] xl:w-[180px] h-[32px] xl:px-[12px] xl:py-[6px]  flex items-center justify-center gap-[6px]`}
                              onClick={() => handleSetDefaultAddress(address._id)}
                        >
                              <span>{address.address_default ? 'Địa chỉ mặc định' : 'Đặt làm mặc định'}</span>
                              {address.address_default && <Anchor size={15} />}
                        </button>
                        <Trash2
                              className=''
                              onClick={() => {
                                    handleDeleteAddress(address._id)
                              }}
                        />
                  </div>
            </div>
      )
}

export default AddressItem
