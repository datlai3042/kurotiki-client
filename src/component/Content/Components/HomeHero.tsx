import { ArrowRight, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import SliderProductV2 from './SliderProductV2'

const HomeHero = () => {
      return (
            <section className='flex flex-col w-full md:grid grid-cols-1 gap-3 pt-3 lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,.95fr)]'>
                  <div className='h-[260px] overflow-hidden rounded bg-color-section-theme shadow-sm sm:h-[320px] xl:h-[550px]'>
                        <SliderProductV2 />
                  </div>

                  <div className='flex grid-rows-2 gap-3 lg:grid'>
                        <Link
                              to='/book'
                              className='group relative overflow-hidden rounded border border-[var(--border-color-input)] bg-color-section-theme shadow-sm'
                        >
                              <img
                                    src={'/banner-freeship.png'}
                                    alt='Khuyến mãi nổi bật'
                                    className='absolute inset-0 h-full w-full object-fill  object-center  transition duration-300 group-hover:scale-[1.025]'
                              />
                              <div className='absolute inset-0 bg-gradient-to-r from-black/35  to-transparent' />
                              <div className='relative z-[1] flex h-full max-w-[70%] flex-col justify-end gap-2 p-5 text-white'>
                                    <span className='w-max rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold backdrop-blur'>
                                          Ưu đãi nổi bật
                                    </span>
                                    <h2 className='text-lg font-bold leading-tight'>Khám phá deal mới mỗi ngày</h2>
                                    <span className='flex items-center gap-1.5 text-sm font-medium'>
                                          Xem ngay <ArrowRight size={15} />
                                    </span>
                              </div>
                        </Link>

                        <Link
                              to='/food'
                              className='group relative overflow-hidden rounded border border-[var(--border-color-input)] bg-color-section-theme shadow-sm'
                        >
                              <img
                                    src={'/banner-import-usa.png'}
                                    alt='Freeship mỗi ngày'
                                    className='absolute inset-0 h-full w-full object-fill  object-center  transition duration-300 group-hover:scale-[1.025]'
                              />
                              <div className='absolute inset-0 bg-gradient-to-r from-blue-950/45  to-transparent' />
                              <div className='relative z-[1] flex h-full max-w-[72%] flex-col justify-end gap-2 p-5 text-white'>
                                    <span className='flex w-max items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold backdrop-blur'>
                                          <Truck size={13} /> Freeship
                                    </span>
                                    <h2 className='text-lg font-bold leading-tight'>Mua sắm tiện lợi, giao hàng nhanh</h2>
                                    <span className='flex items-center gap-1.5 text-sm font-medium'>
                                          Mua ngay <ArrowRight size={15} />
                                    </span>
                              </div>
                        </Link>
                  </div>
            </section>
      )
}

export default HomeHero
