import { ArrowBigLeft, Home, User } from 'lucide-react'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

interface IProps extends React.HTMLProps<HTMLDivElement> {}

const FooterMobile = ({ ...props }: IProps) => {
      const navigate = useNavigate()

      return (
            <div {...props}>
                  <div className='fixed bottom-0 left-0 right-0 w-full px-[12px] flex justify-between min-h-[45px] bg-white  items-center z-[800]'>
                        <ArrowBigLeft onClick={() => navigate(-1)} className='hover:cursor-pointer'/>

                        <Link to={'/'}>
                              <Home />
                        </Link>
                        <Link to={'/customer/router'}>
                              <User />
                        </Link>
                  </div>
            </div>
      )
}

export default FooterMobile
