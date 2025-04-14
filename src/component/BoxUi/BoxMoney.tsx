import React from 'react'

type TProps = {
      name: string
      money: number
      colorText?: string
      colorBackground?: string
}

const BoxMoney = (props: TProps) => {
      const { money, name, colorText = 'text-white', colorBackground = 'bg-color-main' } = props

      return (
            <p className='w-max flex gap-[4px] items-center text-[13px]'>
                  <span className='w-max  max-w-[180px] xl:truncate'>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(money).replace('₫', '')}
                  </span>
                  <span className={`${colorText + ' ' + colorBackground}  px-[4px]   rounded-[4px]`}>{name}</span>
            </p>
      )
}

export default BoxMoney
