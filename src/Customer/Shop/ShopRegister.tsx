import React, { useState } from 'react'
import BoxShopForm from '../../component/BoxUi/BoxShopForm'
import { Plus } from 'lucide-react'

const ShopRegister = () => {
      const [openForm, setOpenForm] = useState<boolean>(false)

      return (
            <div className='w-full h-[70px] bg-color-section-theme rounded-md flex justify-center items-center'>
                  <button
                        className='w-[130px] h-[40px] flex gap-[6px] items-center justify-center  bg-color-main opacity-80 hover:opacity-100 text-[#fff] rounded'
                        onClick={() => setOpenForm(true)}
                  >
                        <Plus />
                        Đăng kí shop
                  </button>

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
