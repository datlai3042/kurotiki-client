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
      const { pathname } = useLocation()
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
            <article
                  className='group overflow-hidden  border border-[var(--border-color-input)] bg-color-section-theme text-text-theme transition-all duration-200 hover:border-blue-500/25 hover:shadow-[0_8px_28px_rgba(15,23,42,0.06)]'
                  key={product._id}
            >
                  {/* Desktop */}
                  <div className='hidden xl:block'>
                        <div className='flex min-h-[164px] items-stretch'>
                              {/* Select */}
                              {pathname === '/cart' && (
                                    <div className='flex w-[52px] shrink-0 items-center justify-center border-r border-[var(--border-color-input)]'>
                                          <Checkbox disabled={styleEffect.readOnly} checked={select} onChange={changeSelect} />
                                    </div>
                              )}

                              {/* Product */}
                              <div className='flex min-w-0 flex-[1.45] gap-4 p-5'>
                                    <Link
                                          to={`/product/${product.product_id._id}`}
                                          className='flex h-[104px] w-[88px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-500/[0.035] p-2'
                                    >
                                          <img
                                                src={product.product_id.product_thumb_image.secure_url}
                                                className='h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]'
                                                alt={product.product_id.product_name}
                                          />
                                    </Link>

                                    <div className={`${styleEffect.product_not_avaiable} min-w-0 pt-0.5`}>
                                          <Link
                                                to={`/product/${product.product_id._id}`}
                                                className='line-clamp-2 text-[15px] font-semibold leading-5 transition hover:text-blue-500'
                                          >
                                                {product.product_id.product_name}
                                          </Link>

                                          <Link
                                                to={`/shop/${product.shop_id._id}`}
                                                className='mt-2 flex max-w-max items-center gap-2 text-[12px] text-slate-500 transition hover:text-blue-500'
                                          >
                                                <img
                                                      src={shop.shop_avatar?.secure_url || product.shop_id.shop_avatar_default || ''}
                                                      className='h-5 w-5 rounded-md object-cover'
                                                      alt='shop_avatar'
                                                />
                                                <span className='max-w-[220px] truncate'>{shop.shop_name}</span>
                                                <ChevronRight size={13} />
                                          </Link>

                                          <div className='mt-3 flex flex-wrap items-center gap-2'>
                                                <span className='inline-flex rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold text-amber-500'>
                                                      Trong giỏ hàng
                                                </span>

                                                <span className='text-[11px] text-slate-400'>
                                                      Thêm lúc {DateTimeFromString(product.cart_date)}
                                                </span>
                                          </div>

                                          {!product.product_id.product_state && (
                                                <span className='mt-2 inline-flex rounded-full bg-red-500/10 px-2 py-1 text-[10px] font-medium text-red-500'>
                                                      Sản phẩm ngừng kinh doanh
                                                </span>
                                          )}
                                    </div>
                              </div>

                              {/* Quantity / price */}
                              <div className='flex w-[270px] shrink-0 flex-col justify-between border-l border-[var(--border-color-input)] p-5'>
                                    <div>
                                          <p className='text-[11px] font-medium uppercase tracking-[0.05em] text-slate-400'>Thành tiền</p>

                                          <div className='mt-1 text-[20px] font-bold text-blue-600'>
                                                <BoxMoney name='VNĐ' money={product.quantity * product.product_id.product_price} />
                                          </div>

                                          <p className=' text-[11px] text-slate-400 flex flex-col my-[10px]'>
                                                <span>Đơn giá </span>
                                                <span className='font-medium text-slate-500'>
                                                      <BoxMoney name='VND' money={product.product_id.product_price} />
                                                </span>
                                          </p>
                                    </div>

                                    <div>
                                          <p className='mb-2 text-[11px] text-slate-400'>Số lượng</p>
                                          <WrapperCountProduct
                                                readOnly={false}
                                                product_id={product.product_id._id}
                                                cart_quantity={product.quantity}
                                                product={product}
                                                modeAction='EDIT'
                                          />
                                    </div>
                              </div>

                              {/* Delivery */}
                              <div className='flex w-[300px] shrink-0 flex-col border-l border-[var(--border-color-input)] p-5'>
                                    <div className='flex items-center gap-2 text-[12px] font-semibold'>
                                          <span className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500'>
                                                {AddressTypeIcon}
                                          </span>
                                          <div className='min-w-0'>
                                                <p>Giao đến</p>
                                                <p className='mt-0.5 text-[10px] font-normal text-slate-400'>{AddressTypeText}</p>
                                          </div>
                                    </div>

                                    <p className='mt-3 line-clamp-2 text-[12px] leading-5 text-slate-500'>
                                          {product.cart_address.address_text}
                                    </p>

                                    {product.cart_address.address_email_vat && (
                                          <p className='mt-1 truncate text-[10px] text-slate-400'>
                                                VAT · {product.cart_address.address_email_vat}
                                          </p>
                                    )}

                                    <button
                                          type='button'
                                          onClick={() => setOpenBoxConfirmUpdateAddress(true)}
                                          className='mt-auto flex h-9 items-center justify-center rounded-lg border border-blue-500/30 bg-blue-500/[0.04] px-3 text-[11px] font-semibold text-blue-500 transition hover:border-blue-500 hover:bg-blue-500 hover:text-white'
                                    >
                                          Đổi địa chỉ giao hàng
                                    </button>
                              </div>

                              {/* Actions */}
                              <div className='flex w-[54px] shrink-0 flex-col items-center justify-between border-l border-[var(--border-color-input)] py-5'>
                                    <button
                                          type='button'
                                          onClick={() => setOpenModelDetail(true)}
                                          title='Xem chi tiết'
                                          className='flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-blue-500/10 hover:text-blue-500'
                                    >
                                          <ChevronRight size={18} />
                                    </button>
                              </div>
                        </div>
                  </div>

                  {/* Mobile / tablet */}
                  <div className='xl:hidden'>
                        <div className='flex items-start gap-3 p-4'>
                              {pathname === '/cart' && (
                                    <Checkbox disabled={styleEffect.readOnly} className='mt-1' checked={select} onChange={changeSelect} />
                              )}

                              <Link
                                    to={`/product/${product.product_id._id}`}
                                    className='flex h-[92px] w-[76px] shrink-0 items-center justify-center rounded-xl bg-slate-500/[0.035] p-1.5'
                              >
                                    <img
                                          src={product.product_id.product_thumb_image.secure_url}
                                          className='h-full w-full object-contain'
                                          alt={product.product_id.product_name}
                                    />
                              </Link>

                              <div className='min-w-0 flex-1'>
                                    <Link
                                          to={`/product/${product.product_id._id}`}
                                          className='line-clamp-2 text-[13px] font-semibold leading-5'
                                    >
                                          {product.product_id.product_name}
                                    </Link>

                                    <Link
                                          to={`/shop/${product.shop_id._id}`}
                                          className='mt-1.5 flex items-center gap-1 text-[11px] text-slate-400'
                                    >
                                          <span className='truncate'>{shop.shop_name}</span>
                                          <ChevronRight size={12} />
                                    </Link>

                                    <span className='mt-2 inline-flex rounded-full bg-amber-500/10 px-2 py-1 text-[10px] font-semibold text-amber-500'>
                                          Trong giỏ hàng
                                    </span>
                              </div>
                        </div>

                        <div className='grid grid-cols-2 gap-3 border-t border-[var(--border-color-input)] px-4 py-3'>
                              <div>
                                    <p className='mb-1.5 text-[10px] text-slate-400'>Số lượng</p>
                                    <WrapperCountProduct
                                          readOnly={false}
                                          product_id={product.product_id._id}
                                          cart_quantity={product.quantity}
                                          product={product}
                                          modeAction='EDIT'
                                    />
                              </div>

                              <div className='text-right'>
                                    <p className='text-[10px] text-slate-400'>Thành tiền</p>
                                    <div className='mt-1 text-[16px] font-bold text-blue-600'>
                                          <BoxMoney name='VNĐ' money={product.quantity * product.product_id.product_price} />
                                    </div>
                              </div>
                        </div>

                        <div className='border-t border-[var(--border-color-input)] p-4'>
                              <div className='flex gap-3'>
                                    <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500'>
                                          {AddressTypeIcon}
                                    </span>

                                    <div className='min-w-0 flex-1'>
                                          <p className='text-[11px] font-semibold'>Giao đến · {AddressTypeText}</p>
                                          <p className='mt-1 line-clamp-2 text-[11px] leading-4 text-slate-500'>
                                                {product.cart_address.address_text}
                                          </p>
                                    </div>
                              </div>

                              <div className='mt-3 grid grid-cols-2 gap-2'>
                                    <button
                                          type='button'
                                          onClick={() => setOpenBoxConfirmUpdateAddress(true)}
                                          className='h-10 rounded-xl border border-blue-500/30 text-[12px] font-semibold text-blue-500'
                                    >
                                          Đổi địa chỉ
                                    </button>

                                    <button
                                          type='button'
                                          onClick={() => setOpenModelDetail(true)}
                                          className='h-10 rounded-xl bg-blue-600 text-[12px] font-semibold text-white'
                                    >
                                          Xem chi tiết
                                    </button>
                              </div>
                        </div>
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
            </article>
      )
}

export default CartItem
