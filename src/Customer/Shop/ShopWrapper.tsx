import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { UserResponse } from '../../types/user.type'
import ShopRegister from './ShopRegister'
import ShopOwner from './Owner/ShopOwner'

const ShopWrapper = () => {
      const user = useSelector((state: RootState) => state.authentication.user) as UserResponse

      return <div className='w-full'>{user.isOpenShop ? <ShopOwner /> : <ShopRegister />}</div>
}

export default ShopWrapper
