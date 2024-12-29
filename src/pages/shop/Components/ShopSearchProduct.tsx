import { Search } from 'lucide-react'
import React, { SetStateAction, useEffect, useState } from 'react'

type TProps = {
      search: string
      setSearch: React.Dispatch<SetStateAction<string>>
}

const ShopSearchProduct = (props: TProps) => {
      const { setSearch, search } = props
      const [searchName, setSearchName] = useState<string>('')

      const onSubmit = (e: React.FormEvent) => {
            e.preventDefault()

            setSearch(searchName)
      }

      useEffect(() => {
            if (!search) {
                  setSearchName('')
            }
      }, [search])

      return (
            <form className='w-full min-w-[320px] h-[40px] flex items-center p-[8px] bg-[#ffffff]  rounded-lg gap-[8px]' onSubmit={onSubmit}>
                  <Search />
                  <input
                        type='text'
                        className='w-full h-full outline-none placeholder:text-[13px] placeholder:text-slate-400 '
                        placeholder='Nhập tên sản phẩm tại cửa hàng'
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                  />
            </form>
      )
}

export default ShopSearchProduct
