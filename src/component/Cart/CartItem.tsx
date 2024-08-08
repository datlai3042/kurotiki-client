import { useMutation, useQueryClient } from '@tanstack/react-query'
import Checkbox, { CheckboxChangeEvent } from 'antd/es/checkbox/Checkbox'
import { Building2, ChevronRight, Home, TentTree, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CartService from '../../apis/cart.service'
import { CartProduct, CartShopRef } from '../../types/cart.type'
import { formatMoneyVND } from '../../utils'
import { convertDateToString } from '../../utils/date.utils'
import { DateTimeFromString } from '../../utils/datetime.util'
import BoxMoney from '../BoxUi/BoxMoney'
import BoxConfirmAddress from '../BoxUi/confirm/BoxConfirmAddress'
import BoxConfirmDelete from '../BoxUi/confirm/BoxConfirmDelete'
import WrapperCountProduct from '../BoxUi/WrapperCountProduct'
import CartItemDetail from './CartItemDetail'

type TProps = {
      shop: CartShopRef
      product: CartProduct
}

const CartItem = (props: TProps) => {
      const { product, shop } = props

      const [select, setSelect] = useState<boolean>(product.isSelect)
      const [openBoxConfirmDelete, setOpenBoxConfirmDelete] = useState<boolean>(false)
      const [openBoxCofirmUpdateAddress, setOpenBoxConfirmUpdateAddress] = useState<boolean>(false)
      const [openModelDetail, setOpenModelDetail] = useState<boolean>(false)

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
                  console.log({ axiosResponse })
                  queryClient.invalidateQueries({
                        queryKey: ['v1/api/cart/cart-pay'],
                  })
                  setSelect(axiosResponse.data.metadata.cartUpdateItem.isSelect)
            },
      })

      const deleteCartWithProductId = useMutation({
            mutationKey: ['/v1/api/cart/cart-delete/:product_id'],
            mutationFn: ({ product_id }: { product_id: string }) => CartService.deleteCart({ product_id }),
            onSuccess: () => {
                  queryClient.invalidateQueries({
                        queryKey: ['v1/api/cart/cart-get-my-cart'],
                  })

                  queryClient.invalidateQueries({
                        queryKey: ['v1/api/cart/cart-pay'],
                  })

                  queryClient.invalidateQueries({
                        queryKey: ['cart-get-count-product'],
                  })
            },
      })

      const onDeleteCart = ({ product_id }: { product_id: string }) => {
            deleteCartWithProductId.mutate({ product_id })
      }

      const changeSelect = (e: CheckboxChangeEvent) => {
            updateSelectOneMutation.mutate({ value: e.target.checked, product_id: product.product_id._id })
      }

      const styleEffect = {
            product_not_avaiable: !product._id ? 'text-[12px]' : 'text-[14px]',
            readOnly: !product.product_id.product_state ? true : false,
      }

      // const cart_address_type = product.cart_address.type === 'Home' ? <Home /> : product.cart_address.type === 'Company' ? ''

      const AddressTypeIcon =
            product.cart_address.type === 'Home' ? <Home /> : product.cart_address.type === 'Company' ? <Building2 /> : <TentTree />

      const AddressTypeText =
            product.cart_address.type === 'Home' ? 'Nhà' : product.cart_address.type === 'Company' ? 'Công ty / cơ quan' : 'Nơi ở riêng tư'
      // if (!product.product_id.s) return null
      return (
            <div
                  className='h-[550px] xl:h-[400px] flex flex-col gap-[16px] bg-[#ffffff] px-[12px] py-[20px]'
                  key={product._id}
                  title={product.product_id.product_name}
                  // onClick={}
            >
                  <div className='flex gap-[12px] h-[14%] xl:h-[30%] items-center'>
                        {/* <Checkbox disabled={styleEffect.readOnly} /> */}
                        <Home />
                        <ChevronRight className='hidden xl:block' />
                        <img
                              src={shop.shop_avatar?.secure_url || product.shop_id.shop_avatar_default || ''}
                              className='h-[30px] w-[30px] xl:w-[40px] '
                              alt='shop_avatar'
                        />
                        <Link to={`/shop/${shop._id}`} className='block xl:flex gap-[4px] max-w-[75%] truncate xl:w-full xl:max-w-full'>
                              <span>Cửa hàng:</span>
                              <span className='underline max-w-[70px] truncate'>{shop.shop_name}</span>
                        </Link>
                  </div>
                  <div className='max-h-[75%] h-[75%] xl:max-h-[70%] xl:h-[60%] w-full flex flex-col  gap-[40px]'>
                        <div className='w-full flex  flex-col xl:flex-row gap-[30px] min-h-[230px] h-max xl:min-h-[120px]'>
                              <Checkbox
                                    disabled={styleEffect.readOnly}
                                    className='z-[5] hidden xl:block'
                                    checked={select}
                                    onChange={changeSelect}
                              />
                              <Link
                                    className='inline-block w-[200px] xl:w-[90px] h-[250px] xl:h-[80px]'
                                    to={`/product/${product.product_id._id}`}
                              >
                                    <img
                                          src={product.product_id.product_thumb_image.secure_url}
                                          className='max-w-full max-h-full h-full'
                                          alt='product'
                                    />{' '}
                              </Link>
                              <div
                                    className={`${styleEffect.product_not_avaiable} flex-1 flex flex-wrap flex-col   gap-[4px] xl:gap-[5px] content-between justify-between font-semibold text-slate-700`}
                              >
                                    <span className='max-w-[70%] xl:max-w-[350px] truncate'>
                                          Tên sản phẩm:{product.product_id.product_name}
                                    </span>

                                    <span>Thể loại: Sách</span>
                                    <span>Giao vào ngày mai</span>
                                    <div className='w-[180px] flex xl:hidden items-center  xl:my-[4px] mt-[20px] xl:mt-0 '>
                                          Giá tiền:
                                          <BoxMoney name='VND' money={product.product_id.product_price} colorBackground='bg-blue-600' />
                                    </div>

                                    <div className='hidden xl:flex w-full justify-between'>
                                          <div className='w-[180px] flex items-center  xl:my-[4px] mt-[20px] xl:mt-0 '>
                                                <BoxMoney
                                                      name='VND'
                                                      money={product.product_id.product_price}
                                                      colorBackground='bg-blue-600'
                                                />
                                          </div>
                                          <div className='w-[120px] flex items-center h-max xl:h-full  xl:my-0'>
                                                <WrapperCountProduct
                                                      readOnly={!product.product_id.product_state}
                                                      product_id={product.product_id._id}
                                                      cart_quantity={product.quantity}
                                                />
                                          </div>
                                          <div className='w-[180px]  xl:my-0 flex items-center text-[14px] gap-[2px]'>
                                                <BoxMoney name='VNĐ' money={product.quantity * product.product_id.product_price} />
                                          </div>
                                          <div className='w-[20px] flex items-center  xl:my-0'>
                                                <Trash2 onClick={() => setOpenBoxConfirmDelete(true)} />
                                                {openBoxConfirmDelete && (
                                                      <BoxConfirmDelete
                                                            content='Bạn sẽ xóa sản phẩm này chứ'
                                                            subContent={
                                                                  product.product_id.product_name +
                                                                  ' ' +
                                                                  `SL:${product.quantity}` +
                                                                  ' ' +
                                                                  `Giá: ${formatMoneyVND(
                                                                        product.quantity * product.product_id.product_price,
                                                                  )}` +
                                                                  ' ' +
                                                                  'VNĐ'
                                                            }
                                                            ButtonCancellContent='Hủy'
                                                            ButtonConfrimContent='Xác nhận xóa'
                                                            onClose={setOpenBoxConfirmDelete}
                                                            onActive={onDeleteCart}
                                                            paramsActive={{ product_id: product._id }}
                                                      />
                                                )}
                                          </div>
                                    </div>

                                    {!product.product_id.product_state && (
                                          <span className='text-red-700 font-semibold text-[16px]'>Sản phẩm ngừng kinh doanh</span>
                                    )}
                              </div>
                        </div>

                        <div className='hidden xl:block'>
                              <div className='max-h-[32%] flex flex-wrap flex-col xl:flex-row justify-between ml-0 xl:ml-[16px]  gap-[24px] xl:gap-[16px]'>
                                    <div className='flex flex-col xl:flex-row  gap-[8px] text-slate-800 text-[12px] xl:text-[16px] font-extrabold'>
                                          {/* <TimerIcon className='hidden xl:block' /> */}
                                          <span>Đặt hàng vào lúc:</span>
                                          <span>{DateTimeFromString(product.cart_date)}</span>
                                    </div>
                                    <div className='flex flex-col xl:flex-row xl:items-center gap-[8px] xl:w-full'>
                                          <p className='flex gap-[16px] xl:gap-[8px] items-center'>
                                                <span className='mt-[-4px]'>{AddressTypeIcon}</span>
                                                <span>Giao tại nhà: {AddressTypeText}</span>
                                          </p>
                                          <span className='hidden xl:inline'>-</span>
                                          <span>Địa chỉ {product.cart_address.address_text}</span>
                                          <div className='w-max ml-auto'>
                                                <button
                                                      className='underline text-blue-400'
                                                      onClick={() => setOpenBoxConfirmUpdateAddress(true)}
                                                >
                                                      Cập nhập địa chỉ khác
                                                </button>
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

                  <button onClick={() => setOpenModelDetail(true)} className='block xl:hidden w-[8rem] h-[3rem] bg-blue-300 rounded-lg'>
                        Xem chi tiết
                  </button>
                  {openModelDetail && <CartItemDetail product={product} setOpenModel={setOpenModelDetail} />}

                  {/* <div className='w-[calc(100%+24px)] ml-[-12px] bg-slate-100 h-[2px] my-[8px]'></div> */}
            </div>
      )
}

export default CartItem
