import React from 'react'
import TikiBestLogo from '../assets/img/Navigate/TikiBest.png'
import Light from '../assets/img/Navigate/maybay.png'
import DiscountLogo from '../assets/img/Navigate/discount.png'
import NewLogo from '../assets/img/Navigate/new.png'
import BookLogo from '../assets/img/Navigate/book.png'
import HouseLogo from '../assets/img/Navigate/house.png'
import BeautyLogo from '../assets/img/Navigate/beauty.png'

const ARRAY_IMAGE = [
      {
            label: 'Tiki Best',
            value: TikiBestLogo,
      },

      {
            label: 'Nhập khẩu chính hãng',
            value: Light,
      },

      {
            label: 'Khuyến mãi',
            value: DiscountLogo,
      },

      {
            label: 'Sản phẩm mới',
            value: NewLogo,
      },
      {
            label: 'Nhà sách Tiki',
            value: BookLogo,
      },

      {
            label: 'Nhà cửa đời sống',
            value: HouseLogo,
      },

      {
            label: 'Làm đẹp sức khỏe',
            value: BeautyLogo,
      },
]

const ContentLabel = () => {
      return (
            <div className='w-full h-[150px] flex items-center justify-center bg-color-section-theme text-text-theme rounded-lg'>
                  <div className='w-full h-full flex gap-[8px] justify-between items-center overflow-auto pb-[8px]  px-[16px]'>
                        {ARRAY_IMAGE.map((image) => (
                              <div className='flex flex-col gap-[8px] min-w-[100px] h-full justify-center  items-center' key={image.value}>
                                    <img
                                          src={image.value}
                                          className='h-[60px] w-[60px] border-[1px] border-[var(--border-color-input)] rounded-full'
                                          alt='label'
                                    />
                                    <p className='h-[20px] text-[13px] text-center'>{image.label}</p>
                              </div>
                        ))}
                  </div>
            </div>
      )
}

export default ContentLabel
