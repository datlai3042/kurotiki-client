import { ChevronRight } from 'lucide-react'
import React from 'react'

type Props = {
      title?: React.ReactNode | JSX.Element
      other?: React.ReactNode | JSX.Element
      ElementRight?: React.ReactNode | JSX.Element | React.ReactNode[] | JSX.Element[]
      ListProducts: React.ReactNode | JSX.Element
      ArrowLeft?: JSX.Element | React.ReactElement
      ArrowRight?: JSX.Element | React.ReactElement
      background?: string
      description?: string
      actionText?: string
}

const SectionProduct = (props: Props) => {
      return (
            <section
                  style={{ background: props.background || undefined }}
                  className='overflow-hidden rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme text-text-theme shadow-sm'
            >
                  <div className='flex items-center justify-between gap-4 px-4 pb-2 pt-4 sm:px-5 sm:pt-5'>
                        <div className='min-w-0'>
                              <div className='flex items-center gap-3'>
                                    {props.title}
                                    {props.other}
                              </div>
                              {props.description && <p className='mt-1 text-xs text-slate-500 dark:text-slate-400'>{props.description}</p>}
                        </div>

                        <div className='shrink-0'>
                              {props.ElementRight ||
                                    (props.actionText && (
                                          <button className='flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 sm:text-sm'>
                                                {props.actionText}
                                                <ChevronRight size={16} />
                                          </button>
                                    ))}
                        </div>
                  </div>

                  <div className='pb-4'>{props.ListProducts}</div>
            </section>
      )
}

export default SectionProduct
