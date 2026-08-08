import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

/**
 * Breadcrumb
 *
 * Ví dụ dùng trong trang chi tiết sản phẩm:
 *
 * {getProductWithId.data?.data && (
 *   <Breadcrumb
 *     items={[
 *       { label: "Trang chủ", to: "/" },
 *       { label: renderType(product?.product_type), to: `/${product?.product_type}` },
 *       { label: product?.attribute.type },
 *     ]}
 *   />
 * )}
 *
 * Mục cuối cùng (không có `to`) được coi là trang hiện tại, hiển thị dạng
 * text đậm thay vì link.
 */
export default function Breadcrumb({ items = [] }: { items: { label: string; to?: string }[] }) {
      return (
            <div className='flex items-center gap-[8px] py-[16px] text-[16px]  text-text-theme'>
                  {items.map((item, index) => {
                        const isFirst = index === 0
                        const isLast = index === items.length - 1

                        return (
                              <span key={item.label} className='flex items-center gap-[8px]'>
                                    {isFirst && <Home size={15} className='text-text-theme opacity-70 hover:opacity-100' />}

                                    {isLast ? (
                                          <span className='font-extrabold  text-text-theme'>{item.label}</span>
                                    ) : (
                                          item?.to && (
                                                <Link
                                                      to={item.to}
                                                      className=' text-text-theme opacity-70 hover:opacity-100 hover:font-semibold transition-colors'
                                                >
                                                      {item.label}
                                                </Link>
                                          )
                                    )}

                                    {!isLast && <ChevronRight size={13} className='text-text-theme' />}
                              </span>
                        )
                  })}
            </div>
      )
}
