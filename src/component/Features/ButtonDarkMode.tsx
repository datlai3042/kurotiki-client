import { Moon, Sun } from 'lucide-react'
import { useContext } from 'react'
import { ThemeContext } from '../Context/ThemeContext'

const ButtonDarkMode = () => {
      const { theme, setTheme } = useContext(ThemeContext)

      const onChangeTheme = () => {
            setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
      }

      const borderRadius =
            theme === 'light'
                  ? 'border border-[var(--border-color-input)]'
                  : 'border border-[var(--border-color-input)]'

      return (
            <button
                  type='button'
                  onClick={onChangeTheme}
                  className={`${borderRadius} flex h-10 w-10 items-center justify-center rounded-xl text-text-theme transition hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800 dark:hover:text-blue-400`}
                  aria-label={theme === 'light' ? 'Bật chế độ tối' : 'Bật chế độ sáng'}
            >
                  {theme === 'light' ? (
                        <Moon size={18} strokeWidth={1.8} />
                  ) : (
                        <Sun size={18} strokeWidth={1.8} />
                  )}
            </button>
      )
}

export default ButtonDarkMode