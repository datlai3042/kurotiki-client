import { debounce } from 'lodash'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import BoxAbsolute from '../../BoxUi/BoxAbsolute'

type Props = {
      hinhAnhSlider: string[]
      delay?: number
      width?: number
      height?: number
}

const SliderProducts = (props: Props) => {
      const { hinhAnhSlider, delay, width, height } = props

      // Div wrapper parent
      let sliderWrapper = useRef<HTMLDivElement>(null)

      // List Refs Imgae
      const refList = useRef<HTMLImageElement[]>([])

      // Clear interval
      let timerId = useRef<NodeJS.Timeout | null>(null)

      let delayTime = useRef<number>(1)

      //scope.current và poit có tác dụng như nhau, điều là lấy element current nhưng, dùng point để re-render cập nhập giá trị mới
      let scope = useRef<number>(1)
      const [point, setPoint] = useState<number>(1)

      //Vị trí mà div parent đang transform
      let posCurrent = useRef<number>(0)

      //Mode sẽ thay đổi khi có event click
      const run = useRef<boolean>(true)

      //Wrapper div
      let containerRefSlider = useRef<HTMLDivElement>(null)

      //Ui - default
      let widthDefault = useRef<number>(800)
      let heightDefault = useRef<number>(300)

      //debug ->console.log(([^)]+))
      let modeDebug = useRef<boolean>(false)

      const sleep = (ms: number) => {
            return new Promise<void>((res) => {
                  setTimeout(() => {
                        res()
                  }, ms)
            })
      }

      const handleClickChangePositionImage = async (id: number) => {
            /*
[
  id -> id của Element target (element click)
  run.current -> 1 useRef để lưu trữ trạng thái slider, với mặc định bằng true -> này nó hoạt động như 1 các flag
      .Với true, slider sẽ chạy liên tục trong mỗi 2 giây
      .Với false (được xét mỗi khi onClick), false để xử lí chuyển transform, set id = point và gán lại run.current = true để chạy với các cập nhập mới

  refsList -> là 1 mảng useRef với từng thành viên type là HTMLImageElement, với mỗi refsList item sẽ có attr là data-id
  Khi 1 nút được click ta truyền id của nút, rồi duyệt trong mảng refsList tìm refItem nào có id bằng id của nút
  Kết quả trả về là 1 mảng, và index 0 là item, thông qua đó ta có thể lấy vị trí hiện tại của item bằng offsetWidth để xem item đang lưu lạc ở đâu 
để có thể transform div parent về lại đó

  Ta sẽ xem xét id nút được click và element-current có trên lệch bao nhiêu
    .Dã sử width toàn khối là 1500, sao mỗi lần transform sẽ trừ đi 1500 với ví trí ban đầu là: 0
      .Lần 1: 0, Lần 2: -1500, Lần 3: -3000
  Ta sẽ lấy khoảng cách bằng cách như sau:
    .Dã sử nút nhấn có id là 3, nhưng element current đang là hình 5, vậy là chênh lệch 2, như ban đầu mỗi hình sẽ transform -1500, nhưng hình đầu là 0 vì 0 transform
      .Vậy ta sẽ lấy vị trí paren transform bằng cách = -1500 * (5 - 1)  = -6000
    id nút nhắn là 3: 1500 * 3 = 4500
    Transform parent:  (5 - 3) * 1500 = 3000
  
  Ui: Sau khi đã lấy độ lệch giữa target và current thì sẽ xử lí Ui như
    Ta đã có transform parent nhưng để nó transition trong bao lâu đây, độ lệch không giống như nên time chuyển qua lại cũng khác nhau
    Ta sẽ lấy transform parent / width của parent: 3000 / 1500 = 2s

  Gán lại các giá trị mới như: transform, element target
    .point, scope.current = id (id của nút)
    Ví trí transform mới: chạy từ trái qua nên sẽ có -




]
*/

            run.current = false

            let refTarget = refList.current.filter((ref: HTMLImageElement) => {
                  return Number(ref.getAttribute('data-id')) === id
            })

            let time
            let width = Math.ceil(refTarget[0].offsetWidth) - 0.3
            let idTarget = Number(refTarget[0].getAttribute('data-id')) || 10000

            // khoang cach giua Element-target va Element-current
            let position = (point - id) * width
            let newPosition
            if (sliderWrapper.current) {
                  if (idTarget < point) {
                        time = position / width
                        newPosition = position + -posCurrent.current
                  } else {
                        time = (position / width) * -1
                        newPosition = position + -posCurrent.current
                  }

                  sliderWrapper.current.style.transform = `translate3d(${newPosition}px, 0,0)`
                  sliderWrapper.current.style.transition = `all ${time}s linner`

                  posCurrent.current = -newPosition
                  scope.current = id
                  setPoint(id)

                  await sleep(1000)
                  run.current = true
            }
      }

      const handleClickPrev: React.MouseEventHandler<HTMLElement> = useCallback(async () => {
            run.current = false

            if (point === 1) {
                  await sleep((delay && delay * 1000) || delayTime.current * 1000)
                  run.current = true
                  return
            } else {
                  if (sliderWrapper.current) {
                        posCurrent.current = posCurrent.current - sliderWrapper.current.getBoundingClientRect().width
                        sliderWrapper.current.style.transform = `translate3d(${-posCurrent.current}px, 0,0)`
                        sliderWrapper.current.style.transition = `all ${delay || delayTime.current}s`
                  }

                  setPoint((prev) => prev - 1)
                  scope.current -= 1

                  await sleep((delay && delay * 1000) || delayTime.current * 1000)

                  run.current = true
            }
      }, [])

      const handleClickNext: React.MouseEventHandler<HTMLElement> = useCallback(
            debounce(async () => {
                  run.current = false

                  if (point === hinhAnhSlider.length) {
                        await sleep((delay && delay * 1000) || delayTime.current * 1000)
                        run.current = true
                        return
                  }
                  if (sliderWrapper.current) {
                        posCurrent.current = posCurrent.current + sliderWrapper.current.getBoundingClientRect().width
                        sliderWrapper.current.style.transform = `translate3d(${-posCurrent.current}px, 0,0)`
                        sliderWrapper.current.style.transition = `all ${delay || delayTime.current}s`
                  }

                  setPoint((prev) => prev + 1)
                  scope.current += 1

                  await sleep((delay && delay * 1000) || delayTime.current * 1000)

                  run.current = true
            }, 200),
            [],
      )
      useEffect(() => {
            if (window.innerWidth > 1024) {
                  timerId.current = setInterval(() => {
                        //console.log(([^)]+))
                        if (run.current) {
                              if (sliderWrapper.current) {
                                    if (scope.current === hinhAnhSlider.length || scope.current + 2 > hinhAnhSlider.length - 1) {
                                          posCurrent.current = 0
                                          scope.current = 1
                                          sliderWrapper.current.style.transition = `all 0s`
                                          setPoint(1)

                                          sliderWrapper.current.style.transform = `translateX(${0}px)`
                                    } else {
                                          let width = sliderWrapper.current.getBoundingClientRect().width
                                          posCurrent.current += width

                                          scope.current += 1
                                          setPoint((prev) => (prev += 1))

                                          sliderWrapper.current.style.transform = `translate3d(${-posCurrent.current}px, 0,0)`
                                          sliderWrapper.current.style.transition = `all ${delay || delayTime.current}s`
                                    }
                              }
                        }
                  }, 2000)
                  //    console.log(([^)]+))
            }
            return () => {
                  clearInterval(timerId.current as NodeJS.Timeout)
            }
      }, [])

      useEffect(() => {
            if (containerRefSlider.current) {
                  // eslint-disable-next-line prettier/prettier, @typescript-eslint/no-unused-expressions
                  containerRefSlider.current.style.width = `${width ? `${width}px` : `${widthDefault.current}px`}`
                  containerRefSlider.current.style.height = `${height || heightDefault.current}px`
            }
      }, [])

      return (
            <div
                  className='relative  overflow-x-hidden lg:hidden 2xl:block basis-3/4'
                  ref={containerRefSlider}
                  style={{ maxWidth: '100%' }}
            >
                  <div className={`w-full h-full flex m-w-full  overflox-x-hidden`} ref={sliderWrapper}>
                        {hinhAnhSlider.map((image: string, index: number): React.ReactNode => {
                              if (refList.current) {
                                    return (
                                          <img
                                                src={image}
                                                ref={(el) => {
                                                      refList.current[index] = el as HTMLImageElement
                                                }}
                                                data-id={index + 1}
                                                key={image}
                                                className='w-full h-full min-w-full'
                                                alt=''
                                          />
                                    )
                              }
                        })}
                  </div>
                  <div className='absolute flex gap-3 left-[50%] translate-x-[-50%] bottom-[10px]'>
                        {hinhAnhSlider.map((img: any, index: number) => {
                              return (
                                    <div
                                          key={index}
                                          className={`${point === index + 1 ? 'bg-[blue]' : 'bg-white'} w-[30px] h-[5px]`}
                                          data-id={index + 1}
                                          onClick={() => handleClickChangePositionImage(index + 1)}
                                    ></div>
                              )
                        })}
                  </div>

                  <BoxAbsolute
                        Icon={<ChevronLeft size={55} />}
                        Mode={{ mode: 'CENTER', CornerCenter: 'TOP', CornerRemaining: { left: 20 } }}
                        onClick={handleClickPrev}
                        ClassName='w-[55px] bg-white rounded-[999px] flex justify-center items-center'
                        zIndex={21}
                  />

                  <BoxAbsolute
                        Icon={<ChevronRight size={55} />}
                        Mode={{ mode: 'CENTER', CornerCenter: 'TOP', CornerRemaining: { right: 20 } }}
                        onClick={handleClickNext}
                        ClassName='w-[55px] bg-white rounded-[999px] flex justify-center items-center'
                        zIndex={21}
                  />

                  {modeDebug.current && (
                        <p className='absolute bottom-[-50px] text-white'>
                              Hình hiện tại {point} --{scope.current}{' '}
                        </p>
                  )}
            </div>
      )
}

export default SliderProducts
