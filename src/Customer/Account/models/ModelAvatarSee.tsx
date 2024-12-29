import React from 'react'
import { Image, X } from 'lucide-react'
import { TAvatarActions } from '../../../reducer/customer.reducer'
import { useQuery } from '@tanstack/react-query'
import AvatarUsed from './AvatarUsed'
import { UserAvatarUsed } from '../../../types/user.type'
import { AxiosResponse } from 'axios'
import { TResponseApi } from '../../../types/axiosResponse'

type ParamAvatarQuery = { avatar_used: UserAvatarUsed[] }

type TProps<T = ParamAvatarQuery> = {
      modeDispatch: React.Dispatch<TAvatarActions>
      AvatarSource: { avatar: string; avatar_default: string }
      AvatarImageUsed: UserAvatarUsed[]

      onFetchAvatarKey: string
      onFetchAvatarFn: () => Promise<AxiosResponse<TResponseApi<T>>>
}

const ModelAvatarSee = <T extends ParamAvatarQuery>(props: TProps<T>) => {
      const { modeDispatch, AvatarSource, AvatarImageUsed, onFetchAvatarKey, onFetchAvatarFn } = props
      // const user = useSelector((state: RootState) => state.authentication.user)
      const userAvatarUsed = useQuery({
            queryKey: [onFetchAvatarKey],
            queryFn: () => onFetchAvatarFn(),
      })

      const modelControllClose = () => {
            modeDispatch({ type: 'CLOSE_MODE_AVATAR_SEE', payload: { modeAvatarSee: false, boxModeAvatar: false } })
      }

      return (
            <div
                  className='fixed top-0 left-0 bg-[rgba(0,0,0,.7)] w-full min-h-screen z-[500] px-[25px] flex items-center justify-center'
                  onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                        modeDispatch({ type: 'CLOSE_MODE_AVATAR_SEE', payload: { modeAvatarSee: false, boxModeAvatar: false } })
                  }
            >
                  <div
                        onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => e.stopPropagation()}
                        className='scroll-pt-[50px] max-w-[85vw] w-[650px]  min-h-[200px] h-[auto] max-h-[600px] bg-white  p-[28px] relative shadow-2xl overflow-y-scroll rounded-md'
                  >
                        <div className='absolute text-[25px] max-w-max top-[25px] right-[25px]' onClick={modelControllClose}>
                              <X />
                        </div>
                        <div className='h-[10%] flex items-center mb-[15px] font-openSans text-[20px] font-medium'>Xem ảnh đại diện</div>
                        <div className='h-[1px] bg-stone-100'></div>
                        <div className='flex flex-col h-[500px] overflow-y-auto'>
                              <div className='w-full h-[250px] rounded-full mt-[30px] flex justify-center'>
                                    <img
                                          src={AvatarSource.avatar || AvatarSource.avatar_default || ''}
                                          alt='user_avatar'
                                          className='object-contain w-[250px] h-full '
                                    />
                              </div>
                              {AvatarImageUsed && AvatarImageUsed.length > 0 && (
                                    <div className='mt-[70px] w-full min-h-[360px] h-auto flex flex-col gap-[20px] '>
                                          <span>Các hình đại diện trước đó</span>
                                          {userAvatarUsed.isSuccess && (
                                                <div className='flex gap-[45px] mb-[70px] min-h-[360px] h-auto flex-wrap '>
                                                      {userAvatarUsed?.data?.data.metadata?.avatar_used
                                                            ?.reverse()
                                                            .map((avatar: UserAvatarUsed) => (
                                                                  <AvatarUsed avatar={avatar} key={avatar.date_update.toString()} />
                                                            ))}
                                                </div>
                                          )}

                                          {userAvatarUsed.isPending && (
                                                <div className='w-full h-full flex gap-[15px]'>
                                                      <div className='animate-pulse bg-gray-200 rounded-lg basis-[50%] h-[360px] flex justify-center items-center '>
                                                            <Image size={40} />
                                                      </div>
                                                      <div className='animate-pulse bg-gray-200 rounded-lg basis-[50%] h-[360px] flex justify-center items-center '>
                                                            <Image size={40} />
                                                      </div>
                                                </div>
                                          )}
                                    </div>
                              )}
                        </div>
                  </div>
            </div>
      )
}

export default ModelAvatarSee
