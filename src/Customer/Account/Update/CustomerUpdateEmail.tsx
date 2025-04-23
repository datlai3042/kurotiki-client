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
            // const checkEmail = validateEmail(email)
            // console.log({ checkEmail })
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
            <div className='flex items-center justify-center w-full  min-h-[200px] h-max  bg-color-section-theme text-text-theme py-[60px] rounded'>
                  <form
                        className='flex flex-col gap-[16px] min-w-[80%]  md:min-w-[150px] xl:min-w-[400px] xl:min-h-[150px] h-max max-w-auto  p-[24px] rounded-sm  shadow-2xl border-[1px] border-[var(--border-color-input)] '
                        style={{ width: Number(user.email.length) * 10 }}
                        onSubmit={onSubmit}
                  >
                        <label htmlFor='account_email_update' className='[word-spacing:1px] text-[16px]  font-medium '>
                              Địa chỉ Email
                        </label>

                        <div
                              className='w-full h-[50px] max-w-auto group flex gap-[10px] px-[8px] py-[2px] items-center border-[1px] border-[var(--border-color-input)] rounded'
                              tabIndex={0}
                        >
                              <Mail />
                              <input
                                    className='w-full max-w-auto border-none h-full outline-none py-[8px] bg-color-section-theme'
                                    type='text'
                                    id='account_email_update'
                                    value={email}
                                    onChange={onChangeEmail}
                              />
                        </div>
                        <button
                              type='submit'
                              className='w-full h-[45px] flex items-center justify-center gap-[14px]  rounded-[4px] bg-color-main opacity-100 hover:opacity-100 text-[#fff]'
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
