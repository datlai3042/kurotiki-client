import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import img1 from '../assets/img/SliderImage/img1png.webp'
import img2 from '../assets/img/SliderImage/img2.webp'
import img3 from '../assets/img/SliderImage/img3.webp'
import img4 from '../assets/img/SliderImage/img4.webp'
import img5 from '../assets/img/SliderImage/img5.webp'
import img6 from '../assets/img/SliderImage/img6.webp'

const arrayImage = [img1, img2, img3, img4, img5, img6]

const SliderProductV2 = () => {
      const [activeIndex, setActiveIndex] = useState(0)
      const timerRef = useRef<NodeJS.Timeout | null>(null)

      const next = useCallback(() => setActiveIndex((prev) => (prev + 1) % arrayImage.length), [])
      const prev = useCallback(() => setActiveIndex((prev) => (prev - 1 + arrayImage.length) % arrayImage.length), [])

      useEffect(() => {
            timerRef.current = setInterval(next, 4500)
            return () => {
                  if (timerRef.current) clearInterval(timerRef.current)
            }
      }, [next])

      return (
            <div className='group relative h-full w-full overflow-hidden'>
                  <div
                        className='flex h-full w-full transition-transform duration-700 ease-out'
                        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                  >
                        {arrayImage.map((img, index) => (
                              <img src={img} key={img} className='h-full min-w-full object-fill' alt={`KuroTiki banner ${index + 1}`} />
                        ))}
                  </div>

                  <div className='absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/15 px-2 py-1 backdrop-blur-sm'>
                        {arrayImage.map((_, index) => (
                              <button
                                    aria-label={`Banner ${index + 1}`}
                                    key={index}
                                    onClick={() => setActiveIndex(index)}
                                    className={`h-1.5 rounded-full transition-all ${
                                          activeIndex === index ? 'w-5 bg-white' : 'w-1.5 bg-white/55'
                                    }`}
                              />
                        ))}
                  </div>

                  <button
                        aria-label='Banner trước'
                        onClick={prev}
                        className='absolute left-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md backdrop-blur transition hover:bg-white group-hover:flex'
                  >
                        <ChevronLeft size={20} />
                  </button>
                  <button
                        aria-label='Banner tiếp theo'
                        onClick={next}
                        className='absolute right-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md backdrop-blur transition hover:bg-white group-hover:flex'
                  >
                        <ChevronRight size={20} />
                  </button>
            </div>
      )
}

export default SliderProductV2
