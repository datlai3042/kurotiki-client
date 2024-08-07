import { useEffect, useRef } from 'react'

type Props = {
      func: () => Promise<void>
      delay: number
}

const useDelay = (props: Props) => {
      const { func, delay } = props

      const callbackRef = useRef<(() => Promise<void>) | null>(null)

      const timeoutRef = useRef<NodeJS.Timeout>()

      useEffect(() => {
            if (callbackRef.current) {
                  callbackRef.current = func
            }
      }, [func])

      return () => {
            if (timeoutRef.current) {
                  clearTimeout(timeoutRef.current)
            }

            timeoutRef.current = setTimeout(() => callbackRef.current && callbackRef.current(), delay)
      }
}

export default useDelay
