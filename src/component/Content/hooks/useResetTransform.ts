import { debounce } from "lodash"
import { useEffect, useState } from "react"

const useResetTransform = (ref:  React.RefObject<HTMLDivElement>, callback?: (width: number) => void) => {
      const [widthContainer, setWidthContainer] = useState(0)

      useEffect(() => {

            const handleBrowserResize = debounce(() => {
                  if (ref.current) {
                        const width = ref.current.getBoundingClientRect().width
                        setWidthContainer(width)
                        ref.current.style.transform = `translate3d(0px,0px,0px)`
                        if (callback) {
                              callback(width)
                        }
                  }

            }, 200)
            handleBrowserResize()
            window.addEventListener('resize', handleBrowserResize)
            return () => {
                  window.removeEventListener('resize', handleBrowserResize)
            }
      }, [ref.current])

      return { widthContainer }
}


export default useResetTransform