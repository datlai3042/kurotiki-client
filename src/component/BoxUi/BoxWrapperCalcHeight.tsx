import React, { CSSProperties, ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

type BoxWrapperCalcHeightProps = {
      children: ReactNode
      className?: string

      /**
       * Khoảng cách muốn chừa lại ở đáy viewport.
       */
      bottomOffset?: number

      /**
       * Chiều cao tối thiểu.
       */
      minHeight?: number

      /**
       * Danh sách selector của các element cần trừ thêm height.
       *
       * Ví dụ:
       * ['#header', '.bottom-navigation', '[data-notification-filter]']
       */
      subtractSelectors?: string[]

      style?: CSSProperties
}

const BoxWrapperCalcHeight = ({
      children,
      className = '',
      bottomOffset = 0,
      minHeight = 0,
      subtractSelectors = [],
      style,
}: BoxWrapperCalcHeightProps) => {
      const containerRef = useRef<HTMLDivElement>(null)

      const [height, setHeight] = useState<number>()

      const calculateHeight = useCallback(() => {
            const container = containerRef.current

            if (!container) return

            const top = container.getBoundingClientRect().top
            const viewportHeight = window.innerHeight

            const subtractElementsHeight = subtractSelectors.reduce((total, selector) => {
                  const element = document.querySelector<HTMLElement>(selector)

                  if (!element) return total

                  return total + element.getBoundingClientRect().height
            }, 0)

            const availableHeight = viewportHeight - top - bottomOffset - subtractElementsHeight

            setHeight(Math.max(availableHeight, minHeight))
      }, [bottomOffset, minHeight, subtractSelectors])

      useLayoutEffect(() => {
            calculateHeight()
      }, [calculateHeight])

      useEffect(() => {
            window.addEventListener('resize', calculateHeight)

            const resizeObserver = new ResizeObserver(() => {
                  calculateHeight()
            })

            if (containerRef.current) {
                  resizeObserver.observe(containerRef.current)
            }

            /*
             * Observe luôn các element cần subtract.
             * Nếu header / bottom nav đổi height thì wrapper
             * tự calculate lại.
             */
            subtractSelectors.forEach((selector) => {
                  const element = document.querySelector<HTMLElement>(selector)

                  if (element) {
                        resizeObserver.observe(element)
                  }
            })

            return () => {
                  window.removeEventListener('resize', calculateHeight)

                  resizeObserver.disconnect()
            }
      }, [calculateHeight, subtractSelectors])

      return (
            <div
                  ref={containerRef}
                  className={className}
                  style={{
                        ...style,
                        height: height !== undefined ? `${height}px` : undefined,
                  }}
            >
                  {children}
            </div>
      )
}

export default BoxWrapperCalcHeight
