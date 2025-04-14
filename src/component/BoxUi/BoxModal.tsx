import React from 'react'
import Portal from '../Portal'

const BoxModal = ({ children }: { children: React.ReactNode }) => {
      return (
            <Portal>
                  <div className='fixed w-full min-h-screen top-0 left-0 flex justify-center items-center bg-[rgba(0,0,0,.9)] z-[998]'>
                        {children}
                  </div>
            </Portal>
      )
}

export default BoxModal
