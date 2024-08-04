import ToastErrorItem from './ToastError'
import ToastSuccessItem from './ToastSuccess'
import ToastWarningItem from './ToastWarning'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { createContext, useMemo } from 'react'
import ToastStoreQueue from './ToastStoreQueue'

type Common = {
      _id: string
      toast_title: string
}

export type ToastSuccessCore = Common & {
      type: 'SUCCESS'
      core: {
            message: string
      }
}

export type ToastWarningCore = Common & {
      type: 'WARNING'
      core: {
            message: string
      }
}

export type ToastErrorCore = Common & {
      type: 'ERROR'
      core: {
            message: string
      }
}

export type ToastCore = ToastSuccessCore | ToastWarningCore | ToastErrorCore

const ToastContext = createContext<ToastCore[]>([])

const generateToastType = (toasts: ToastCore[]) => {
      return toasts.map((toast, i) => {
            if (toast.type === 'SUCCESS') return <ToastSuccessItem index={i} key={toast._id} toast_item={toast} />
            if (toast.type === 'WARNING') return <ToastWarningItem index={i} key={toast._id} toast_item={toast} />
            if (toast.type === 'ERROR') return <ToastErrorItem index={i} key={toast._id} toast_item={toast} />
            return <span></span>
      })
}

const ToastProvider = () => {
      const toast_stack = useSelector((state: RootState) => state.toast.toast_stack)
      const toast_queue = useSelector((state: RootState) => state.toast.toast_queue)
      const toast_max_show = useSelector((state: RootState) => state.toast.toast_max_show)

      const toast_timer = useSelector((state: RootState) => state.toast.toast_timer)

      const renderToastStack = useMemo(() => generateToastType(toast_stack), [toast_stack])
      const renderToastQueue = useMemo(() => generateToastType(toast_queue), [toast_queue])
      if (toast_stack.length === 0 && toast_queue.length === 0) return null

      return (
            <>
                  <div className='fixed z-[1000] right-0 top-0 w-[400px]  mt-[2rem] px-[2rem]'>
                        <div className='relative max-h-screen flex flex-col gap-[4rem]'>
                              <>
                                    {renderToastStack && renderToastStack.map((ITEM) => ITEM)}

                                    {toast_queue.length < 1 && renderToastQueue && renderToastQueue.map((ITEM) => ITEM)}
                                    {toast_queue.length >= 1 && <ToastStoreQueue />}
                              </>
                        </div>
                  </div>
            </>
      )
}

export default ToastProvider
