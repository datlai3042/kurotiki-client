import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import DeleteProduct from './components/DeleteProduct'
import { TProductDetail } from '../../types/product/product.type'
import { ExternalLink, Pencil, Trash2 } from 'lucide-react'
import { Rate } from 'antd'

type TProps = {
      product: TProductDetail
}

const ProductOwner = (props: TProps) => {
      const { product } = props

      const [modalDeleteProduct, setModalDeleteProduct] = useState<boolean>(false)

      const handleControllModalDeleteProduct = () => {
            setModalDeleteProduct(true)
      }

      return (
            <div className='group flex w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme text-text-theme shadow-sm transition-all duration-300 hover:-translate-y-[2px] hover:border-blue-500/40 sm:w-[calc(50%-8px)] xl:w-[260px]'>
                  {/* Product image */}
                  <Link
                        to={`/product/${product?._id}`}
                        className='relative flex h-[230px] w-full items-center justify-center overflow-hidden bg-color-section-theme p-4'
                  >
                        <img
                              key={product?._id}
                              src={product?.product_thumb_image?.secure_url || ''}
                              className='h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]'
                              alt='product'
                        />
                  </Link>

                  {/* Product info */}
                  <div className='flex min-h-[205px] flex-1 flex-col p-4'>
                        <Link
                              to={`/product/${product?._id}`}
                              className='line-clamp-2 min-h-[42px] text-sm font-semibold leading-5 text-text-theme transition hover:text-blue-500'
                        >
                              {product?.product_name}
                        </Link>

                        <div className=' text-lg font-semibold text-blue-500'>{product?.product_price?.toLocaleString('vi-VN')}đ</div>

                        <div className='mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400'>
                              <span>
                                    Tồn kho: <b className='font-medium text-text-theme'>{product?.product_available ?? 0}</b>
                              </span>

                              <span className='h-3 w-px bg-[var(--border-color-input)]' />

                              <span>
                                    Đã bán: <b className='font-medium text-text-theme'>{product?.product_is_bought ?? 0}</b>
                              </span>

                               <span className='h-3 w-px bg-[var(--border-color-input)]' />

                              <span className='flex items-center gap-1'>
                                    Đánh giá: <b className='font-medium text-text-theme'>{product?.product_votes ?? 0}</b>
                                     <Rate defaultValue={1} count={1} className='text-[14px] ' />
                              </span>
                        </div>

                        {/* Keep actions at the bottom and prevent wrapping */}
                        <div className='mt-auto grid grid-cols-[1fr_1fr_auto] gap-2 border-t border-[var(--border-color-input)] pt-4'>
                              <Link
                                    to={`/product/${product?._id}`}
                                    className='inline-flex h-9 min-w-0 items-center justify-center gap-1 rounded-lg border border-[var(--border-color-input)] px-2 text-[11px] font-medium text-text-theme transition hover:border-blue-500 hover:text-blue-500'
                              >
                                    <ExternalLink size={13} strokeWidth={1.8} className='shrink-0' />
                                    <span className='truncate'>Link sản phẩm</span>
                              </Link>

                              <Link
                                    to={`/product/update/${product?._id}`}
                                    className='inline-flex h-9 min-w-0 items-center justify-center gap-1 rounded-lg border border-[var(--border-color-input)] px-2 text-[11px] font-medium text-text-theme transition hover:border-blue-500 hover:text-blue-500'
                              >
                                    <Pencil size={13} strokeWidth={1.8} className='shrink-0' />
                                    <span className='truncate'>Chỉnh sửa</span>
                              </Link>

                              <button
                                    className='inline-flex h-9 shrink-0 items-center justify-center gap-1 rounded-lg bg-red-600 px-3 text-[11px] font-medium text-white transition hover:bg-red-500'
                                    onClick={handleControllModalDeleteProduct}
                              >
                                    <Trash2 size={13} strokeWidth={1.8} />
                                    Xóa
                              </button>
                        </div>
                  </div>

                  {modalDeleteProduct && (
                        <DeleteProduct product_id={product?._id as string} setModalDeleteProduct={setModalDeleteProduct} />
                  )}
            </div>
      )
}

export default ProductOwner
