import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import { removeOneToast } from '../../Redux/toast'

type TProps = {
      children: React.ReactNode
      toast_item_id: string
      indexItem: number
}

const ToastWrapper = (props: TProps) => {
      const { children, toast_item_id, indexItem = 0 } = props

      const timer = useRef<NodeJS.Timeout | null>(null)
      const timer_animation = useRef<NodeJS.Timeout | null>(null)
      const timer_postion = useRef<NodeJS.Timeout | null>(null)

      const [addAnimation, setAddAnimation] = useState<boolean>(false)

      const toast_timer = useSelector((state: RootState) => state.toast.toast_timer)

      const toast_queue = useSelector((state: RootState) => state.toast.toast_queue)

      const [postion, setPosition] = useState<number>(0)

      const dispatch = useDispatch()

      useEffect(() => {
            if (toast_queue.some((toast) => toast._id === toast_item_id)) return
            timer.current = setTimeout(() => {
                  dispatch(removeOneToast({ toast_item_id }))
            }, toast_timer * 1000)

            timer_animation.current = setInterval(
                  () => {
                        setAddAnimation(true)
                  },
                  toast_timer * 1000 - 225,
            )

            timer_postion.current = setInterval(() => {
                  setPosition((prev) => (prev -= 1))
            }, 1000)

            return () => {
                  clearTimeout(timer.current as NodeJS.Timeout)
                  clearInterval(timer_animation.current as NodeJS.Timeout)
                  clearTimeout(timer_postion.current as NodeJS.Timeout)
            }
      }, [])

      return (
            <div
                  style={{ top: indexItem === 0 ? indexItem : indexItem * 140 }}
                  className={`${
                        addAnimation ? 'animate-hiddenToast absolute' : ''
                  } shadow-2xl transition-all duration-500 absolute  w-full h-[7rem] text-[1.3rem] rounded-lg bg-[#fff]`}
            >
                  {children}
            </div>
      )
}

export default ToastWrapper
