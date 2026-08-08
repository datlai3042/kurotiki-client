import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import NotificationService, { NotificationType } from '../../apis/notification.service'
import { limitNotification } from '../../constant/notification.constant'
import { convertDateToStringFull } from '../../utils/date.utils'
import { Check, Circle, Clock8, Inbox } from 'lucide-react'
import { Link } from 'react-router-dom'
import BoxLoading from '../../component/BoxUi/BoxLoading'
import BoxConfirmDelete from '../../component/BoxUi/confirm/BoxConfirmDelete'

type TProps = {
      type: NotificationType
}

const NotificationSection = (props: TProps) => {
      const { type } = props
      const queryClient = useQueryClient()
      const [showConfirm, setShowConfirm] = useState<boolean>(false)

      const getMyNotification = useInfiniteQuery({
            queryKey: ['/v1/api/notification/get-my-notification', type],
            queryFn: ({ pageParam = 1 }) => NotificationService.getMyNotification({ page: pageParam, type, limit: limitNotification }),
            initialPageParam: 1,
            getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) =>
                  lastPage.data.metadata.notifications.notification.notifications_message.length > 0 ? allPages.length + 1 : undefined,
      })

      const readNotificationMutation = useMutation({
            mutationKey: ['read-notification'],
            mutationFn: ({ notification_id }: { notification_id: string }) => NotificationService.readNotification({ notification_id }),
            onSuccess: () => {
                  queryClient.invalidateQueries({
                        queryKey: ['/v1/api/notification/get-my-notification', type],
                  })
            },
      })

      const deleteNotificationMutation = useMutation({
            mutationKey: ['delete-notification'],
            mutationFn: ({ notification_id }: { notification_id: string }) => NotificationService.deleteNotification({ notification_id }),
            onSuccess: () => {
                  queryClient.invalidateQueries({
                        queryKey: ['/v1/api/notification/get-my-notification', type],
                  })
            },
      })

      const onReadNotification = ({ notification_id, read }: { notification_id: string; read: boolean }) => {
            if (read) {
                  return
            }
            readNotificationMutation.mutate({ notification_id })
      }

      const styleEffect = {
            isRead: (read: boolean) => (read ? 'bg-color-section-theme' : 'bg-blue-100'),
      }

      return (
            <div className='relative mb-[80px] h-max min-h-[50px] w-full text-text-theme xl:mb-0'>
                  <div className='overflow-hidden rounded-2xl border border-slate-200/70 bg-color-section-theme shadow-[0_8px_30px_rgba(15,23,42,0.05)]'>
                        <div className='flex items-center justify-between border-b border-slate-200/60 px-5 py-4'>
                              <div>
                                    <h3 className='text-base font-semibold text-text-theme'>Thông báo cá nhân</h3>
                                    <p className='mt-1 text-xs text-slate-500'>
                                          Các cập nhật liên quan trực tiếp đến tài khoản của bạn
                                    </p>
                              </div>

                              <div className='flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600'>
                                    <Inbox size={15} />
                                    <span>
                                          {getMyNotification.data?.pages.reduce(
                                                (total, page) =>
                                                      total +
                                                      page.data.metadata.notifications.notification.notifications_message.length,
                                                0,
                                          ) || 0}{' '}
                                          thông báo
                                    </span>
                              </div>
                        </div>

                        <div className='divide-y divide-slate-200/60'>
                              {getMyNotification.data?.pages.map((page) =>
                                    page.data.metadata.notifications.notification.notifications_message.map((notification) => {
                                          const isRead = notification.notification_isRead

                                          return (
                                                <div
                                                      key={notification._id}
                                                      className={`group relative flex w-full gap-4 px-5 py-4 transition-colors ${
                                                            isRead
                                                                  ? 'bg-color-section-theme hover:bg-slate-50/50'
                                                                  : 'bg-blue-50/50 hover:bg-blue-50/80'
                                                      }`}
                                                >
                                                      {!isRead && (
                                                            <span className='absolute left-0 top-0 h-full w-[3px] rounded-r-full bg-blue-500' />
                                                      )}

                                                      {notification.notification_attribute.notification_type === 'PRODUCT' ? (
                                                            <div className='flex h-[74px] w-[74px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-1 shadow-sm'>
                                                                  {notification.notification_attribute.product_image ? (
                                                                        <img
                                                                              src={notification.notification_attribute.product_image}
                                                                              alt={notification.notification_attribute.product_name || 'product'}
                                                                              className='h-full w-full rounded-lg object-contain'
                                                                        />
                                                                  ) : (
                                                                        <div className='flex h-full w-full items-center justify-center rounded-lg bg-white text-slate-300'>
                                                                              <Inbox size={24} strokeWidth={1.6} />
                                                                        </div>
                                                                  )}
                                                            </div>
                                                      ) : (
                                                            <div
                                                                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                                                                        isRead
                                                                              ? 'bg-slate-100 text-slate-500'
                                                                              : 'bg-blue-100 text-blue-600'
                                                                  }`}
                                                            >
                                                                  {notification.notification_attribute.notification_type === 'USER' ? (
                                                                        <User size={20} strokeWidth={1.8} />
                                                                  ) : notification.notification_attribute.notification_type === 'SYSTEM' ? (
                                                                        <Clock8 size={20} strokeWidth={1.8} />
                                                                  ) : notification.notification_attribute.notification_type === 'SHOP' ? (
                                                                        <Store size={20} strokeWidth={1.8} />
                                                                  ) : (
                                                                        <Inbox size={20} strokeWidth={1.8} />
                                                                  )}
                                                            </div>
                                                      )}

                                                      <div className='min-w-0 flex-1'>
                                                            <div className='flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between'>
                                                                  <div className='min-w-0 flex-1'>
                                                                        <div className='flex flex-wrap items-center gap-2'>
                                                                              <span
                                                                                    className={`text-[11px] font-medium ${
                                                                                          isRead
                                                                                                ? 'text-slate-400'
                                                                                                : 'text-blue-600'
                                                                                    }`}
                                                                              >
                                                                                    {isRead ? 'Đã đọc' : 'Mới'}
                                                                              </span>

                                                                              {!isRead && (
                                                                                    <Circle
                                                                                          size={7}
                                                                                          fill='currentColor'
                                                                                          className='text-blue-500'
                                                                                    />
                                                                              )}
                                                                        </div>

                                                                        {notification.notification_attribute.notification_type === 'SYSTEM' && (
                                                                              <p className='mt-1.5 text-sm font-medium leading-6 text-text-theme'>
                                                                                    {
                                                                                          notification.notification_attribute
                                                                                                .notification_content
                                                                                    }
                                                                              </p>
                                                                        )}

                                                                        {notification.notification_attribute.notification_type === 'USER' && (
                                                                              <p className='mt-1.5 text-sm font-medium leading-6 text-text-theme'>
                                                                                    {
                                                                                          notification.notification_attribute
                                                                                                .notification_content
                                                                                    }
                                                                              </p>
                                                                        )}

                                                                        {notification.notification_attribute.notification_type === 'SHOP' && (
                                                                              <div className='mt-1.5 flex gap-3'>
                                                                                    {notification.notification_attribute.product_image && (
                                                                                          <img
                                                                                                className='h-16 w-16 shrink-0 rounded-xl border border-slate-200 object-contain'
                                                                                                src={
                                                                                                      notification.notification_attribute
                                                                                                            .product_image
                                                                                                }
                                                                                                alt='product'
                                                                                          />
                                                                                    )}

                                                                                    <div className='min-w-0'>
                                                                                          <p className='text-sm font-medium leading-6 text-text-theme'>
                                                                                                {
                                                                                                      notification.notification_attribute
                                                                                                            .notification_content
                                                                                                }
                                                                                          </p>
                                                                                          <p className='mt-1 truncate text-sm text-blue-600'>
                                                                                                {
                                                                                                      notification.notification_attribute
                                                                                                            .product_name
                                                                                                }
                                                                                          </p>
                                                                                          <div className='mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500'>
                                                                                                <span>
                                                                                                      Người mua:{' '}
                                                                                                      <b className='font-medium text-text-theme'>
                                                                                                            {notification
                                                                                                                  .notification_attribute
                                                                                                                  .buyer_info?.nickName ||
                                                                                                                  notification
                                                                                                                        .notification_attribute
                                                                                                                        .buyer_info?.fullName ||
                                                                                                                  notification
                                                                                                                        .notification_attribute
                                                                                                                        .buyer_info?.email}
                                                                                                      </b>
                                                                                                </span>
                                                                                                <span>
                                                                                                      Số lượng:{' '}
                                                                                                      <b className='font-medium text-text-theme'>
                                                                                                            {
                                                                                                                  notification
                                                                                                                        .notification_attribute
                                                                                                                        .product_quantity
                                                                                                            }
                                                                                                      </b>
                                                                                                </span>
                                                                                          </div>
                                                                                    </div>
                                                                              </div>
                                                                        )}

                                                                        {notification.notification_attribute.notification_type ===
                                                                              'PRODUCT' && (
                                                                              <div className='mt-0.5'>
                                                                                    <div className='mb-1.5 flex flex-wrap items-center gap-2'>
                                                                                          <span className='rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-medium text-orange-600'>
                                                                                                Đang xử lý
                                                                                          </span>
                                                                                    </div>

                                                                                    <p className='text-sm font-semibold leading-6 text-text-theme'>
                                                                                          {
                                                                                                notification.notification_attribute
                                                                                                      .notification_content
                                                                                          }
                                                                                    </p>

                                                                                    <p className='mt-1 line-clamp-1 text-sm text-slate-500'>
                                                                                          {
                                                                                                notification.notification_attribute
                                                                                                      .product_name
                                                                                          }
                                                                                    </p>

                                                                                    <div className='mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-500'>
                                                                                          <span>
                                                                                                Số lượng:{' '}
                                                                                                <b className='font-medium text-text-theme'>
                                                                                                      {
                                                                                                            notification
                                                                                                                  .notification_attribute
                                                                                                                  .product_quantity
                                                                                                      }
                                                                                                </b>
                                                                                          </span>
                                                                                    </div>
                                                                              </div>
                                                                        )}
                                                                  </div>
                                                            </div>

                                                            <div className='mt-3 flex flex-wrap items-center gap-x-4 gap-y-2'>
                                                                  {notification.notification_attribute.notification_type === 'PRODUCT' && (
                                                                        <Link
                                                                              to={`/order-check/${notification.notification_attribute.order_id}`}
                                                                              className='text-xs font-medium text-slate-500 transition hover:text-blue-600'
                                                                        >
                                                                              Xem chi tiết
                                                                        </Link>
                                                                  )}

                                                                  {!notification.notification_isRead && (
                                                                        <button
                                                                              className='flex items-center gap-1.5 text-xs font-medium text-blue-500 transition hover:text-blue-600'
                                                                              onClick={() =>
                                                                                    onReadNotification({
                                                                                          notification_id: notification._id,
                                                                                          read: notification.notification_isRead,
                                                                                    })
                                                                              }
                                                                        >
                                                                              <Check size={15} />
                                                                              Đánh dấu là đã đọc
                                                                        </button>
                                                                  )}

                                                                  <button
                                                                        className='text-xs font-medium text-red-400 transition hover:text-red-500'
                                                                        onClick={() => setShowConfirm(true)}
                                                                  >
                                                                        Xóa
                                                                        {showConfirm && (
                                                                              <BoxConfirmDelete
                                                                                    content='Bạn có chắc có thông báo này không'
                                                                                    ButtonCancellContent='Hủy'
                                                                                    ButtonConfrimContent='Xóa'
                                                                                    onClose={setShowConfirm}
                                                                                    paramsActive={{
                                                                                          notification_id: notification._id,
                                                                                    }}
                                                                                    onActive={deleteNotificationMutation.mutate}
                                                                              />
                                                                        )}
                                                                  </button>
                                                            </div>
                                                      </div>
                                                </div>
                                          )
                                    }),
                              )}
                        </div>

                        {!getMyNotification.isPending &&
                              !getMyNotification.data?.pages.some(
                                    (page) =>
                                          page.data.metadata.notifications.notification.notifications_message.length > 0,
                              ) && (
                                    <div className='flex min-h-[320px] flex-col items-center justify-center px-6 text-center'>
                                          <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-500'>
                                                <Inbox size={28} strokeWidth={1.7} />
                                          </div>
                                          <h4 className='mt-4 text-sm font-semibold text-text-theme'>
                                                Chưa có thông báo cá nhân
                                          </h4>
                                          <p className='mt-1 max-w-[320px] text-sm leading-6 text-slate-500'>
                                                Khi có cập nhật mới liên quan đến tài khoản, thông báo sẽ xuất hiện tại đây.
                                          </p>
                                    </div>
                              )}

                        <div className='flex justify-center border-t border-slate-200/60 px-5 py-4'>
                              <button
                                    className={`flex h-10 min-w-[170px] items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium transition ${
                                          getMyNotification.hasNextPage
                                                ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
                                                : 'cursor-default bg-slate-100 text-slate-400'
                                    }`}
                                    onClick={() => getMyNotification.fetchNextPage()}
                                    disabled={!getMyNotification.hasNextPage || getMyNotification.isFetchingNextPage}
                              >
                                    {!getMyNotification.hasNextPage
                                          ? 'Không còn thông báo'
                                          : getMyNotification.isFetchingNextPage
                                            ? 'Đang tải...'
                                            : 'Tải thêm thông báo'}

                                    {(getMyNotification.isPending || getMyNotification.isFetchingNextPage) && <BoxLoading />}
                              </button>
                        </div>
                  </div>
            </div>
      )
}

export default NotificationSection
