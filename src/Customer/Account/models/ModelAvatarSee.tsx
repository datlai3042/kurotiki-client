import React, { useEffect } from 'react'
import { Image,  ImagePlus,  X } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'

import AvatarUsed from './AvatarUsed'
import { UserAvatarUsed } from '../../../types/user.type'
import { TResponseApi } from '../../../types/axiosResponse'

type ParamAvatarQuery = {
      avatar_used: UserAvatarUsed[]
}

type TProps<T = ParamAvatarQuery> = {
      modeDispatch: React.Dispatch<any>
      AvatarSource: {
            avatar: string
            avatar_default: string
      }
      AvatarImageUsed: UserAvatarUsed[]
      onFetchAvatarKey: string
      onFetchAvatarFn: () => Promise<AxiosResponse<TResponseApi<T>>>
}

const ModelAvatarSee = (props: TProps) => {
      const {
            modeDispatch,
            AvatarSource,
            AvatarImageUsed,
            onFetchAvatarKey,
            onFetchAvatarFn,
      } = props

      const userAvatarUsed = useQuery({
            queryKey: [onFetchAvatarKey],
            queryFn: () => onFetchAvatarFn(),
      })

      const modelControllClose = () => {
            modeDispatch({
                  type: 'CLOSE_MODE_AVATAR_SEE',
                  payload: {
                        modeAvatarSee: false,
                        boxModeAvatar: false,
                  },
            })
      }

      useEffect(() => {
            const oldOverflow = document.body.style.overflow
            document.body.style.overflow = 'hidden'

            const handleKeyDown = (event: KeyboardEvent) => {
                  if (event.key === 'Escape') {
                        modelControllClose()
                  }
            }

            window.addEventListener('keydown', handleKeyDown)

            return () => {
                  document.body.style.overflow = oldOverflow
                  window.removeEventListener('keydown', handleKeyDown)
            }
      }, [])

      const currentAvatar = AvatarSource.avatar || AvatarSource.avatar_default || ''

      const avatarUsed =
            userAvatarUsed.isSuccess
                  ? [...(userAvatarUsed.data?.data.metadata?.avatar_used || [])].reverse()
                  : []

      return (
            <div
                  className='fixed inset-0 z-[500] bottom-[50px] flex items-end justify-center bg-black/70 backdrop-blur-[2px] sm:items-center sm:px-[20px] sm:py-[24px]'
                  onClick={modelControllClose}
            >
                  <div
                        onClick={(event) => event.stopPropagation()}
                        className='
                              relative
                              flex
                              h-[92dvh]
                              w-full
                              flex-col
                              overflow-hidden
                              rounded-t-[24px]
                              border
                              border-[var(--border-color-input)]
                              bg-color-section-theme
                              text-text-theme
                              shadow-2xl

                              sm:h-auto
                              sm:max-h-[90vh]
                              sm:max-w-[860px]
                              sm:rounded-[20px]
                        '
                  >
                        <div className='flex justify-center pt-[8px] sm:hidden'>
                              <div className='h-[4px] w-[42px] rounded-full bg-slate-400/50' />
                        </div>

                        <div className='flex shrink-0 items-center justify-between border-b border-[var(--border-color-input)] px-[16px] py-[14px] sm:px-[22px] sm:py-[18px]'>
                              <div className='min-w-0'>
                                    <h2 className='text-[17px] font-semibold sm:text-[20px]'>
                                          Xem ảnh đại diện
                                    </h2>

                                    <p className='mt-[2px] text-[11px] text-slate-400 sm:text-[12px]'>
                                          Ảnh hiện tại và lịch sử ảnh đại diện
                                    </p>
                              </div>

                              <button
                                    type='button'
                                    onClick={modelControllClose}
                                    aria-label='Đóng'
                                    className='flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-500/10 hover:text-text-theme'
                              >
                                    <X size={21} />
                              </button>
                        </div>

                        <div className='min-h-0 flex-1 overflow-y-auto overscroll-contain px-[16px] py-[18px] sm:px-[22px] sm:py-[24px]'>
                              <section>
                                    <div className='mb-[12px] flex items-center justify-between sm:mb-[16px]'>
                                          <div>
                                                <p className='text-[13px] font-semibold sm:text-[14px]'>
                                                      Ảnh đại diện hiện tại
                                                </p>

                                                <p className='mt-[2px] text-[11px] text-slate-400'>
                                                      Ảnh đang được sử dụng
                                                </p>
                                          </div>

                                          <span className='rounded-full bg-blue-500/10 px-[10px] py-[5px] text-[11px] font-medium text-blue-400'>
                                                Hiện tại
                                          </span>
                                    </div>

                                    <div className='flex min-h-[260px] w-full items-center justify-center overflow-hidden rounded-[16px] border border-[var(--border-color-input)] bg-black/5 p-[12px] sm:min-h-[360px] sm:p-[20px]'>
                                          {currentAvatar ? (
                                                <img
                                                      src={currentAvatar}
                                                      alt='user_avatar'
                                                      className='max-h-[330px] w-full max-w-[520px] object-contain sm:max-h-[420px]'
                                                />
                                          ) : (
                                                <div className='flex flex-col items-center gap-[10px] py-[60px] text-slate-400'>
                                                      <ImagePlus size={38} strokeWidth={1.5} />
                                                      <span className='text-[13px]'>Chưa có ảnh đại diện</span>
                                                </div>
                                          )}
                                    </div>
                              </section>

                              {AvatarImageUsed && AvatarImageUsed.length > 0 && (
                                    <section className='mt-[28px] sm:mt-[34px]'>
                                          <div className='mb-[14px] flex items-end justify-between border-b border-[var(--border-color-input)] pb-[10px]'>
                                                <div>
                                                      <h3 className='text-[15px] font-semibold sm:text-[17px]'>
                                                            Các ảnh đại diện trước đó
                                                      </h3>

                                                      <p className='mt-[2px] text-[11px] text-slate-400'>
                                                            Lịch sử các ảnh bạn từng sử dụng
                                                      </p>
                                                </div>

                                                {userAvatarUsed.isSuccess && (
                                                      <span className='text-[11px] text-slate-400'>
                                                            {avatarUsed.length} ảnh
                                                      </span>
                                                )}
                                          </div>

                                          {userAvatarUsed.isSuccess && avatarUsed.length > 0 && (
                                                <div className='grid grid-cols-1 gap-[14px] sm:grid-cols-2 sm:gap-[16px] lg:grid-cols-3'>
                                                      {avatarUsed.map((avatar: UserAvatarUsed) => (
                                                            <div key={avatar.date_update.toString()} className='min-w-0'>
                                                                  <AvatarUsed avatar={avatar} />
                                                            </div>
                                                      ))}
                                                </div>
                                          )}

                                          {userAvatarUsed.isSuccess && avatarUsed.length === 0 && (
                                                <div className='flex min-h-[150px] flex-col items-center justify-center gap-[10px] rounded-[14px] border border-dashed border-[var(--border-color-input)] text-slate-400'>
                                                      <ImagePlus size={30} strokeWidth={1.5} />
                                                      <span className='text-[12px]'>Chưa có ảnh đại diện cũ</span>
                                                </div>
                                          )}

                                          {userAvatarUsed.isPending && (
                                                <div className='grid grid-cols-1 gap-[14px] sm:grid-cols-2 lg:grid-cols-3'>
                                                      {Array.from({ length: 3 }).map((_, index) => (
                                                            <div
                                                                  key={index}
                                                                  className='flex h-[220px] animate-pulse items-center justify-center rounded-[14px] border border-[var(--border-color-input)] bg-[var(--border-color-input)]/40'
                                                            >
                                                                  <Image size={34} className='text-slate-400' />
                                                            </div>
                                                      ))}
                                                </div>
                                          )}
                                    </section>
                              )}
                        </div>
                  </div>
            </div>
      )
}

export default ModelAvatarSee