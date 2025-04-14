import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { onShowSideBar, toDoHideSideBar, toDoShowSideBar } from '../../../Redux/uiSlice'
import { RootState } from '../../../store'
import logo from './logo.png'

type TProps = {}

const HeaderLogoToggle = (props: TProps) => {
      const uiSlice = useSelector((state: RootState) => state.uiSlice.showSideBar)
      const dispatch = useDispatch()
      const onShowSideBarAction = () => {
            // dispatch(onShowSideBar({ showSideBar: showSideBar }))

            return uiSlice ? dispatch(toDoHideSideBar()) : dispatch(toDoShowSideBar())
      }

      return (
            <div className='w-full h-full'>
                  <Link className='hidden md:flex flex-col w-full gap-[6px] h-full content-between ' to='/'>
                        <img src={logo} className='min-w-[80px] h-[36px] ' alt='' />
                  </Link>
                  <div className='block md:hidden cursor-pointer' onClick={onShowSideBarAction}>
                        <svg
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                              strokeWidth={1.5}
                              stroke='currentColor'
                              className='w-8 h-8 lg:w-9 lg:h-9'
                        >
                              <path strokeLinecap='round' strokeLinejoin='round' d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5' />
                        </svg>
                  </div>
            </div>
      )
}

export default HeaderLogoToggle
