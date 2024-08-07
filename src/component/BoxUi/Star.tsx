type TProps = {
      opacity: number
}

const Star = (props: TProps) => {
      const { opacity } = props

      const styleEffect = {
            opacity: opacity > 0.5 ? 'bg-yellow-400' : opacity === 0.5 ? 'bg-yellow-300 opacity-[.4]' : 'bg-yellow-100',
      }

      if (opacity <= 0.5) {
            return <StarDescrease />
      }

      return <div className={`${styleEffect.opacity} clip-path-star w-[18px]  `}></div>
}

const StarDescrease = () => {
      return <div className={`border-[1px] border-yellow-500 clip-path-star w-[18px]  h-[18px]`}></div>
}

export default Star
