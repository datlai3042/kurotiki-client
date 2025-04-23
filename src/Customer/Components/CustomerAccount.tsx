import React, { useEffect } from 'react'

//@react-router
import { Link } from 'react-router-dom'

//@react-hook-form
import { useForm, FormProvider } from 'react-hook-form'

//@tanstack query
import { useMutation } from '@tanstack/react-query'

//@redux-toolkit
import { useDispatch, useSelector } from 'react-redux'
import { RootState, store } from '../../store'
import { fetchUser } from '../../Redux/authenticationSlice'

//@components
import CustomerAccountBirth from '../Account/form/CustomerAccountBirth'
import CustomerAccountGender from '../Account/form/CustomerAccountGender'

//@auth - api
import Account from '../../apis/account.service'

//@utils
import { checkAxiosError } from '../../utils/handleAxiosError'
import { sleep } from '../../utils/sleep'

//@icon
import TErrorAxios from '../../types/axios.response.error'
import { addToast } from '../../Redux/toast'
import InputText from '../Sell/components/InputText'
import AccountService from '../../apis/account.service'
import { UserResponse } from '../../types/user.type'
import BoxAvatarMode from '../Account/Box/BoxAvatarMode'
import { Key, Mail } from 'lucide-react'

//@type form
type TFormCustomer = {
      fullName: string
      nickName: string
      birth: {
            day: number
            month: number
            year: number
      }

      gender: string
}

//action

