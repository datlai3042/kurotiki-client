'use client'
import { Moon, Sun } from 'lucide-react'
import { useContext } from 'react'
import { ThemeContext } from '../Context/ThemeContext'

const ButtonDarkMode = () => {
      const { theme, setTheme } = useContext(ThemeContext)

      const onChangeTheme = () => {
            setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
      }

      const borderRadius = theme === 'light' ? 'border-[.1rem] border-[var(--border-color-input)]' : 'border-[.1rem] border-transparent'

      return (
            <div
                  onClick={() => {
                        if (theme === 'light') {
                              return setTheme('dark')
                        } else {
                              return setTheme('light')
                        }
                  }}
                  className={`${borderRadius} flex items-center opacity-65 hover:opacity-100 cursor-pointer hover:bg-color-main p-[.4rem] hover:border-transparent text-text-theme hover:text-[#fff] rounded-[.4rem]`}
            >
                  {theme === 'light' ? <Moon className='h-[16px] w-[16px] ' /> : <Sun className='h-[16px] w-[16px]' />}
            </div>
            // <button
            // 	onClick={onChangeTheme}
            // 	className="relative text-text-theme min-w-[4rem] bg-[#fff] w-[6rem] h-[3rem] rounded-full"
            // >
            // 	<div
            // 		className={`${changeCirclePosition} w-[2.2rem] h-[2.2rem] rounded-full absolute top-[50%] translate-y-[-50%]  `}
            // 	></div>
            // 	{theme === "light" ? (
            // 		<Image
            // 			src={"/assets/images/icon/theme/bg_dark.jpg"}
            // 			width={18}
            // 			height={18}
            // 			alt="icon"
            // 			className="w-full h-full rounded-full object-cover"
            // 			unoptimized={true}
            // 		/>
            // 	) : (
            // 		<Image
            // 			src={"/assets/images/icon/theme/bg_light.jpg"}
            // 			width={18}
            // 			height={18}
            // 			alt="icon"
            // 			className="w-full h-full rounded-full"
            // 			unoptimized={true}
            // 		/>
            // 	)}
            // </button>
      )
}

export default ButtonDarkMode
