import { Route, Routes, useLocation } from 'react-router-dom'

//page
import Admin from '../../pages/admin/Admin'
// import Buy from '../Content/Content_right/Buy/Buy'
// import Contact from '../Contact/Contact'
import Cart from '../Cart/Cart'
import Content from '../Content/Content'
import NotFound from '../Errors/NotFound'

// section layout
import Header from '../Header/Header'
import Sidebar from '../Sidebar/Sidebar'

//page -> path /customer
import { useSelector } from 'react-redux'
import CustomerUpdateEmail from '../../Customer/Account/Update/CustomerUpdateEmail'
import CustomerUpdatePassword from '../../Customer/Account/Update/CustomerUpdatePassword'
import CustomerAccount from '../../Customer/Components/CustomerAccount'
import CustomerNotification from '../../Customer/Components/CustomerNotification'
import CustomerOrderHistory from '../../Customer/Components/CustomerOrderHistory'
import Customer from '../../Customer/Customer'
import PermisionProductUpdate from '../../Customer/Sell/Category/Book/PermissionProductUpdate'
import RegisterSell from '../../Customer/Sell/RegisterSell'
import { ShopAnalysisTopBuy, ShopAnalysisTopComment, ShopAnalysisTopView } from '../../Customer/Shop/ShopAnalysis'
import ShopProductList from '../../Customer/Shop/ShopProductList'
import ShopWrapper from '../../Customer/Shop/ShopWrapper'
import CustomerUserAddress from '../../Customer/UserAddress/CustomerUserAddress'
import OrderCheck from '../../pages/orderCheck/OrderCheck'
import Payment from '../../pages/payment/Payment'
import Product from '../../pages/product/Product'
import Category from '../../pages/ProductCategories/Category'
import Shop from '../../pages/shop/Shop'
import QueryParams from '../../QueryParams'
import { RootState } from '../../store'
import Box from '../BoxUi/Box'

const RouterController = () => {
      const pathHiddenHeader = ['/admin', '/payment', '/box']
      // const hideHeaderShopPath = window.location.pathname.startsWith('/shop')
      // console.log(window.location.pathname, hideHeaderShopPath)
      const hiddenHeader = pathHiddenHeader.includes(window.location.pathname)
      const pathName = useLocation().pathname
      const showOverload = useSelector((state: RootState) => state.uiSlice.showOverload)

      const styleEffect = {
            matchPathName: window.location.pathname !== '/payment' ? '  pt-[65px] md:pt-[60px] pb-[45px] md:pb-0' : '',
            matchPathNameCustomer: pathName.startsWith('/customer') ? 'top-[0px] ' : 'top-[60px] lg:h-[calc(100vh-100px)]',
            layoutFull: pathName?.startsWith('/customer') ? '' : 'mx-auto max-w-full  xl:max-w-[1360px]',
      }
      const uiSlice = useSelector((state: RootState) => state.uiSlice.showSideBar)

      return (
            <>
                  {!hiddenHeader && <Header />}

                  <div
                        className={`${styleEffect.matchPathName} ${styleEffect.layoutFull} z-[1]  flex-1 w-full  items-stretch h-max  flex flex-col md:flex-row gap-[18px]    bg-color-gap-empty 
`}
                  >
                        {true && <Sidebar />}
                        <Routes>
                              <Route path='/admin' element={<Admin />} />
                              <div id='' className={`${styleEffect.matchPathNameCustomer}  relative  lg:flex  gap-8 `}>
                                    <Route path='/' element={<Content />} />

                                    <Route path='/product/:id' element={<Product />} />
                                    <Route path='/order-check/:order_id' element={<OrderCheck />} />
                                    <Route path='/book' element={<Category product_type='Book' />} />
                                    <Route path='/shop' element={<ShopWrapper />}></Route>

                                    <Route path='/food' element={<Category product_type='Food' />} />
                                    <Route path='/shop/:shop_id' element={<Shop />} />

                                    <Route path='/payment' element={<Payment />} />
                                    <Route path='/cart' element={<Cart />} />
                                    <Route
                                          path='/box'
                                          element={
                                                <Box>
                                                      <div className='fixed inset-0 bg-[rgba(0,0,0,.4)] h-screen flex items-center justify-center z-[500]'>
                                                            {/* <BoxCommentProduct /> */}
                                                      </div>{' '}
                                                </Box>
                                          }
                                    />

                                    <Routes>
                                          <Route path='/customer' element={<Customer />}>
                                                <Route path='account' element={<CustomerAccount />} />
                                                <Route path='account/update/email' element={<CustomerUpdateEmail />} />
                                                <Route path='account/update/password' element={<CustomerUpdatePassword />} />

                                                <Route path='notification' element={<CustomerNotification />} />
                                                <Route path='order_history' element={<CustomerOrderHistory />} />
                                                <Route path='shop' element={<ShopWrapper />} />
                                                <Route path='shop/product-list' element={<ShopProductList />} />
                                                <Route path='account/address' element={<CustomerUserAddress />} />
                                                <Route path='shop/top-buy' element={<ShopAnalysisTopBuy />} />
                                                <Route path='shop/top-view' element={<ShopAnalysisTopView />} />
                                                <Route path='shop/top-comment' element={<ShopAnalysisTopComment />} />

                                                <Route path='register-sell' element={<RegisterSell />} />
                                          </Route>
                                          <Route path='product/update/:product_id' element={<PermisionProductUpdate />} />
                                          <Route path='query-params' element={<QueryParams />} />
                                    </Routes>
                              </div>

                              <Route path='*' element={<NotFound />} />
                        </Routes>
                        {showOverload && <div className='w-full h-full fixed inset-0 bg-[rgba(0,0,0,.75)] z-[500] mt-[60px]'></div>}
                  </div>
            </>
      )
}

export default RouterController
