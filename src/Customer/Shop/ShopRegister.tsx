import React, { useState } from 'react'
import BoxShopForm from '../../component/BoxUi/BoxShopForm'
import { Plus } from 'lucide-react'
import image from '../Sell/logistic.jpg'

const ShopRegister = () => {
      const [openForm, setOpenForm] = useState<boolean>(false)

      return (
            <div className='w-full  flex-col  rounded-md flex justify-center items-center'>
                  <div className=' h-[70px] w-full  bg-color-section-theme rounded-md flex justify-center items-center'>
                        <button
                              className='w-[130px] h-[40px] flex gap-[6px] items-center justify-center  bg-color-main opacity-80 hover:opacity-100 text-[#fff] rounded'
                              onClick={() => setOpenForm(true)}
                        >
                              <Plus />
                              Đăng kí shop
                        </button>
                  </div>

                  <div className='h-[300px] w-full mt-[20px] '>
                        <img src={image} className='min-w-full w-full max-h-full object-cover' />
                  </div>
                  {openForm && (
                        <BoxShopForm
                              defaultValues={{ shop_avatar: '', shop_name: '', shop_description: '' }}
                              modeForm='UPLOAD'
                              onClose={setOpenForm}
                        />
                  )}
            </div>
      )
}

export default ShopRegister
