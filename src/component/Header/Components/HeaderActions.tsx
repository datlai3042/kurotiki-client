import { Link } from 'react-router-dom'
import HeaderBoxHover from './HeaderBoxHover'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import HeaderCart from './HeaderCart'
import { UserResponse } from '../../../types/user.type'
import ButtonDarkMode from '../../Features/ButtonDarkMode'

const HeaderActions = () => {
      const user = useSelector((state: RootState) => state.authentication.user) as UserResponse

      return (
            <div className='h-full] flex gap-[16px] items-center content-start text-[13px]  '>
                  <Link className='h-[80%] hidden md:flex items-center px-[8px] bg-blue-200 gap-[4px] rounded-lg text-blue-800' to='/'>
                        <img
                              src='https://salt.tikicdn.com/ts/upload/32/56/db/d919a4fea46f498b5f4708986d82009d.png'
                              alt=''
                              className='w-5 h-5'
                        />
                        <button className='text-sm font-semibold'>Trang Chủ</button>
                  </Link>

                  <div className='group relative z-[601] hidden xl:flex items-center px-2 gap-2 '>
                        {user ? (
                              <img
                                    src={user?.avatar?.secure_url || user.avatar_url_default}
                                    className='w-[24px] h-[24px] rounded-full'
                                    alt='avatar'
                              />
                        ) : (
                              <img
                                    src='https://salt.tikicdn.com/ts/upload/07/d5/94/d7b6a3bd7d57d37ef6e437aa0de4821b.png'
                                    alt=''
                                    className='w-[24px] h-[24px]'
                              />
                        )}
                        <button className='text-blue-500 font-semibold'>Tài Khoản</button>
                        <div className='absolute  top-[20px] z-[601] right-0 hidden group-hover:block'>
                              <div className='w-full h-full pt-[10px]'>

                              <HeaderBoxHover />
                              </div>
                        </div>
                  </div>
                  <ButtonDarkMode />
                  <HeaderCart />
            </div>
      )
}

export default HeaderActions
