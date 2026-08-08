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
                  className='overflow-hidden border-b border-[var(--border-color-input)] bg-color-section-theme text-text-theme last:border-b-0'
                  key={product._id}
            >
                  {/* Desktop row - styled like the generated order-management mockup */}
                  <div className='hidden min-h-[122px] w-full rounded  gap-5 px-5 py-4 xl:grid xl:grid-cols-[28px_86px_minmax(0,1.35fr)_220px_180px_170px]'>
                        {/* Select */}
                        <div className='flex items-center justify-center'>
                              {pathname === '/cart' && (
                                    <Checkbox
                                          disabled={styleEffect.readOnly}
                                          className='z-[5]'
                                          checked={select}
                                          onChange={changeSelect}
                                    />
                              )}
                        </div>

                        {/* Product image */}
                        <Link
                              to={`/product/${product.product_id._id}`}
                              className='flex h-[86px] w-[86px] items-center justify-center overflow-hidden rounded-lg border border-[var(--border-color-input)] bg-white/95 p-1'
                        >
                              <img
                                    src={product.product_id.product_thumb_image.secure_url}
                                    className='h-full w-full rounded-md object-contain'
                                    alt='product'
                              />
                        </Link>

                        {/* Product / shop info */}
                        <div className={`${styleEffect.product_not_avaiable} min-w-0`}>
                              <Link
                                    to={`/product/${product.product_id._id}`}
                                    className=' text-[14px] font-semibold text-text-theme transition hover:text-blue-500'
                              >
                                    {product.product_id.product_name}
                              </Link>

                              <Link
                                    to={`/shop/${product.shop_id._id}`}
                                    className='mt-2 flex min-w-0 items-center gap-2 text-[13px] text-slate-400 transition hover:text-blue-500'
                              >
                                    <img
                                          src={shop.shop_avatar?.secure_url || product.shop_id.shop_avatar_default || ''}
                                          className='h-5 w-5 shrink-0 rounded object-cover'
                                          alt='shop_avatar'
                                    />
                                    <span className='truncate'>{shop.shop_name}</span>
                              </Link>

                              <p className='mt-1.5 text-[12px] text-slate-500'>
                                    1 sản phẩm trong giỏ
                              </p>

                              {!product.product_id.product_state && (
                                    <span className='mt-2 inline-flex rounded-full bg-red-500/10 px-2 py-1 text-[11px] font-medium text-red-400'>
                                          Sản phẩm ngừng kinh doanh
                                    </span>
                              )}
                        </div>

                        {/* Quantity + date */}
                        <div className='border-l border-[var(--border-color-input)] pl-5'>
                              <div className='mb-2 inline-flex rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-extrabold text-[#fcab43]'>
                                    Trong giỏ hàng
                              </div>

                              <p className='mb-2 text-[12px] text-slate-400'>
                                    Thêm lúc {DateTimeFromString(product.cart_date)}
                              </p>

                              <div className='flex items-center gap-2'>
                                    <span className='text-[12px] text-slate-500'>Số lượng</span>
                                    <WrapperCountProduct
                                          readOnly={false}
                                          product_id={product.product_id._id}
                                          cart_quantity={product.quantity}
                                          product={product}
                                          modeAction='EDIT'
                                    />
                              </div>
                        </div>

                        {/* Price */}
                        <div className='border-l border-[var(--border-color-input)] pl-5'>
                              <p className='text-[12px] text-slate-400'>Tổng tiền</p>

                              <div className='mt-1 text-[20px] font-semibold text-text-theme'>
                                    <BoxMoney
                                          name='VNĐ'
                                          money={product.quantity * product.product_id.product_price}
                                    />
                              </div>

                              <div className='mt-1 text-[12px] text-slate-500'>
                                    Đơn giá{' '}
                                    <span className='text-slate-400'>
                                          <BoxMoney name='VND' money={product.product_id.product_price} />
                                    </span>
                              </div>
                        </div>

                        {/* Action */}
                        <div className='flex flex-col items-end gap-2'>
                              <BoxButton
                                    content='Cập nhập địa chỉ khác'
                                    onClick={() => setOpenBoxConfirmUpdateAddress(true)} 
                                    className='!h-max'
                              />

                              {openBoxCofirmUpdateAddress && (
                                    <BoxConfirmAddress
                                          setOpenModal={setOpenBoxConfirmUpdateAddress}
                                          product_id={product.product_id._id}
                                          mode='Update'
                                          cart_item={product}
                                    />
                              )}

                              <div className='flex max-w-[170px] items-center gap-1 text-right text-[11px] leading-4 text-slate-500'>
                                    <span className='truncate'>
                                          {AddressTypeText} · {product.cart_address.address_text}
                                    </span>
                              </div>
                        </div>
                  </div>

                  {/* Mobile / tablet */}
                  <div className='flex flex-col gap-4 p-4 xl:hidden'>
                        <div className='flex items-start gap-3'>
                              {pathname === '/cart' && (
                                    <Checkbox
                                          disabled={styleEffect.readOnly}
                                          className='z-[5] mt-1'
                                          checked={select}
                                          onChange={changeSelect}
                                    />
                              )}

                              <Link
                                    to={`/product/${product.product_id._id}`}
                                    className='flex h-[82px] w-[82px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[var(--border-color-input)] bg-white p-1'
                              >
                                    <img
                                          src={product.product_id.product_thumb_image.secure_url}
                                          className='h-full w-full rounded-lg object-contain'
                                          alt='product'
                                    />
                              </Link>

                              <div className='min-w-0 flex-1'>
                                    <Link
                                          to={`/product/${product.product_id._id}`}
                                          className='line-clamp-2 text-sm font-semibold text-text-theme'
                                    >
                                          {product.product_id.product_name}
                                    </Link>

                                    <Link
                                          to={`/shop/${product.shop_id._id}`}
                                          className='mt-1.5 block truncate text-xs text-blue-500'
                                    >
                                          {shop.shop_name}
                                    </Link>

                                    <p className='mt-1 text-xs text-slate-500'>
                                          {DateTimeFromString(product.cart_date)}
                                    </p>
                              </div>
                        </div>

                        <div className='flex items-center justify-between border-t border-[var(--border-color-input)] pt-3'>
                              <WrapperCountProduct
                                    readOnly={false}
                                    product_id={product.product_id._id}
                                    cart_quantity={product.quantity}
                                    product={product}
                                    modeAction='EDIT'
                              />

                              <div className='text-right'>
                                    <p className='text-xs text-slate-500'>Tổng tiền</p>
                                    <div className='text-base font-semibold text-blue-500'>
                                          <BoxMoney
                                                name='VNĐ'
                                                money={product.quantity * product.product_id.product_price}
                                          />
                                    </div>
                              </div>
                        </div>

                        <div className='flex gap-2'>
                              <button
                                    onClick={() => setOpenBoxConfirmUpdateAddress(true)}
                                    className='flex-1 rounded-xl border border-blue-500/60 px-3 py-2.5 text-sm font-medium text-blue-500'
                              >
                                    Đổi địa chỉ
                              </button>

                              <button
                                    onClick={() => setOpenModelDetail(true)}
                                    className='flex-1 rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-medium text-white'
                              >
                                    Xem chi tiết
                              </button>
                        </div>

                        {openBoxCofirmUpdateAddress && (
                              <BoxConfirmAddress
                                    setOpenModal={setOpenBoxConfirmUpdateAddress}
                                    product_id={product.product_id._id}
                                    mode='Update'
                                    cart_item={product}
                              />
                        )}
                  </div>

                  {openModelDetail && (
                        <CartItemDetail product={product} setOpenModel={setOpenModelDetail} />
                  )}
            </div>
      )
}

export default CartItem