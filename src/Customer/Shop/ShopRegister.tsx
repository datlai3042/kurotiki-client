import React, { useState } from 'react'
import BoxShopForm from '../../component/BoxUi/BoxShopForm'

const ShopRegister = () => {
      const [openForm, setOpenForm] = useState<boolean>(false)

      return (
            <div className='w-full h-[500px] bg-[#ffffff] rounded-md flex justify-center items-center'>
                  <button
                        className='w-[150px] h-[40px] bg-[#ffffff] border-[1px] border-blue-400 text-blue-400 rounded'
                        onClick={() => setOpenForm(true)}
                  >
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
