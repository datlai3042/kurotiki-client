import SliderProducts from './Components/SliderProducts'
import hinhAnhSlider from './utils/Image'
import Banner from './Components/Banner'
import SectionProduct from './Components/SectionProduct'
import TitleProductSection from './Components/TitleProductSection'
import CountDown from './Components/CountDown'
import Footer from '../Footer/Footer'
import { memo } from 'react'
import SectionProductItem from './Components/SectionProductItem'
import SliderProductV2 from './Components/SliderProductV2'
import ContentLabel from './Components/ContentLabel'
import ProductCare from './Components/ProductCare'
import ProductGenuineBrand from './Components/ProductGenuineBrand'
import ContentBook from './Components/ContentBook'
import ContentFood from './Components/ContentFood'
import ContentProduct from './Components/ContentProduct'
import { useLocation } from 'react-router-dom'
import HomeHero from './Components/HomeHero'
import HomeBenefits from './Components/HomeBenefits'
const showFooter = ['/', '/product']
const Content = () => {
      const pathName = useLocation().pathname
      //  md:w-[calc(100%-235px)]
      return (
            <div className='   w-full    h-max flex flex-col gap-[12px] '>
                  {/* <div className=' hidden 2xl:gap-6 2xl:flex'>
                        <SliderProducts hinhAnhSlider={hinhAnhSlider} height={300} delay={1} />
                        <Banner />
                  </div> */}
                  {/* <div className='w-full '>
                        <div className='w-full p-[20px_0px_16px] h-[480px]   rounded-[4px]'>
                              <SliderProductV2 />
                        </div>
                  </div> */}
                  <HomeHero />
                  <HomeBenefits />

                  {/* <SectionProduct
                        title={<TitleProductSection content={<p className='pl-[13px]'>Giá Tốt Hôm Nay</p>} />}
                        other={
                              <div className='pr-[16px]'>
                                    <CountDown />
                              </div>
                        }
                        ListProducts={
                              <div className=''>
                                    <SectionProductItem />
                              </div>
                        }
                  /> */}

                  <ContentLabel />

                  <SectionProduct
                        title={<TitleProductSection content='Sản phẩm bạn quan tâm' />}
                        description='Gợi ý dựa trên các sản phẩm nổi bật trên KuroTiki'
                        actionText='Xem tất cả'
                        ListProducts={<ProductCare />}
                  />

                  <SectionProduct
                        title={<TitleProductSection content='Thương hiệu chính hãng' />}
                        description='Mua sắm an tâm từ những thương hiệu nổi bật'
                        actionText='Khám phá'
                        ListProducts={<ProductGenuineBrand />}
                  />

                  <ContentBook />
                  {/*                   <ContentFood /> */}

                  <ContentProduct />

                  {showFooter.includes(pathName) && <Footer className='hidden xl:block bg-color-section-theme' />}
            </div>
      )
}

export default memo(Content)
