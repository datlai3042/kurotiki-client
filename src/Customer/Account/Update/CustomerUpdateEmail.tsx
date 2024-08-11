import { Mail } from 'lucide-react'
import { RootState } from '../../../store'
import { useDispatch, useSelector } from 'react-redux'
import { UserResponse } from '../../../types/user.type'
import { useEffect, useRef, useState } from 'react'
import { validateEmail } from '../../../utils/account.utils'
import CustomerPasswordSecurity from '../form/CustomerPasswordSecurity'
import { check } from 'prettier'
import { useMutation } from '@tanstack/react-query'
import AccountService from '../../../apis/account.service'
import { fetchUser } from '../../../Redux/authenticationSlice'
import BoxLoading from '../../../component/BoxUi/BoxLoading'
import { addOneToastError, addOneToastSuccess, addOneToastWarning } from '../../../Redux/toast'

// () => api
const CustomerUpdateEmail = () => {
      const user = useSelector((state: RootState) => state.authentication.user) as UserResponse

      const [email, setEmail] = useState<string>(user?.email || '')
      const [password, setPassword] = useState<string>('')

      const [openSecurity, setOpenSecurity] = useState<boolean>(false)
      const [checkSecurity, setCheckSecurity] = useState<boolean>(false)
      const buttonSubmit = useRef<HTMLButtonElement>(null)

      const dispatch = useDispatch()

      const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value)
      }

      const onSubmit = (e: React.FormEvent) => {
            e.preventDefault()
            const checkEmail = validateEmail(email)
            if (!checkEmail) {
                  dispatch(
                        addOneToastWarning({
                              toast_item: {
                                    _id: Math.random().toString(),
                                    type: 'WARNING',
                                    core: {
                                          message: 'Email không hợp lệ'
                                    },
                                    toast_title: 'Thiếu thông tin ',
                              },
                        }),
                  )
                  return
            }
            if (!email) {
                  dispatch(
                        addOneToastWarning({
                              toast_item: {
                                    _id: Math.random().toString(),
                                    type: 'WARNING',
                                    core: {
                                          message: 'Bạn không thể gửi email rỗng'
                                    },
                                    toast_title: 'Thiếu thông tin ',
                              },
                        }),
                  )
                  return
            }

            if (email === user?.email) {
                  dispatch(
                        addOneToastWarning({
                              toast_item: {
                                    _id: Math.random().toString(),
                                    type: 'WARNING',
                                    core: {
                                          message: 'Email không có sự thay đổi',
                                    },
                                    toast_title: 'Thiếu thông tin ',
                              },
                        }),
                  )
                  return
            }

            if (!checkSecurity) {
                  setOpenSecurity(true)
                  return
            }

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
                        updateEmailMutation.mutate({ password, newEmail: email })
                  }

            }
            // const checkEmail = validateEmail(email)
            //console.log(([^)]+))
      }

      useEffect(() => {
            if (openSecurity) {
                  document.body.style.overflow = 'hidden'
            } else {
                  document.body.style.overflow = 'unset'
            }
      }, [openSecurity])

      useEffect(() => {
            if (checkSecurity) {
                  buttonSubmit.current?.click()
            }
      }, [checkSecurity])

      const updateEmailMutation = useMutation({
            mutationKey: ['/v1/api/account/update-email'],
            mutationFn: ({ password, newEmail }: { password: string; newEmail: string }) =>
                  AccountService.updateEmail({ password, newEmail }),
            onSuccess: (axiosResponse) => {
                  const { user } = axiosResponse.data.metadata
                  dispatch(fetchUser({ user }))
                  dispatch(
                        addOneToastSuccess({
                              toast_item: {
                                    type: 'SUCCESS',
                                    core: { message: 'Cập nhập Email thành công' },
                                    _id: Math.random().toString(),
                                    toast_title: 'Thành công',
                              },
                        }),
                  )
            },
      })

      return (
            <div className='flex items-center justify-center w-full min-h-[200px] h-max  bg-[#ffffff] py-[60px] rounded'>
                  <form
                        className='flex flex-col gap-[16px]  min-w-[150px] xl:min-w-[400px] xl:min-h-[150px] h-max max-w-auto  p-[24px] rounded-sm  shadow-2xl border-[1px] border-slate-100 bg-[#ffffff]'
                        style={{ width: Number(user.email.length) * 10 }}
                        onSubmit={onSubmit}
                  >
                        <label htmlFor='account_email_update' className='[word-spacing:1px] text-[16px] text-black font-medium '>
                              Địa chỉ Email
                        </label>

                        <div
                              className='w-full h-[50px] max-w-auto group flex gap-[10px] px-[8px] py-[2px] items-center border-[1px] border-blue-700 rounded'
                              tabIndex={0}
                        >
                              <Mail />
                              <input
                                    className='w-full max-w-auto border-none h-full outline-none py-[8px]'
                                    type='text'
                                    id='account_email_update'
                                    value={email}
                                    onChange={onChangeEmail}
                              />
                        </div>
                        <button
                              type='submit'
                              className='w-full h-[45px] flex items-center justify-center gap-[14px] bg-blue-700 text-white rounded-md'
                        >
                              <span>Lưu thay đổi</span>

                              {updateEmailMutation.isPending && <BoxLoading />}
                        </button>
                  </form>
                  {openSecurity && (
                        <CustomerPasswordSecurity
                              onCheck={setCheckSecurity}
                              onClose={setOpenSecurity}
                              user={user}
                              onGetPassword={setPassword}
                        />
                  )}
            </div>
      )
}

export default CustomerUpdateEmail
