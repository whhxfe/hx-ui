import { ref, watch, onMounted } from 'vue'

const isDark = ref(false)
const STORAGE_KEY = 'hx-ui-theme'

export function useTheme() {
  const initTheme = () => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      isDark.value = saved === 'dark'
    } else {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    applyTheme()
  }

  const applyTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
    localStorage.setItem(STORAGE_KEY, isDark.value ? 'dark' : 'light')
    applyTheme()
  }

  const setTheme = (dark: boolean) => {
    isDark.value = dark
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
    applyTheme()
  }

  onMounted(() => {
    initTheme()
  })

  return {
    isDark,
    toggleTheme,
    setTheme,
  }
}
