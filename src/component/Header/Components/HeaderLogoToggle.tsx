import { Link } from 'react-router-dom'

const HeaderLogoToggle = () => {
      return (
            <Link className='flex items-center' to='/' aria-label='KuroTiki trang chủ'>
                  <span className='text-[20px] font-bold tracking-[-1.3px] text-[#1677ff] sm:text-[23px] lg:text-[25px]'>Kuro</span>
                  <span className='relative text-[20px] font-bold tracking-[-1.3px] text-[#19c9da] sm:text-[23px] lg:text-[25px]'>
                        Tiki
                        <span className='absolute -right-[4px] -top-[3px] h-[4px] w-[4px] rounded-full bg-[#ffd21e] lg:-right-[5px] lg:-top-[4px] lg:h-[5px] lg:w-[5px]' />
                  </span>
            </Link>
      )
}

export default HeaderLogoToggle
