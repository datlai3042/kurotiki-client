import { useState, useEffect, useRef } from 'react'
import BoxCenter from '../../BoxUi/BoxCenter'

const CountDown = () => {
      const [seconds, setSeconds] = useState<number>(59)
      const [minute, setMinute] = useState<number>(59)
      const [hour, setHour] = useState<number>(2)
      const timerId = useRef<NodeJS.Timeout | null>(null)

      useEffect(() => {
            if (seconds === 0) {
                  setSeconds(59)
                  setMinute((prev) => prev - 1)
            }
            if (minute === 0) {
                  setMinute(0)
                  setHour((prev) => prev - 1)
            }
            if (hour === 0) {
                  setSeconds(59)
                  setMinute(59)
                  setHour(2)
            }
      }, [seconds, minute, hour])

      useEffect(() => {
            timerId.current = setInterval(() => {
                  setSeconds((prev) => (prev -= 1))
            }, 1000)
            return () => clearInterval(timerId.current as NodeJS.Timeout)
      }, [])

      return (
            <div className='flex gap-1'>
                  <BoxCenter ClassName='w-[30px] h-[30px] rounded-[4px] bg-color-main text-white' content={hour > 9 ? hour : `0${hour}`} />
                  <span className='font-bold font-sm'>:</span>
                  <BoxCenter
                        ClassName='w-[30px] h-[30px] rounded-[4px] bg-color-main text-white'
                        content={minute > 9 ? minute : `0${minute}`}
                  />
                  <span className='font-bold font-sm'>:</span>

                  <BoxCenter
                        ClassName='w-[30px] h-[30px] rounded-[4px] bg-color-main text-white'
                        content={seconds > 9 ? seconds : `0${seconds}`}
                  />
            </div>
      )
}

export default CountDown
