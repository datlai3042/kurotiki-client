import { useMutation, useQuery } from '@tanstack/react-query'
import { Radio, RadioChangeEvent, Select } from 'antd'
import { X } from 'lucide-react'
import React, { SetStateAction, useEffect, useMemo, useState } from 'react'
import LocationApi from '../../apis/location.api'
import Portal from '../Portal'

type TProps = {
      setOpenModal: React.Dispatch<SetStateAction<boolean>>
}

const BoxSelectAdrees = (props: TProps) => {
      const { setOpenModal } = props
      const [province, setProvince] = useState<string>()
      const [district, setDistrict] = useState<string>()
      const [, setWard] = useState<string>()
      const [radioAddress, setRadioAddress] = useState<string>()

      const provinceApi = useQuery({
            queryKey: ['provinces'],
            queryFn: () => LocationApi.getProvinces(),
      })

      const districtApi = useMutation({
            mutationKey: ['district'],
            mutationFn: (provinceCode: string) => LocationApi.getDistrict(provinceCode),
      })

      const wardApi = useMutation({
            mutationKey: ['ward'],
            mutationFn: (districtCode: string) => LocationApi.getWard(districtCode),
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

      const handleCloseModal = () => {
            setOpenModal(false)
      }

      const handleChangeRadio = (e: RadioChangeEvent) => {
            setRadioAddress(e.target.value)
      }

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

      useEffect(() => {}, [provinceApi.isSuccess, provinceApi.data?.data])

      useEffect(() => {
            if (districtApi.isSuccess) {
            }
      }, [districtApi.isSuccess, districtApi.data?.data.metadata])

      return (
            <Portal>
                  <div className='fixed inset-0 bg-[rgba(0,0,0,.45)] flex justify-center'>
                        <div className='relative w-[300px] xl:w-[600px] min-h-[370px] h-max bg-[#efefef] mt-[100px] xl:mt-[80px] p-[12px] rounded-md'>
                              <div className='flex flex-col gap-[10px] h-full'>
                                    <div className='basis-[80%] bg-white rounded-lg  py-[12px] flex flex-col gap-[12px]'>
                                          <header className='text-[20px] font-medium text-center'>Địa chỉ giao hàng</header>
                                          <div className='w-full h-[1px] bg-gray-100'></div>
                                          <div className='px-[36px] mt-[24px] text-[14px]'>
                                                <span>
                                                      Hãy chọn địa chỉ nhận hàng để được dự báo thời gian giao hàng cùng phí đóng gói, vận
                                                      chuyển một cách chính xác nhất.
                                                </span>
                                          </div>
                                          <div className='px-[36px] mt-[24px] '>
                                                <Radio.Group
                                                      className='flex flex-col gap-[8px]'
                                                      onChange={handleChangeRadio}
                                                      value={radioAddress}
                                                >
                                                      <Radio value={'Other'}>Chọn địa chỉ khác</Radio>
                                                      {/* <Radio value={2}>B</Radio> */}
                                                      {/* <Radio value={3}>C</Radio> */}
                                                      {/* <Radio value={4}>D</Radio> */}
                                                </Radio.Group>
                                          </div>
                                          {radioAddress === 'Other' && (
                                                <div className='px-[36px] flex flex-col  xl:flex-row gap-[16px]'>
                                                      <Select
                                                            options={renderProvinces}
                                                            onChange={handleChangeProvince}
                                                            placeholder='Chọn tỉnh thành phố'
                                                            className='w-[80%]'
                                                      />
                                                      <Select
                                                            options={renderDistrict}
                                                            onChange={handleChangeDistrict}
                                                            placeholder='Chọn quận huyện'
                                                            className='w-[70%]'
                                                            disabled={province ? false : true}
                                                      />

                                                      <Select
                                                            options={renderWard}
                                                            onChange={handleChangeWard}
                                                            placeholder='Chọn phường xã'
                                                            className='w-[70%]'
                                                            disabled={province && district ? false : true}
                                                      />
                                                </div>
                                          )}
                                    </div>
                                    <button className='basis-[20%] bg-red-700'>123</button>
                              </div>
                              <button
                                    className='absolute top-[-15px] right-[-15px] w-[30px] h-[30px] border-[1px] border-gray-300 bg-white rounded-full flex items-center justify-center'
                                    onClick={handleCloseModal}
                              >
                                    <X color='gray' />
                              </button>
                        </div>
                  </div>
            </Portal>
      )
}

export default BoxSelectAdrees
