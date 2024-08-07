export const getNewPosition = (
      mode: string,
      point: number,
      id: number,
      width: number,
      posCurrent: React.MutableRefObject<number>,
      sliderWrapper: React.RefObject<HTMLDivElement>,
) => {
      // if (mode === 'NEXT') {
      let position = (point - id) * width // khoang cach giua Element-target va Element-current
      let time = position / width // thoi gian transition - chạy từ element-current về element-target

      let newPosition = position + -posCurrent.current
      let newPositionPostive = -newPosition

      if (sliderWrapper.current) {
            sliderWrapper.current.style.transform = `translate3d(${newPosition}px, 0,0)`
            sliderWrapper.current.style.transition = `all ${time}s`
      }
      return { time, newPositionPostive }
      // }
}
