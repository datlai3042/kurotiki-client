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
            <div className='grid grid-cols-4 gap-2 px-4 py-3 sm:grid-cols-7 bg-color-section-theme rounded-xl'>
                  {ARRAY_IMAGE.map((image) => (
                        <button
                              type='button'
                              key={image.label}
                              className='group relative flex min-w-0 flex-col items-center justify-center rounded-2xl px-2 py-3 transition-all duration-200 hover:-translate-y-[2px] hover:bg-blue-500/[0.045]'
                        >
                              <div className='relative flex h-[58px] w-[58px] items-center justify-center rounded-2xl bg-slate-500/[0.045] transition-all duration-200 group-hover:bg-blue-500/[0.08] group-hover:shadow-[0_8px_22px_rgba(59,130,246,0.12)]'>
                                    <img
                                          src={image.value}
                                          alt={image.label}
                                          className='h-[42px] w-[42px] object-contain transition-transform duration-200 group-hover:scale-110'
                                    />
                              </div>

                              <span className='mt-2.5 line-clamp-2 min-h-[34px] text-center text-[12px] font-medium leading-[17px] text-slate-500 transition-colors group-hover:text-blue-500'>
                                    {image.label}
                              </span>
                        </button>
                  ))}
            </div>
      )
}

export default ContentLabel