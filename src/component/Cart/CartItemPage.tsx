import { useEffect, useState } from 'react'
import Checkbox, { CheckboxChangeEvent } from 'antd/es/checkbox/Checkbox'
import { Building2, Home, MapPin, TentTree } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { DateTimeFromString } from '../../utils/datetime.util'
import WrapperCountProduct from '../BoxUi/WrapperCountProduct'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import CartService from '../../apis/cart.service'
import { CartProduct, CartShopRef } from '../../types/cart.type'
import BoxMoney from '../BoxUi/BoxMoney'
import BoxConfirmAddress from '../BoxUi/confirm/BoxConfirmAddress'
import CartItemDetail from './CartItemDetail'

type TProps = {
      shop: CartShopRef
      product: CartProduct
}

const CartItemPage = (props: TProps) => {
      const { product, shop } = props

      const [select, setSelect] = useState<boolean>(product.isSelect)
      const [openBoxCofirmUpdateAddress, setOpenBoxConfirmUpdateAddress] = useState<boolean>(false)
      const [openModelDetail, setOpenModelDetail] = useState<boolean>(false)
      const { pathname } = useLocation()
      const queryClient = useQueryClient()

      useEffect(() => {
            setSelect(product.isSelect)
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
            updateSelectOneMutation.mutate({
                  value: e.target.checked,
                  product_id: product.product_id._id,
            })
      }

      const styleEffect = {
            product_not_avaiable: !product._id ? 'text-[12px]' : '',
            readOnly: false,
      }

      const AddressTypeIcon =
            product.cart_address.type === 'Home' ? (
                  <Home size={13} />
            ) : product.cart_address.type === 'Company' ? (
                  <Building2 size={13} />
            ) : (
                  <TentTree size={13} />
            )

      const AddressTypeText =
            product.cart_address.type === 'Home' ? 'Nhà' : product.cart_address.type === 'Company' ? 'Công ty / cơ quan' : 'Nơi ở riêng tư'

      return (
            <div
                  className='overflow-hidden rounded-2xl border border-slate-200/70 bg-color-section-theme text-text-theme shadow-[0_4px_18px_rgba(15,23,42,0.035)] dark:border-white/[0.07]'
                  key={product._id}
            >
                  {/* Desktop */}
                  <div className='hidden xl:block'>
                        <div className='grid grid-cols-[36px_88px_minmax(0,1fr)_120px_128px_130px] items-center gap-4 px-5 py-4'>
                              <div className='flex justify-center'>
                                    {pathname === '/cart' && (
                                          <Checkbox disabled={styleEffect.readOnly} checked={select} onChange={changeSelect} />
                                    )}
                              </div>

                              <Link
                                    to={`/product/${product.product_id._id}`}
                                    className='flex h-[88px] w-[88px] items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-1 dark:border-white/[0.08]'
                              >
                                    <img
                                          src={product.product_id.product_thumb_image.secure_url}
                                          className='h-full w-full rounded-lg object-contain'
                                          alt='product'
                                    />
                              </Link>

                              <div className={`${styleEffect.product_not_avaiable} min-w-0`}>
                                    <Link
                                          to={`/product/${product.product_id._id}`}
                                          className='line-clamp-2 max-w-[330px] text-[14px] font-semibold leading-[20px] text-text-theme transition hover:text-blue-500'
                                    >
                                          {product.product_id.product_name}
                                    </Link>

                                    <Link
                                          to={`/shop/${product.shop_id._id}`}
                                          className='mt-1.5 flex min-w-0 items-center gap-2 text-[12px] text-slate-500 transition hover:text-blue-500 dark:text-slate-400'
                                    >
                                          <img
                                                src={shop.shop_avatar?.secure_url || product.shop_id.shop_avatar_default || ''}
                                                className='h-5 w-5 shrink-0 rounded-md border border-slate-200 object-cover dark:border-white/[0.08]'
                                                alt='shop_avatar'
                                          />
                                          <span className='truncate'>{shop.shop_name}</span>
                                    </Link>

                                    <div className='mt-2 flex flex-wrap items-center gap-2'>
                                          <span className='inline-flex rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-500'>
                                                Trong giỏ hàng
                                          </span>
                                    </div>

                                    <p className='mt-1.5 text-[11px] text-slate-400'>Thêm lúc {DateTimeFromString(product.cart_date)}</p>

                                    {!product.product_id.product_state && (
                                          <span className='mt-2 inline-flex rounded-full bg-red-500/10 px-2.5 py-1 text-[11px] font-medium text-red-500'>
                                                Sản phẩm ngừng kinh doanh
                                          </span>
                                    )}
                              </div>

                              <div className='text-[14px] font-semibold text-text-theme'>
                                    <BoxMoney name='VND' money={product.product_id.product_price} />
                              </div>

                              <div className='flex justify-center'>
                                    <WrapperCountProduct
                                          readOnly={false}
                                          product_id={product.product_id._id}
                                          cart_quantity={product.quantity}
                                          product={product}
                                          modeAction='EDIT'
                                    />
                              </div>

                              <div className='text-right text-[15px] font-semibold text-blue-600 dark:text-blue-400'>
                                    <BoxMoney name='VNĐ' money={product.quantity * product.product_id.product_price} />
                              </div>
                        </div>

                        <div className='mx-5 mb-4 flex items-center justify-between gap-3 rounded-xl border border-[var(--border-color-input)] bg-slate-50/60 px-4 py-2.5  dark:bg-white/[0.025]'>
                              <div className='flex min-w-0 items-start gap-2.5'>
                                    <MapPin size={15} className='mt-[2px] shrink-0 text-blue-500' />

                                    <div className='min-w-0'>
                                          <div className='flex items-center gap-2 text-[12px]'>
                                                <span className='font-semibold text-text-theme'>Giao đến:</span>
                                                <span className='inline-flex items-center gap-1 text-slate-500 dark:text-slate-400'>
                                                      {AddressTypeIcon}
                                                      {AddressTypeText}
                                                </span>
                                          </div>

                                          <p className='mt-0.5 line-clamp-1 text-[12px] text-slate-500 dark:text-slate-400'>
                                                {product.cart_address.address_text}
                                          </p>
                                    </div>
                              </div>

                              <button
                                    type='button'
                                    onClick={() => setOpenBoxConfirmUpdateAddress(true)}
                                    className='shrink-0 text-[12px] font-medium text-blue-600 transition hover:text-blue-700 dark:text-blue-400'
                              >
                                    Thay đổi
                              </button>
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
                                    className='flex h-[88px] w-[78px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-1 dark:border-white/[0.08]'
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
                                          className='line-clamp-2 text-[14px] font-semibold leading-5 text-text-theme'
                                    >
                                          {product.product_id.product_name}
                                    </Link>

                                    <Link to={`/shop/${product.shop_id._id}`} className='mt-1.5 block truncate text-[12px] text-slate-500'>
                                          {shop.shop_name}
                                    </Link>

                                    <div className='mt-2 text-[15px] font-semibold text-blue-600 dark:text-blue-400'>
                                          <BoxMoney name='VNĐ' money={product.quantity * product.product_id.product_price} />
                                    </div>
                              </div>
                        </div>

                        <div className='flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-white/[0.03]'>
                              <span className='text-[12px] text-slate-500'>Số lượng</span>
                              <WrapperCountProduct
                                    readOnly={false}
                                    product_id={product.product_id._id}
                                    cart_quantity={product.quantity}
                                    product={product}
                                    modeAction='EDIT'
                              />
                        </div>

                        <div className='rounded-xl border border-[var(--border-color-input)]'>
                              <div className='flex items-center p-[10px_30px] gap-2'>
                                    <MapPin size={15} className='mt-[2px] shrink-0 text-blue-500' />

                                    <div className='min-w-0 flex-1'>
                                          <p className='text-[12px] font-semibold text-text-theme'>Giao đến</p>
                                          <p className='mt-1 line-clamp-2 text-[11px] leading-4 text-slate-500 dark:text-slate-400'>
                                                {product.cart_address.address_text}
                                          </p>
                                    </div>

                                    <button
                                          type='button'
                                          onClick={() => setOpenBoxConfirmUpdateAddress(true)}
                                          className='shrink-0 text-[12px] font-medium text-blue-600 dark:text-blue-400'
                                    >
                                          Đổi
                                    </button>
                              </div>
                        </div>

                        <button
                              onClick={() => setOpenModelDetail(true)}
                              className='h-10 rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 text-sm font-medium text-blue-600 transition hover:bg-blue-500/15 dark:text-blue-400'
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

                  {openModelDetail && <CartItemDetail product={product} setOpenModel={setOpenModelDetail} />}
            </div>
      )
}

export default CartItemPage
