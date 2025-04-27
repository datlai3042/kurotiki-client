import { useEffect, useState } from 'react'
import Checkbox, { CheckboxChangeEvent } from 'antd/es/checkbox/Checkbox'
import { Building2, ChevronRight, Home, TentTree, Trash2 } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { DateTimeFromString } from '../../utils/datetime.util'
import WrapperCountProduct from '../BoxUi/WrapperCountProduct'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import CartService from '../../apis/cart.service'
import { CartProduct, CartShopRef } from '../../types/cart.type'
import { convertDateToString } from '../../utils/date.utils'
import { formatMoneyVND } from '../../utils'
import BoxMoney from '../BoxUi/BoxMoney'
import BoxConfirmDelete from '../BoxUi/confirm/BoxConfirmDelete'
import BoxButton from '../BoxUi/BoxButton'
import BoxConfirmAddress from '../BoxUi/confirm/BoxConfirmAddress'
import CartItemDetail from './CartItemDetail'

type TProps = {
      shop: CartShopRef
      product: CartProduct
}

const CartItem = (props: TProps) => {
      const { product, shop } = props

      const [select, setSelect] = useState<boolean>(product.isSelect)
      const [openBoxCofirmUpdateAddress, setOpenBoxConfirmUpdateAddress] = useState<boolean>(false)
      const [openModelDetail, setOpenModelDetail] = useState<boolean>(false)
      const {pathname} = useLocation()
      const queryClient = useQueryClient()

      useEffect(() => {
            // if (select !== product.product_is_select) {
            setSelect(product.isSelect)
            // }
      }, [product.isSelect])

      useEffect(() => {}, [product.quantity])

      const updateSelectOneMutation = useMutation({
            mutationKey: ['/v1/api/cart/cart-change-select-one'],
            mutationFn: ({ value, product_id }: { value: boolean; product_id: string }) => CartService.selectCartOne({ value, product_id }),
            onSuccess: (axiosResponse) => {
                  queryClient.invalidateQueries({
                        queryKey: ['v1/api/cart/cart-pay'],
                  })
                  setSelect(axiosResponse.data.metadata.cartUpdateItem.isSelect)
            },
      })

      const changeSelect = (e: CheckboxChangeEvent) => {
            updateSelectOneMutation.mutate({ value: e.target.checked, product_id: product.product_id._id })
      }

      const styleEffect = {
            product_not_avaiable: !product._id ? 'text-[12px]' : '',
            readOnly: false,
      }

      // const cart_address_type = product.cart_address.type === 'Home' ? <Home /> : product.cart_address.type === 'Company' ? ''

      const AddressTypeIcon =
            product.cart_address.type === 'Home' ? <Home /> : product.cart_address.type === 'Company' ? <Building2 /> : <TentTree />

      const AddressTypeText =
            product.cart_address.type === 'Home' ? 'Nhà' : product.cart_address.type === 'Company' ? 'Công ty / cơ quan' : 'Nơi ở riêng tư'
      // if (!product.product_id.s) return null
      return (
            <div
                  className=' flex flex-col gap-[24px] bg-color-section-theme text-text-theme p-[0px_12px_16px] text-[13px]'
                  key={product._id}
            >
                  <div className='w-full flex  py-[24px] flex-wrap gap-[10px]  items-center justify-between'>
                        <div className='flex gap-[12px]  items-center'>
                              {/* <Checkbox disabled={styleEffect.readOnly} /> */}
                              {/* <Home />
                        <ChevronRight className='hidden xl:block' /> */}
                              <img
                                    src={shop.shop_avatar?.secure_url || product.shop_id.shop_avatar_default || ''}
                                    className='h-[30px] w-[30px] xl:w-[40px] '
                                    alt='shop_avatar'
                              />
                              <Link to={`/shop/${product.shop_id._id}`} className='block xl:flex gap-[4px] w-full group'>
                                    <span>Cửa hàng:</span>
                                    <span className='text-color-main font-semibold group-hover:underline'>{shop.shop_name}</span>
                              </Link>
                        </div>

                        <span className='ml-[43px]'>{DateTimeFromString(product.cart_date)}</span>
                  </div>
                  <div className='w-full flex flex-col  gap-[40px]'>
                        <div className='w-full flex  flex-col xl:flex-row gap-[30px] min-h-[230px] h-max xl:min-h-[80px]'>
                              {pathname === '/cart' && (
                                    <Checkbox
                                          disabled={styleEffect.readOnly}
                                          className='z-[5] block'
                                          checked={select}
                                          onChange={changeSelect}
                                    />
                              )}
                              <Link className='inline-block h-[250px] xl:h-[80px]' to={`/product/${product.product_id._id}`}>
                                    <img
                                          src={product.product_id.product_thumb_image.secure_url}
                                          className='max-w-full max-h-full h-full'
                                          alt='product'
                                    />{' '}
                              </Link>
                              <div
                                    className={`${styleEffect.product_not_avaiable} flex-1 flex  flex-col   gap-[12px]  content-between justify-between font-semibold text-text-theme`}
                              >
                                    <div className='w-full flex justify-between'>
                                          <span>{product.product_id.product_name}</span>

                                          <div className='ml-auto flex items-center h-max xl:h-full  xl:my-0'>
                                                <WrapperCountProduct
                                                      readOnly={false}
                                                      product_id={product.product_id._id}
                                                      cart_quantity={product.quantity}
                                                      product={product}
                                                      modeAction='EDIT'
                                                />
                                          </div>
                                    </div>
                                    <div className='w-full flex justify-between'>
                                          <div className='flex gap-[8px] items-center'>
                                                <span>Giá gốc: </span>
                                                <BoxMoney name='VND' money={product.product_id.product_price} />
                                          </div>

                                          <div className=' flex items-center gap-[8px] h-max xl:h-full  xl:my-0 text-color-main text-[20px]'>
                                                <BoxMoney name='VNĐ' money={product.quantity * product.product_id.product_price} />
                                          </div>
                                    </div>
                                    <span>Thể loại: Sách</span>
                                    <span>Giao vào ngày mai</span>
                                    <div className='flex flex-col xl:flex-row xl:items-center gap-[8px] xl:w-[80%]'>
                                          <p className='flex gap-[16px] xl:gap-[8px] items-center'>
                                                <span>Giao tại nhà: {AddressTypeText}</span>
                                          </p>
                                          <span className='hidden xl:inline'>-</span>
                                          <span>Địa chỉ {product.cart_address.address_text}</span>
                                    </div>
                                    {!product.product_id.product_state && (
                                          <span className='text-red-700 font-semibold text-[16px]'>Sản phẩm ngừng kinh doanh</span>
                                    )}
                              </div>
                        </div>

                        <div className='hidden xl:block'>
                              <div className=' flex flex-wrap flex-col xl:flex-row justify-between ml-0 xl:ml-[16px]  gap-[24px] xl:gap-[16px]'>
                                    <div className='w-full flex flex-col xl:flex-row xl:items-center justify-end gap-[8px] '>
                                          <div className='w-max'>
                                                <BoxButton
                                                      content='Cập nhập địa chỉ khác'
                                                      onClick={() => setOpenBoxConfirmUpdateAddress(true)}
                                                />
                                                {openBoxCofirmUpdateAddress && (
                                                      <BoxConfirmAddress
                                                            setOpenModal={setOpenBoxConfirmUpdateAddress}
                                                            product_id={product.product_id._id}
                                                            mode='Update'
                                                            cart_item={product}
                                                      />
                                                )}
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </div>

                  <button
                        onClick={() => setOpenModelDetail(true)}
                        className='block xl:hidden p-[6px] bg-color-main text-[#fff] opacity-80 hover:opacity-100'
                  >
                        Xem chi tiết
                  </button>
                  {openModelDetail && <CartItemDetail product={product} setOpenModel={setOpenModelDetail} />}
            </div>
      )
}

export default CartItem
