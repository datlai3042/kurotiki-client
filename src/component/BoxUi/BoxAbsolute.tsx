import React, { useEffect, useRef } from 'react'

type Corner = 'LEFT' | 'RIGHT' | 'BOTTOM' | 'TOP'
type CornerPositionAll = {
      left: number
      right: number
      top: number
      bottom: number
}

type ModeNormal = {
      mode: 'NORMAL'
      Corner: CornerPositionAll
}
type ModeCenter = {
      mode: 'CENTER'
      CornerCenter: Corner
      CornerRemaining?: Partial<CornerPositionAll>
}

type Props = {
      Icon: JSX.Element | React.ReactNode
      Mode: ModeCenter | ModeNormal
      ClassName?: string
      onClick?: React.MouseEventHandler<HTMLElement>
      zIndex?: number
}

const BoxAbsolute = (props: Props) => {
      let WrapperIconRef = useRef<HTMLDivElement>(null)

      useEffect(() => {
            if (WrapperIconRef.current) {
                  WrapperIconRef.current.style.zIndex = `${props.zIndex || 1}`

                  if (props.Mode.mode === 'CENTER') {
                        //console.log(([^)]+))
                        switch (props.Mode.CornerCenter) {
                              case 'TOP':
                                    WrapperIconRef.current.style.top = `50%`
                                    WrapperIconRef.current.style.right = `${props.Mode.CornerRemaining?.right}px`
                                    WrapperIconRef.current.style.bottom = `${props.Mode.CornerRemaining?.bottom}px`
                                    WrapperIconRef.current.style.left = `${props.Mode.CornerRemaining?.left}px`

                                    WrapperIconRef.current.style.transform = 'translateY(-50%)'
                                    break
                              case 'RIGHT':
                                    WrapperIconRef.current.style.top = `${props.Mode.CornerRemaining?.top}px`
                                    WrapperIconRef.current.style.right = `50%`
                                    WrapperIconRef.current.style.bottom = `${props.Mode.CornerRemaining?.bottom}px`
                                    WrapperIconRef.current.style.left = `${props.Mode.CornerRemaining?.left}px`
                                    WrapperIconRef.current.style.transform = 'translateX(-50%)'
                                    break

                              case 'BOTTOM':
                                    WrapperIconRef.current.style.top = `${props.Mode.CornerRemaining?.top}px`
                                    WrapperIconRef.current.style.right = `${props.Mode.CornerRemaining?.right}px`
                                    WrapperIconRef.current.style.bottom = `50%`
                                    WrapperIconRef.current.style.left = `${props.Mode.CornerRemaining?.left}px`
                                    WrapperIconRef.current.style.transform = 'translateY(-50%)'
                                    break
                              case 'LEFT':
                                    WrapperIconRef.current.style.color = 'yellow'
                                    WrapperIconRef.current.style.top = `${props.Mode.CornerRemaining?.top}px`
                                    WrapperIconRef.current.style.right = `${props.Mode.CornerRemaining?.right}px`
                                    WrapperIconRef.current.style.bottom = `${props.Mode.CornerRemaining?.bottom}px`
                                    WrapperIconRef.current.style.left = '50%'

                                    WrapperIconRef.current.style.transform = 'translateX(-50%)'
                                    break
                              default:
                                    return
                        }
                  } else {
                        WrapperIconRef.current.style.top = `${props.Mode.Corner.top}px`
                        WrapperIconRef.current.style.right = `${props.Mode.Corner.right}px`
                        WrapperIconRef.current.style.bottom = `${props.Mode.Corner.bottom}px`
                        WrapperIconRef.current.style.left = `${props.Mode.Corner.left}px`
                  }
            } else return
      }, [])

      return (
            <div
                  className={`absolute ${props.ClassName ? props.ClassName : ''} `}
                  ref={WrapperIconRef}
                  onClick={props.onClick && props.onClick}
            >
                  {props.Icon}
            </div>
      )
}

export default BoxAbsolute
