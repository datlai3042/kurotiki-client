import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import AuthWrapper from './component/Auth/AuthWrapper'
import AuthenticationContext from './component/Context/AuthenticationContext'
import Footer from './component/Footer/Footer'
import FooterMobile from './component/Footer/FooterMobile'
import ScrollToAnchor from './component/Header/Components/ScrollArchor'
import RouterController from './component/Routes/RouterController'
import useGetMe from './hooks/me/useGetMe'
import './index.css'
import { RootState } from './store'
function App() {
      const boxLogin = useSelector((state: RootState) => state.authentication.isOpenBoxLogin)
      const [, setShowBoxAuth] = useState(true)
      const location = useLocation().pathname

       useGetMe()

      useEffect(() => {
            window.scrollTo({
                  top: 0,
                  left: 0,
            })
      }, [location])

      useEffect(() => {}, [boxLogin])

  



      return (
            <div className=' min-h-screen  w-full min-w-full bg-[rgb(245_245_250)] '>
                  <div id='main w-full ' className='min-h-screen flex flex-col'>
                        <AuthenticationContext />
                        <RouterController />
                        <FooterMobile className='block xl:hidden' />
                        <ScrollToAnchor />
                          <div className='mt-[20px] hidden xl:block mx-auto max-w-full md:max-w-[1023px] xl:max-w-[1400px]'>
                        <Footer />
                  </div>
                  </div>

                  {boxLogin && <AuthWrapper setShowBoxAuth={setShowBoxAuth} />}
            </div>
      )
}

export default App
