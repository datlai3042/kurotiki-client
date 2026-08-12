import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useContext, useState } from 'react'
import NotificationService, { NotificationType } from '../../apis/notification.service'
import { limitNotification } from '../../constant/notification.constant'
import { convertDateToStringFull } from '../../utils/date.utils'
import { Check, Clock8, Inbox, Package, Store, Trash2, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import BoxLoading from '../../component/BoxUi/BoxLoading'
import BoxConfirmDelete from '../../component/BoxUi/confirm/BoxConfirmDelete'
import { ThemeContext } from '../../component/Context/ThemeContext'
import BoxWrapperCalcHeight from '../../component/BoxUi/BoxWrapperCalcHeight'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { UserResponse } from '../../types/user.type'

type NotificationClientType = Exclude<NotificationType, 'ADMIN'>

type TProps = {
      type: NotificationClientType
}
const notificationMeta: Record<
      Exclude<NotificationType, 'ADMIN'>,
      {
            title: string
            description: string
            emptyTitle: string
            emptyDescription: string
      }
> = {
      COMMON: {
            title: 'Tất cả thông báo',
            description: 'Tổng hợp những cập nhật mới nhất dành cho bạn',
            emptyTitle: 'Chưa có thông báo',
            emptyDescription: 'Khi có cập nhật mới, thông báo sẽ xuất hiện tại đây.',
      },
      USER: {
            title: 'Thông báo cá nhân',
            description: 'Các cập nhật liên quan trực tiếp đến tài khoản của bạn',
            emptyTitle: 'Chưa có thông báo cá nhân',
            emptyDescription: 'Khi có cập nhật mới liên quan đến tài khoản, thông báo sẽ xuất hiện tại đây.',
      },
      PRODUCT: {
            title: 'Thông báo sản phẩm',
            description: 'Theo dõi trạng thái và cập nhật liên quan đến sản phẩm, đơn hàng',
            emptyTitle: 'Chưa có thông báo sản phẩm',
            emptyDescription: 'Các cập nhật về sản phẩm và đơn hàng sẽ xuất hiện tại đây.',
      },
      SYSTEM: {
            title: 'Thông báo hệ thống',
            description: 'Thông tin vận hành, bảo trì và những thay đổi quan trọng',
            emptyTitle: 'Chưa có thông báo hệ thống',
            emptyDescription: 'Các thông báo quan trọng từ hệ thống sẽ xuất hiện tại đây.',
      },
      SHOP: {
            title: 'Thông báo cửa hàng',
            description: 'Cập nhật hoạt động bán hàng và tương tác trong cửa hàng của bạn',
            emptyTitle: 'Chưa có thông báo cửa hàng',
            emptyDescription: 'Hoạt động mới liên quan đến cửa hàng sẽ xuất hiện tại đây.',
      },
}

const NotificationSection = ({ type }: TProps) => {
      const queryClient = useQueryClient()
      const { theme } = useContext(ThemeContext)

      const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

      const getMyNotification = useInfiniteQuery({
            queryKey: ['/v1/api/notification/get-my-notification', type],
            queryFn: ({ pageParam = 1 }) =>
                  NotificationService.getMyNotification({
                        page: pageParam,
                        type,
                        limit: limitNotification,
                  }),
            initialPageParam: 1,
            getNextPageParam: (lastPage, allPages) =>
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
                  setConfirmDeleteId(null)
                  queryClient.invalidateQueries({
                        queryKey: ['/v1/api/notification/get-my-notification', type],
                  })
            },
      })

      const onReadNotification = ({ notification_id, read }: { notification_id: string; read: boolean }) => {
            if (read) return
            readNotificationMutation.mutate({ notification_id })
      }

      const pages = getMyNotification.data?.pages || []
      const totalNotification = pages.reduce(
            (total, page) => total + page.data.metadata.notifications.notification.notifications_message.length,
            0,
      )

      const hasNotification = pages.some((page) => page.data.metadata.notifications.notification.notifications_message.length > 0)

      const meta = notificationMeta[type]

      const renderIcon = (notificationType: string) => {
            if (notificationType === 'USER') return <User size={18} strokeWidth={1.9} />
            if (notificationType === 'SYSTEM') return <Clock8 size={18} strokeWidth={1.9} />
            if (notificationType === 'SHOP') return <Store size={18} strokeWidth={1.9} />
            if (notificationType === 'PRODUCT') return <Package size={18} strokeWidth={1.9} />

            return <Inbox size={18} strokeWidth={1.9} />
      }
      return (
            <div className='relative mb-[80px] h-full min-h-[50px] w-full text-text-theme xl:mb-0'>
                  <div className='overflow-hidden rounded-2xl flex flex-col h-full border border-[var(--border-color-input)] bg-color-section-theme shadow-[0_8px_30px_rgba(15,23,42,0.05)]'>
                        {/* HEADER */}
                        <div className='flex items-start justify-between gap-3 border-b border-[var(--border-color-input)] px-4 py-4 sm:items-center sm:px-5'>
                              <div className='min-w-0'>
                                    <h3 className='text-[15px] font-semibold text-text-theme sm:text-base'>{meta.title}</h3>

                                    <p className='mt-1 max-w-[520px] text-[11px] leading-5 text-slate-500 sm:text-xs'>{meta.description}</p>
                              </div>

                              <div className='flex shrink-0 items-center gap-1.5 rounded-full border border-blue-500/15 bg-blue-500/10 px-2.5 py-1.5 text-[11px] font-medium text-blue-500 sm:px-3 sm:text-xs'>
                                    <Inbox size={14} />
                                    <span>{totalNotification}</span>
                                    <span className='hidden sm:inline'>thông báo</span>
                              </div>
                        </div>

                        {/* LIST */}
                        <BoxWrapperCalcHeight subtractSelectors={['#customer_notification_btn_load_data']} className='overflow-auto'>
                              <div className='flex-1 overflow-auto divide-y divide-[var(--border-color-input)]'>
                                    {pages.map((page) =>
                                          page.data.metadata.notifications.notification.notifications_message.map((notification) => {
                                                const isRead = notification.notification_isRead
                                                const attribute = notification.notification_attribute
                                                const notificationType = attribute.notification_type

                                                return (
                                                      <article
                                                            key={notification._id}
                                                            className={`group relative px-3 py-4 transition-colors sm:px-5 sm:py-5 ${
                                                                  theme === 'dark' ? 'hover:bg-[#101722]' : 'hover:bg-blue-50/60'
                                                            } ${!isRead ? 'bg-blue-500/[0.035]' : ''}`}
                                                      >
                                                            {!isRead && (
                                                                  <span className='absolute bottom-0 left-0 top-0 w-[3px] rounded-r-full bg-blue-500' />
                                                            )}

                                                            <div className='flex items-start gap-3 sm:gap-4'>
                                                                  {/* ICON */}
                                                                  <div
                                                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${
                                                                              isRead
                                                                                    ? 'bg-slate-500/10 text-slate-400'
                                                                                    : 'bg-blue-500/10 text-blue-500'
                                                                        }`}
                                                                  >
                                                                        {renderIcon(notificationType)}
                                                                  </div>

                                                                  <div className='min-w-0 flex-1'>
                                                                        {/* META */}
                                                                        <div className='flex items-start justify-between gap-3'>
                                                                              <div className='flex min-w-0 items-center gap-2'>
                                                                                    {!isRead && (
                                                                                          <span className='h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500' />
                                                                                    )}

                                                                                    <span
                                                                                          className={`text-[11px] font-semibold ${
                                                                                                isRead ? 'text-slate-400' : 'text-blue-500'
                                                                                          }`}
                                                                                    >
                                                                                          {isRead ? 'Đã đọc' : 'Mới'}
                                                                                    </span>

                                                                                    {notificationType === 'PRODUCT' && (
                                                                                          <span className='rounded-full bg-orange-500/10 px-2 py-0.5 text-[10px] font-medium text-orange-500'>
                                                                                                Đang xử lý
                                                                                          </span>
                                                                                    )}
                                                                              </div>

                                                                              <time className='shrink-0 text-right text-[10px] leading-4 text-slate-400 sm:text-[11px]'>
                                                                                    {convertDateToStringFull(
                                                                                          notification.notification_creation_time,
                                                                                    )}
                                                                              </time>
                                                                        </div>

                                                                        {/* SIMPLE CONTENT */}
                                                                        {(notificationType === 'USER' || notificationType === 'SYSTEM') && (
                                                                              <p className='mt-2 text-[13px] font-medium leading-5 text-text-theme sm:text-sm sm:leading-6'>
                                                                                    {attribute.notification_content}
                                                                              </p>
                                                                        )}

                                                                        {/* SHOP */}
                                                                        {notificationType === 'SHOP' && (
                                                                              <div className='mt-3 flex gap-3'>
                                                                                    {attribute.product_image && (
                                                                                          <div className='flex h-[64px] w-[64px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[var(--border-color-input)] bg-white p-1 sm:h-[72px] sm:w-[72px]'>
                                                                                                <img
                                                                                                      className='h-full w-full rounded-lg object-contain'
                                                                                                      src={attribute.product_image}
                                                                                                      alt='product'
                                                                                                />
                                                                                          </div>
                                                                                    )}

                                                                                    <div className='min-w-0 flex-1'>
                                                                                          <p className='line-clamp-2 text-[13px] font-semibold leading-5 text-blue-500 sm:text-sm'>
                                                                                                {attribute.notification_content}
                                                                                          </p>

                                                                                          <p className='mt-1 line-clamp-1 text-[12px] font-medium text-text-theme sm:text-[13px]'>
                                                                                                {attribute.product_name}
                                                                                          </p>

                                                                                          <div className='mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-500 sm:text-xs'>
                                                                                                <span>
                                                                                                      Người mua:{' '}
                                                                                                      <b className='font-medium text-text-theme'>
                                                                                                            {attribute.buyer_info
                                                                                                                  ?.nickName ||
                                                                                                                  attribute.buyer_info
                                                                                                                        ?.fullName ||
                                                                                                                  attribute.buyer_info
                                                                                                                        ?.email}
                                                                                                      </b>
                                                                                                </span>

                                                                                                <span>
                                                                                                      SL:{' '}
                                                                                                      <b className='font-medium text-text-theme'>
                                                                                                            {attribute.product_quantity}
                                                                                                      </b>
                                                                                                </span>
                                                                                          </div>
                                                                                    </div>
                                                                              </div>
                                                                        )}

                                                                        {/* PRODUCT */}
                                                                        {notificationType === 'PRODUCT' && (
                                                                              <Link
                                                                                    to={`/order-check/${attribute.order_id}`}
                                                                                    className='mt-3 flex gap-3 rounded-xl border border-[var(--border-color-input)] bg-slate-500/[0.035] p-2.5 transition hover:border-blue-500/30 hover:bg-blue-500/[0.04] sm:p-3'
                                                                              >
                                                                                    <div className='flex h-[64px] w-[64px] shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[var(--border-color-input)] bg-white p-1 sm:h-[72px] sm:w-[72px]'>
                                                                                          {attribute.product_id?.product_thumb_image ? (
                                                                                                <img
                                                                                                      src={
                                                                                                            attribute.product_id
                                                                                                                  ?.product_thumb_image
                                                                                                                  .secure_url
                                                                                                      }
                                                                                                      alt={
                                                                                                            attribute.product_name ||
                                                                                                            'product'
                                                                                                      }
                                                                                                      className='h-full w-full rounded-md object-contain'
                                                                                                />
                                                                                          ) : (
                                                                                                <div className='flex h-full w-full items-center justify-center text-[10px] text-slate-400'>
                                                                                                      No image
                                                                                                </div>
                                                                                          )}
                                                                                    </div>

                                                                                    <div className='min-w-0 flex-1'>
                                                                                          <p className='line-clamp-2 text-[13px] font-semibold leading-5 text-blue-500 sm:text-sm'>
                                                                                                {attribute.notification_content}
                                                                                          </p>

                                                                                          <p className='mt-1 line-clamp-1 text-[12px] font-medium text-text-theme sm:text-[13px]'>
                                                                                                {attribute.product_name}
                                                                                          </p>

                                                                                          <p className='mt-1.5 text-[10px] text-slate-500 sm:text-xs'>
                                                                                                Số lượng:{' '}
                                                                                                <b className='font-medium text-text-theme'>
                                                                                                      {attribute.product_quantity}
                                                                                                </b>
                                                                                          </p>
                                                                                    </div>
                                                                              </Link>
                                                                        )}

                                                                        {/* ACTIONS */}
                                                                        <div className='mt-3 flex items-center justify-end gap-2'>
                                                                              {!isRead && (
                                                                                    <button
                                                                                          type='button'
                                                                                          onClick={() =>
                                                                                                onReadNotification({
                                                                                                      notification_id: notification._id,
                                                                                                      read: isRead,
                                                                                                })
                                                                                          }
                                                                                          className='flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-medium text-blue-500 transition hover:bg-blue-500/10'
                                                                                    >
                                                                                          <Check size={14} />
                                                                                          <span className='hidden sm:inline'>
                                                                                                Đánh dấu đã đọc
                                                                                          </span>
                                                                                          <span className='sm:hidden'>Đã đọc</span>
                                                                                    </button>
                                                                              )}

                                                                              <button
                                                                                    type='button'
                                                                                    onClick={() => setConfirmDeleteId(notification._id)}
                                                                                    className='flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-500'
                                                                              >
                                                                                    <Trash2 size={14} />
                                                                                    <span>Xóa</span>
                                                                              </button>
                                                                        </div>

                                                                        {confirmDeleteId === notification._id && (
                                                                              <BoxConfirmDelete
                                                                                    content='Bạn có chắc muốn xóa thông báo này không?'
                                                                                    ButtonCancellContent='Hủy'
                                                                                    ButtonConfrimContent='Xóa'
                                                                                    onClose={() => setConfirmDeleteId(null)}
                                                                                    paramsActive={{
                                                                                          notification_id: notification._id,
                                                                                    }}
                                                                                    onActive={deleteNotificationMutation.mutate}
                                                                              />
                                                                        )}
                                                                  </div>
                                                            </div>
                                                      </article>
                                                )
                                          }),
                                    )}
                              </div>
                        </BoxWrapperCalcHeight>

                        {/* EMPTY */}
                        {!getMyNotification.isPending && !hasNotification && (
                              <div className='flex min-h-[300px] flex-col items-center justify-center px-6 py-10 text-center'>
                                    <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500'>
                                          <Inbox size={26} strokeWidth={1.7} />
                                    </div>

                                    <h4 className='mt-4 text-sm font-semibold text-text-theme'>{meta.emptyTitle}</h4>

                                    <p className='mt-1 max-w-[320px] text-[12px] leading-5 text-slate-500 sm:text-sm sm:leading-6'>
                                          {meta.emptyDescription}
                                    </p>
                              </div>
                        )}

                        {/* LOAD MORE */}
                        {(hasNotification || getMyNotification.isPending) && (
                              <div
                                    id='customer_notification_btn_load_data'
                                    className='flex justify-center border-t border-[var(--border-color-input)] px-4 py-4 sm:px-5'
                              >
                                    <button
                                          className={`flex h-10 min-w-[170px] items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium transition ${
                                                getMyNotification.hasNextPage
                                                      ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
                                                      : 'cursor-default bg-slate-500/10 text-slate-400'
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
                        )}
                  </div>
            </div>
      )
}

export default NotificationSection
