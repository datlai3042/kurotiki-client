import React, { ComponentType } from 'react'
import ShopApi from '../../../apis/shop.api'
import { STALE_TIME } from '../../../component/Comment/Comment'
import { useQuery } from '@tanstack/react-query'
import { TProductDetail } from '../../../types/product/product.type'

export type TPropsC = {
      TransitionTime: number
}

type TProps<PropsChildren> = {
      limit: number
      shop_id: string
      sort: keyof TProductDetail
      inc: 1 | -1
      Component: ComponentType<PropsChildren & { products: TProductDetail[] }>
      ComponentProps?: PropsChildren
}

const ProductTopSellQuery = <PropsChildren,>(props: TProps<PropsChildren>) => {
      const { limit, shop_id, sort, Component, inc } = props

      const getProductBestSell = useQuery({
            queryKey: ['get-product-seller', limit, shop_id],
            queryFn: () => ShopApi.getProductFilter({ shop_id: shop_id as string, page: 1, limit, sort, inc: inc }),
            enabled: !!shop_id,
            staleTime: STALE_TIME,
      })

      const WrapperComponent = (props: PropsChildren) => {
            const products = getProductBestSell.data?.data.metadata.shop.shop_products as TProductDetail[]
            if (getProductBestSell.isSuccess) {
                  return <Component {...(props as PropsChildren)} products={products} />
            }
            return <p className='skeleton__container w-full h-[500px] '></p>
      }

      return WrapperComponent
      // return (
      //       <>
      //             {shop && (
      //                   <div className='mx-[10px] xl:mx-0 h-[200px] xl:h-[500px] flex items-center justify-center xl:block'>
      //                         {/* <ProductSlider
      //                               products={[...shop.shop_products]
      //                                     .concat(shop.shop_products)
      //                                     .concat(shop.shop_products)
      //                                     .concat(shop.shop_products)}
      //                               TransitionTime={3}
      //                         /> */}
      //                         <Layout products={shop.shop_products}></Layout>
      //                   </div>
      //             )}
      //       </>
      // )
}

export default ProductTopSellQuery
