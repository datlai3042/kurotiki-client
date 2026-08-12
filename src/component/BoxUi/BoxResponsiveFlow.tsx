import { X } from 'lucide-react'
import { ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import Portal from '../Portal'

export type OverflowRenderContext = {
      open: () => void
      hiddenCount: number
}

export type ExpandedRenderContext<T> = {
      items: T[]
      hiddenItems: T[]
      close: () => void
}

type BoxResponsiveOverflowProps<T> = {
      items: T[]
      getKey: (item: T, index: number) => React.Key
      renderItem: (item: T, index: number) => ReactNode
      renderMore?: (context: OverflowRenderContext) => ReactNode
      renderExpanded?: (context: ExpandedRenderContext<T>) => ReactNode
      gap?: number
      minVisible?: number
      className?: string
      itemClassName?: string
      itemContainerClassName?: string

      clip?: boolean
}

function BoxResponsiveOverflow<T>({
      items,
      getKey,
      renderItem,
      renderMore,
      renderExpanded,
      gap = 12,
      minVisible = 1,
      className = '',
      itemClassName = '',
      itemContainerClassName = '',
      clip = true,
}: BoxResponsiveOverflowProps<T>) {
      const containerRef = useRef<HTMLDivElement>(null)
      const measureRef = useRef<HTMLDivElement>(null)
      const moreMeasureRef = useRef<HTMLDivElement>(null)

      const [visibleCount, setVisibleCount] = useState(items.length)
      const [expanded, setExpanded] = useState(false)

      const calculate = useCallback(() => {
            const container = containerRef.current
            const measure = measureRef.current

            if (!container || !measure) return

            const containerWidth = container.clientWidth
            const children = Array.from(measure.children) as HTMLElement[]

            if (!children.length || containerWidth <= 0) {
                  setVisibleCount(0)
                  return
            }

            const widths = children.map((element) => Math.ceil(element.getBoundingClientRect().width))

            const totalItemsWidth = widths.reduce((sum, width) => sum + width, 0) + Math.max(widths.length - 1, 0) * gap

            if (totalItemsWidth <= containerWidth) {
                  setVisibleCount(items.length)
                  return
            }

            const moreWidth = Math.ceil(moreMeasureRef.current?.getBoundingClientRect().width ?? 48)

            let used = 0
            let count = 0

            for (let index = 0; index < widths.length; index++) {
                  const itemWidth = widths[index]
                  const nextItemCost = itemWidth + (count > 0 ? gap : 0)
                  const reservedMoreCost = moreWidth + gap

                  if (used + nextItemCost + reservedMoreCost > containerWidth) {
                        break
                  }

                  used += nextItemCost
                  count++
            }

            const safeCount = Math.max(Math.min(count, items.length), Math.min(minVisible, items.length))

            setVisibleCount(safeCount)
      }, [gap, items, minVisible])

      useLayoutEffect(() => {
            calculate()
      }, [calculate])

      useEffect(() => {
            const container = containerRef.current
            if (!container) return

            const observer = new ResizeObserver(() => calculate())
            observer.observe(container)

            return () => observer.disconnect()
      }, [calculate])

      const hasOverflow = visibleCount < items.length
      const hiddenItems = hasOverflow ? items.slice(visibleCount) : []
      const hiddenCount = hiddenItems.length

      const open = () => setExpanded(true)
      const close = () => setExpanded(false)

      return (
            <>
                  <div
                        ref={containerRef}
                        className={['relative w-full', clip ? 'overflow-hidden' : '', className].filter(Boolean).join(' ')}
                  >
                        <div className={twMerge('flex items-stretch justify-around', itemContainerClassName)} style={{ gap }}>
                              {items.slice(0, visibleCount).map((item, index) => (
                                    <div key={getKey(item, index)} className={`shrink-0 ${itemClassName}`}>
                                          {renderItem(item, index)}
                                    </div>
                              ))}

                              {hasOverflow && (
                                    <div className='shrink-0'>
                                          {renderMore?.({
                                                open,
                                                hiddenCount,
                                          }) ?? (
                                                <button
                                                      type='button'
                                                      onClick={open}
                                                      className='h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700'
                                                >
                                                      +{hiddenCount}
                                                </button>
                                          )}
                                    </div>
                              )}
                        </div>
                  </div>

                  <div
                        ref={measureRef}
                        aria-hidden
                        className='pointer-events-none fixed left-[-99999px] top-0 flex opacity-0'
                        style={{ gap }}
                  >
                        {items.map((item, index) => (
                              <div key={getKey(item, index)} className={`shrink-0 ${itemClassName}`}>
                                    {renderItem(item, index)}
                              </div>
                        ))}
                  </div>

                  <div ref={moreMeasureRef} aria-hidden className='pointer-events-none fixed left-[-99999px] top-0 opacity-0'>
                        {renderMore?.({
                              open: () => {},
                              hiddenCount: Math.max(items.length - 1, 1),
                        }) ?? <button className='h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700'>+99</button>}
                  </div>

                  {expanded &&
                        renderExpanded?.({
                              items,
                              hiddenItems,
                              close,
                        })}
            </>
      )
}

type BoxResponsiveFlowCloseProps = {
      open: boolean
      onClose: () => void
      title?: ReactNode
      children: ReactNode
      maxHeightClassName?: string
}

function BoxResponsiveFlowClose({ open, onClose, title, children, maxHeightClassName = 'max-h-[78vh]' }: BoxResponsiveFlowCloseProps) {
      useEffect(() => {
            if (!open) return

            const originalOverflow = document.body.style.overflow
            document.body.style.overflow = 'hidden'

            const onKeyDown = (event: KeyboardEvent) => {
                  if (event.key === 'Escape') onClose()
            }

            window.addEventListener('keydown', onKeyDown)

            return () => {
                  document.body.style.overflow = originalOverflow
                  window.removeEventListener('keydown', onKeyDown)
            }
      }, [open, onClose])

      if (!open) return null

      return (
            <Portal>
                  <div className='fixed inset-0 z-[1000]'>
                        <button
                              type='button'
                              aria-label='Đóng'
                              onClick={onClose}
                              className='absolute inset-0 bg-black/95 backdrop-blur-[1px] z-9999'
                        />

                        <div
                              className={`
                              absolute bottom-[60px] left-0 right-0
                              ${maxHeightClassName}
                              overflow-hidden
                              rounded-t-3xl
                              min-h-[36vh]
                              border border-b-0 border-slate-200
                              bg-white
                              shadow-2xl
                              dark:border-slate-700
                              dark:bg-[#171b21]
                        `}
                        >
                              <div className='mx-auto mt-2 h-1 w-10 rounded-full bg-slate-300 dark:bg-slate-600' />

                              <div className='flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700'>
                                    <div className='min-w-0'>{title}</div>

                                    <button
                                          type='button'
                                          onClick={onClose}
                                          className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                                    >
                                          <X size={20} />
                                    </button>
                              </div>

                              <div className='overflow-y-auto p-5'>{children}</div>
                        </div>
                  </div>
            </Portal>
      )
}

export { BoxResponsiveFlowClose }
export default BoxResponsiveOverflow
