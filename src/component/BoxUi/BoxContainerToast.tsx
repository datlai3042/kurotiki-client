import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import ToastDemo from './ToastDemo'

const BoxContainerToast = () => {
      const toast = useSelector((state: RootState) => state.toast.toast)

      // if (toast.length < 0) return null
      return (
            <>
                  {toast.length !== 0 && (
                        <div className='hideScrollBar pr-[10px] overflow-x-hidden fixed flex flex-col gap-[12px]  text-white top-[0px] right-0 xl:right-[18px] border-none   min-h-[200px] max-h-max bg-transparent py-[12px]  overflow-y-auto h-screen  z-[9999]'>
                              {toast.map((t) => (
                                    <React.Fragment key={t.id}>
                                          {/* <span>{t.id}</span> */}
                                          <ToastDemo toast={t} />
                                    </React.Fragment>
                              ))}
                        </div>
                  )}
            </>
      )
}

export default BoxContainerToast
