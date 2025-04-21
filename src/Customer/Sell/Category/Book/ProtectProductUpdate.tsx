import React from 'react'
import { TProductDetail } from '../../../../types/product/product.type'

type TProps = {
      ElementPrivate: React.ReactElement
      ElementPublic: React.ReactElement
      isSuccess: boolean
      product: TProductDetail | null
}

const ProtectProductUpdate = (props: TProps): JSX.Element => {
      const { ElementPrivate, ElementPublic, isSuccess, product } = props
      const element = ElementPrivate
      const elementPublic = ElementPublic
      console.log({isSuccess, product, mout: 'ok'})
      if (isSuccess && product) {
            return element
      }
      return elementPublic
}

export default ProtectProductUpdate