//@Component :: api
const CustomerAccount = () => {
      const user = useSelector((state: RootState) => state.authentication.user) as UserResponse
      const dispatch = useDispatch()

      const dayTime = new Date()
      // console.log({ id: Math.random() })
      const methods = useForm<TFormCustomer>({
            defaultValues: {
                  fullName: `${user.fullName || user?.email?.split('@')[0]}`,
                  nickName: `${user.nickName || '@' + user.email.split('@')[0] || 'none'}`,
                  birth: {
                        day: new Date(`${user.bob}`).getDate() || dayTime.getDate(),
                        month: new Date(`${user.bob}`).getMonth() + 1 || dayTime.getMonth() + 1,
                        year: new Date(`${user.bob}`).getFullYear() || dayTime.getFullYear(),
                  },
                  gender: `${user.gender}` || 'Male',
            },
            mode: 'onChange',
      })

      const getMe = useMutation({
            mutationKey: ['getMe'],
            mutationFn: async () => {
                  await AccountService.getMe()
            },
            onError: async (error: unknown) => {
                  if (checkAxiosError<TErrorAxios>(error)) {
                        if (
                              error.response?.status === 403 &&
                              error.response.statusText === 'Forbidden' &&
                              error.response.data?.detail === 'Refresh failed'
                        )
                              await sleep(3000)
                  }
            },
      })

      const updateInfo = useMutation({
            mutationKey: ['update-info'],
            mutationFn: (data: any) => Account.updateInfo(data),
            onSuccess: async (data: any) => {
                  // console.log('dispatch', { data })
                  dispatch(fetchUser({ user: data.data.metadata.user }))
                  // setShowToast((prev) => !prev)
                  dispatch(addToast({ type: 'SUCCESS', message: 'Cập nhập thông tin thành công', id: Math.random().toString() }))
            },

            onError: async (error) => {
                  //@[shape] :: error.response.data.error
                  if (checkAxiosError<TErrorAxios>(error)) {
                        if (error.response?.data?.code === 403 && error.response.data.message === 'Forbidden') {
                              // setShowToast(true)
                              await sleep(2000)
                        }

                        if (error.response?.data?.code === 400 && error.response.data.message === 'Bad Request') {
                              // setShowToast(true)
                              await sleep(2000)
                        }
                  }
            },
      })

      const handleGetMe = async () => {
            getMe.mutate()
      }

      //@[shape] :: error.response.data.error

      const submitfake = (data: TFormCustomer) => {}

      //submid update info account
      const onSubmit = (form: TFormCustomer) => {
            //Có 2 trường hợp sẽ xảy ra liên quan đến bob
            // thứ nhất theo mặc định sẽ là 'Ngày' 'Tháng' 'Năm' nếu người dùng không tương tác với field này thì ta sẽ gán cho nó = null
            // còn ngược lại thì ghép 3 chuỗi vừa nhận được từ hàm vaild kia để tạo ra 1 ngày hoàn chỉnh rồi gửi lên server
            // Tháng sẽ bằng giá trị tháng hiện có -1 vì mảng tháng bắt đầu = 0
            // Còn vì sao phải chia bob thành 3 field khác nhau vì ta cho chọn select riêng lẻ
            const newBirth = new Date(+form.birth.year, Number(form.birth.month) - 1, +form.birth.day)

            updateInfo.mutate({
                  ...form,
                  birth: newBirth,
                  nickName: form.nickName ? form.nickName : null,
                  fullName: form.fullName ? form.fullName : null,
            })
      }
      useEffect(() => {
            if (getMe.isSuccess) {
                  // dispatch(fetchUser({ user: getMe.data }))
                  dispatch(
                        addToast({
                              type: 'WARNNING',
                              message: `[Đã cập nhập thành công]`,
                              id: Math.random().toString(),
                        }),
                  )
            }
      }, [getMe.isSuccess, dispatch])


      return (
            <div className='bg-color-section-theme p-[16px] flex flex-col xl:flex-row min-h-full  w-full h-max gap-[20px] xl:gap-[2%] ]'>
                  {/* {toast && <BoxToast message={'Phien dang nhap het han, vui long xac thuc lai sau 3s'} children={<p>OK</p>} />} */}

                  <FormProvider {...methods}>
                        <form
                              className='w-full xl:w-[59%] h-auto flex flex-col gap-[8px]'
                              onSubmit={methods.handleSubmit(onSubmit)}
                              spellCheck={false}
                        >
                              {/* @header */}
                              <h3 className='h-[45px] font-openSans text-[18px]'>Thông tin cá nhân</h3>

                              {/* @change mode with avatar */}
                              <div className='  data-user flex flex-col lg:flex-row gap-[20px] xl:gap-0 xl:items-center'>
                                    {/* @onClick active mode*/}
                                    <div className='flex flex-row gap-[28px] flex-wrap  w-full '>
                                          <BoxAvatarMode
                                                AvatartSource={{
                                                      avatar: user.avatar?.secure_url,
                                                      avatar_default: user.avatar_url_default,
                                                }}
                                                Mode='USER'
                                          />
                                          {/* @ form update infomation account */}
                                          {/* @ formLayout - 1 */}
                                          <div className='min-h-[90px] flex flex-1 gap-[8px] flex-col '>
                                                {/* @ field::name -> fullname */}
                                                <div className='flex justify-between gap-[32px] w-full h-[35%] items-center text-[14px]'>
                                                      <InputText
                                                            FieldName='fullName'
                                                            LabelMessage='Họ và tên'
                                                            placehorder='Nhập tên đầy đủ'
                                                            defaultValue={true}
                                                            autofocus={window.innerWidth > 1024 ? true : false}
                                                            width='w-full'
                                                            flexDirectionRow={true}
                                                      />
                                                </div>
                                                {/* @ field::name -> nickname */}
                                                <div className='flex justify-between w-full gap-[32px] h-[35%] items-center text-[14px]'>
                                                      <InputText
                                                            FieldName='nickName'
                                                            LabelMessage='NickName'
                                                            placehorder='Nhập nickname của bạn'
                                                            defaultValue={true}
                                                            width='w-full'
                                                            flexDirectionRow={true}
                                                      />
                                                </div>
                                          </div>
                                    </div>
                              </div>
                              {/* @ formLayout - 2 */}
                              <div className='form_user w-full min-h-[50%] sm:min-h-[40%] xl:h-[40%]  max-h-auto  flex '>
                                    <div className='flex flex-col w-full gap-[16px] xl:gap-[32px] lg:pt-[15px]'>
                                          {/* @ field::bob */}
                                          <div className=' flex flex-col md:flex-row justify-between w-full   text-[14px] gap-[20px]'>
                                                <p className='w-max text-left lg:w-[100px]'>Ngày sinh</p>
                                                <CustomerAccountBirth />
                                          </div>
                                          {/* @ field::gender */}
                                          <div className='flex flex-col md:flex-row justify-between w-full  text-[14px] gap-[12px] mt-[8px] lg:mt-0'>
                                                <p className='w-max text-left lg:w-[100px]'>Giới tính</p>
                                                <CustomerAccountGender />
                                          </div>
                                          {/* @ form::action -> submit */}
                                          <div className='w-full mt-0 mb-[24px] xl:mb-0  flex justify-end xl:flex  '>
                                                <button
                                                      disabled={updateInfo.isPending}
                                                      className='flex items-center justify-center gap-[6px] ml-0 w-full xl:w-[180px] h-[20px] p-[20px] bg-blue-700 text-white rounded-md'
                                                      type='submit'
                                                >
                                                      <span>Lưu thay đổi</span>
                                                      {updateInfo.isPending && (
                                                            <span
                                                                  className=' inline-block h-[18px] w-[18px] text-[#ffffff] animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]'
                                                                  role='status'
                                                            ></span>
                                                      )}
                                                </button>
                                          </div>

                                          {/* @ form::action -> toast */}
                                          {/* {updateInfo.isSuccess && <BoxToast message={'Cập nhập thành công'} children={<p>OK</p>} />} */}
                                    </div>
                              </div>
                        </form>
                  </FormProvider>
                  {/* Right */}
                  <div className='hidden xl:block w-[1px] min-h-full bg-[var(--border-color-input)]'></div>
                  <div className='w-full xl:w-[45%] '>
                        {/* @customer::account -> update::email */}
                        <div className='flex flex-col gap-[8px]'>
                              <span className='text-[14px] text-[#1f4e94] font-semibold'>Email & liên hệ</span>

                              <div className='flex flex-col 2xl:flex-row  2xl:items-center min-h-[20px] pb-[15px] gap-[15px] 2xl:gap-0 '>
                                    <div className='flex gap-[16px] flex-1'>
                                          <Mail />
                                          <div className='w-full flex flex-col  '>
                                                <div className='min-w-[50px]'>Địa chỉ email:</div>
                                                <span className='flex-grow truncate max-w-[180px]   font-semibold'>{user.email}</span>
                                          </div>
                                    </div>
                                    <Link
                                          to={'/customer/account/update/email'}
                                          className='w-[100px]  flex items-center justify-center rounded-[4px] min-h-[20px] bg-color-main opacity-80 hover:opacity-100 text-[#fff] cursor-pointer p-[2px] '
                                    >
                                          Cập nhập
                                    </Link>
                              </div>
                        </div>

                        <div className='flex flex-col gap-[8px]'>
                              <span className='text-[14px] text-[#1f4e94] font-semibold'>Bảo mật</span>

                              <div className='flex flex-col 2xl:flex-row  2xl:items-center min-h-[20px] pb-[15px] gap-[15px] 2xl:gap-0 '>
                                    <div className='flex gap-[16px] flex-1'>
                                          <Key />
                                          <div className='w-full flex items-center  gap-[8px]'>
                                                <div className='min-w-[100px]'>Đổi mật khẩu</div>
                                          </div>
                                    </div>

                                    <Link
                                          to={'/customer/account/update/password'}
                                          className='w-[100px]  min-h-[20px]   flex items-center justify-center rounded-[4px] bg-color-main opacity-80 hover:opacity-100 text-[#fff] cursor-pointer p-[2px] '
                                    >
                                          Cập nhập
                                    </Link>
                              </div>
                        </div>
                        {/* @customer::account -> update::password */}
                        {/* <div className='flex flex-col gap-[1px]'>
                              <button className='bg-slate-900 text-white' onClick={handleGetMe}>
                                    Get me{' '}
                              </button>

                              <button
                                    className='bg-slate-900 text-white'
                                    onClick={() =>
                                          store.dispatch(addToast({ type: 'SUCCESS', message: 'Add', id: Math.random().toString() }))
                                    }
                              >
                                    Add toast{' '}
                              </button>
                        </div> */}
                  </div>
            </div>
      )
}

export default CustomerAccount
