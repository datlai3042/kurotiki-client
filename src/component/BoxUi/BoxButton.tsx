import { useRef } from 'react'
import BoxLoading from './BoxLoading'

type Props = {
      content: string
      width?: string
      height?: string
      rounded?: string
      onLoading?: boolean
      onStateLoading?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const BoxButton = (props: Props) => {
      const { content, height, rounded, width, onLoading = false, onStateLoading = false, ...propButton } = props

      const styleEffect = {
            widthEfect: width ? width : 'w-full',
            heightEfect: height ? height : 'h-full',
            roundedEffect: rounded ? rounded : 'rounded-[4px]',
      }

      return (
            <button
                  {...propButton}
                  className={`${styleEffect.widthEfect} ${styleEffect.heightEfect} ${styleEffect.roundedEffect} ${propButton?.className} flex items-center justify-center bg-color-main opacity-80 hover:opacity-100 text-white p-[8px_6px] xl:px-[12px] xl:py-[8px] gap-[8px] `}
            >
                  {content}

                  {onLoading && <BoxLoading />}
            </button>
      )
}

export default BoxButton
