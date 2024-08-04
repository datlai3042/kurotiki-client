import React from 'react'
import Portal from '../../../component/Portal'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import ProductApi from '../../../apis/product.api'
import { useDispatch, useSelector } from 'react-redux'
import { addOneToastError, addOneToastSuccess } from '../../../Redux/toast'
import { RootState } from '@/src/store'

type TProps = { product_id: string; setModalDeleteProduct: React.Dispatch<React.SetStateAction<boolean>> }

const DeleteProduct = (props: TProps) => {
      const queryClient = useQueryClient()
      const { product_id, setModalDeleteProduct } = props
      const dispatch = useDispatch()

      const user = useSelector((state: RootState) => state.authentication.user)

      const deleteProductWithId = useMutation({
            mutationKey: ['deleteProductWithId'],
            mutationFn: (product_id: string) => ProductApi.deleteProductWithId({ product_id }),
            onSuccess: () => {
                  dispatch(
                        addOneToastSuccess({
                              toast_item: {
                                    type: 'SUCCESS',
                                    core: { message: 'Xóa thành công' },
                                    _id: Math.random().toString(),
                                    toast_title: 'Thành công',
                              },
                        }),
                  )
                  queryClient.invalidateQueries({ queryKey: ['get-product-my-shop'] })
            },
            onError: () => {
                  dispatch(
                        addOneToastError({
                              toast_item: {
                                    type: 'ERROR',
                                    core: { message: 'Xóa không thành công' },
                                    _id: Math.random().toString(),
                                    toast_title: 'Có lỗi xảy ra',
                              },
                        }),
                  )
            },
      })

      const verifyDeleteProduct = () => {
            if (user) {
                  const { roles } = user
                  if (roles.includes('admin')) {
                        dispatch(
                              addOneToastError({
                                    toast_item: {
                                          type: 'ERROR',
                                          core: { message: 'Quyền admin hiện không khả dụng' },
                                          _id: Math.random().toString(),
                                          toast_title: 'Có lỗi xảy ra',
                                    },
                              }),
                        )
                  } else {
                        deleteProductWithId.mutate(product_id)
                  }
            }
      }

      const handleHideModal = () => {
            setModalDeleteProduct(false)
      }

      return (
            <Portal>
                  <div className='fixed bg-[rgba(0,0,0,.2)] z-[500] inset-0 flex items-center justify-center'>
                        <div className='w-[400px] h-[150px] bg-white rounded-md'>
                              <div className='h-full flex flex-col gap-[8px] px-[12px] py-[10px]'>
                                    <div className='flex flex-wrap gap-[4px] '>
                                          <p className='min-w-full'>Bạn xác nhận xóa sản phẩm id:</p>
                                          <span className='text-blue-400'>{'{'}</span>
                                          <span className='text-blue-500 font-bold text-[16px]'>{product_id}</span>
                                          <span className='text-blue-400'>{'}'}</span>
                                    </div>
                                    <div className='flex flex-1  gap-[16px] items-center justify-end'>
                                          <button
                                                className='w-[100px] h-[36px] px-[6px] py-[4px] border-[1px] border-blue-500 flex items-center justify-center text-blue-500 bg-white rounded-lg'
                                                onClick={handleHideModal}
                                          >
                                                Hủy
                                          </button>
                                          <button
                                                className='w-[100px] h-[36px] px-[6px] py-[4px] border-[1px] border-red-500 flex items-center justify-center text-white bg-red-500 rounded-lg'
                                                onClick={verifyDeleteProduct}
                                          >
                                                Xác nhận
                                          </button>
                                    </div>
                              </div>
                        </div>
                  </div>
            </Portal>
      )
}

export default DeleteProduct
