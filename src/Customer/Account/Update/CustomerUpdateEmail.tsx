import { Mail } from 'lucide-react'
import { RootState } from '../../../store'
import { useDispatch, useSelector } from 'react-redux'
import { UserResponse } from '../../../types/user.type'
import { useEffect, useRef, useState } from 'react'
import { addToast } from '../../../Redux/toast'
import { validateEmail } from '../../../utils/account.utils'
import CustomerPasswordSecurity from '../form/CustomerPasswordSecurity'
import { check } from 'prettier'
import { useMutation } from '@tanstack/react-query'
import AccountService from '../../../apis/account.service'
import { fetchUser } from '../../../Redux/authenticationSlice'
import BoxLoading from '../../../component/BoxUi/BoxLoading'

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
                  dispatch(addToast({ id: Math.random().toString(), message: 'Email không hợp lệ', type: 'WARNNING' }))
                  return
            }
            if (!email) {
                  dispatch(addToast({ id: Math.random().toString(), message: 'Bạn không thể gửi email rỗng', type: 'WARNNING' }))
                  return
            }

            if (email === user?.email) {
                  dispatch(addToast({ id: Math.random().toString(), message: 'Email không có sự thay đổi', type: 'WARNNING' }))
                  return
            }

            if (!checkSecurity) {
                  setOpenSecurity(true)
                  return
            }
            updateEmailMutation.mutate({ password, newEmail: email })
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
                  dispatch(addToast({ id: Math.random().toString(), message: 'Cập nhập Email thành công', type: 'SUCCESS' }))
            },
      })

      return (
            <div className='w-full rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme text-text-theme shadow-[0_8px_30px_rgba(15,23,42,0.05)]'>
                  <div className='border-b border-[var(--border-color-input)] px-5 py-4 xl:px-6'>
                        <h2 className='text-lg font-semibold text-text-theme'>Cập nhập email</h2>
                        <p className='mt-1 text-sm text-slate-500'>
                              Thay đổi địa chỉ email dùng để đăng nhập và nhận thông báo tài khoản.
                        </p>
                  </div>

                  <div className='flex min-h-[420px] items-center justify-center px-4 py-8 xl:px-8'>
                        <form
                              className='w-full max-w-[560px] rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme p-5 shadow-[0_16px_45px_rgba(15,23,42,0.08)] xl:p-6'
                              style={{ width: Number(user.email.length) * 10 }}
                              onSubmit={onSubmit}
                        >
                              <div className='mb-5 flex items-start gap-3'>
                                    <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500'>
                                          <Mail size={20} strokeWidth={1.8} />
                                    </div>

                                    <div>
                                          <h3 className='text-base font-semibold text-text-theme'>Địa chỉ Email</h3>
                                          <p className='mt-1 text-xs leading-5 text-slate-500'>
                                                Sau khi thay đổi, bạn có thể cần xác thực lại để bảo vệ tài khoản.
                                          </p>
                                    </div>
                              </div>

                              <label
                                    htmlFor='account_email_update'
                                    className='mb-2 block text-sm font-medium text-text-theme'
                              >
                                    Email mới
                              </label>

                              <div
                                    className='group flex h-12 w-full items-center gap-3 rounded-xl border border-[var(--border-color-input)] px-3 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 dark:border-slate-700'
                                    tabIndex={0}
                              >
                                    <Mail size={18} className='shrink-0 text-slate-400' />
                                    <input
                                          className='h-full w-full border-none bg-transparent text-sm text-text-theme outline-none placeholder:text-slate-400'
                                          type='text'
                                          id='account_email_update'
                                          value={email}
                                          onChange={onChangeEmail}
                                    />
                              </div>

                              <button
                                    ref={buttonSubmit}
                                    type='submit'
                                    className='mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700'
                              >
                                    <span>Lưu thay đổi</span>
                                    {updateEmailMutation.isPending && <BoxLoading />}
                              </button>
                        </form>
                  </div>

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