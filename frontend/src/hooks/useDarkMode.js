import { useEffect, useState } from "react"

const STORAGE_KEY = "scg-theme"

export default function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return saved === "dark"
    return window.matchMedia("(prefers-color-scheme: dark)").matches
  })

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add("dark")
      localStorage.setItem(STORAGE_KEY, "dark")
    } else {
      root.classList.remove("dark")
      localStorage.setItem(STORAGE_KEY, "light")
    }
  }, [isDark])

  return { isDark, setIsDark }
}
