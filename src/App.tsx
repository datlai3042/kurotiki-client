import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import AuthWrapper from './component/Auth/AuthWrapper'
import AuthenticationContext from './component/Context/AuthenticationContext'
import FooterMobile from './component/Footer/FooterMobile'
import ScrollToAnchor from './component/Header/Components/ScrollArchor'
import RouterController from './component/Routes/RouterController'
import './index.css'
import { RootState } from './store'
function App() {
      const boxLogin = useSelector((state: RootState) => state.auth.isOpenBoxLogin)
      const [, setShowBoxAuth] = useState(true)
      const location = useLocation().pathname


      useEffect(() => {
            window.scrollTo({
                  top: 0,
                  left: 0,
            })
      }, [location])

      useEffect(() => {}, [boxLogin])

      return (
            <div className=' min-h-screen  w-full min-w-full bg-color-gap-empty '>
                  <div id='main w-full ' className='min-h-screen flex flex-col'>
                        <AuthenticationContext />
                        <RouterController />
                        <FooterMobile className='block xl:hidden' />
                        <ScrollToAnchor />
                  </div>

                  {boxLogin && <AuthWrapper setShowBoxAuth={setShowBoxAuth} />}
            </div>
      )
}

export default App
