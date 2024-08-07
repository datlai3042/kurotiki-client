import { memo } from 'react'
import { useLocation } from 'react-router-dom'
import Footer from '../Footer/Footer'
import ContentBook from './Components/ContentBook'
import ContentLabel from './Components/ContentLabel'
import ContentProduct from './Components/ContentProduct'
import CountDown from './Components/CountDown'
import ProductCare from './Components/ProductCare'
import ProductGenuineBrand from './Components/ProductGenuineBrand'
import SectionProduct from './Components/SectionProduct'
import SectionProductItem from './Components/SectionProductItem'
import SliderProductV2 from './Components/SliderProductV2'
import TitleProductSection from './Components/TitleProductSection'

const Content = () => {
      const pathName = useLocation().pathname

      return (
            <div className='   w-full xl:w-[calc(100%-250px)]  h-max flex flex-col gap-[20px] '>
                  {/* <div className=' hidden 2xl:gap-6 2xl:flex'>
                        <SliderProducts hinhAnhSlider={hinhAnhSlider} height={300} delay={1} />
                        <Banner />
                  </div> */}

                  <div className='w-full p-[20px_16px_32px]  min-h-[250px] xl:min-h-[300px] h-max bg-[#ffffff] rounded-lg'>
                        <SliderProductV2 />
                  </div>

                  <SectionProduct
                        title={<TitleProductSection content={<p className='pl-[13px]'>Gía Tốt Hôm Nay</p>} />}
                        other={<CountDown />}
                        ListProducts={<SectionProductItem />}
                  />

                  <ContentLabel />

                  <SectionProduct
                        title={<TitleProductSection content='Sản phẩm bạn quan tâm' />}
                        // other={<CountDown />}
                        ListProducts={<ProductCare />}
                  />

                  <SectionProduct
                        title={<TitleProductSection content='Hàng chính hãng' />}
                        // other={<CountDown />}
                        background={`linear-gradient(rgba(255, 255, 255, 0) 22.49%, rgb(255, 255, 255) 73.49%), linear-gradient(264.03deg, rgb(220, 229, 251)
                  -10.27%, rgb(234, 236, 255) 35.65%, rgb(213, 236, 253) 110.66%)`}
                        ListProducts={<ProductGenuineBrand />}
                  />

                  <ContentBook />
{/*                   <ContentFood /> */}

                  <ContentProduct />

                  {pathName === '/' && <Footer className='hidden xl:block bg-[#ffffff]' />}
            </div>
      )
}

export default memo(Content)
