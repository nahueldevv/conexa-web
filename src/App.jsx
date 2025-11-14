import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import Navbar from "./components/layout/NavBar"

function App() {
  const [theme, setTheme] = useState(() => 
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  )

  useEffect(() => {
    const htmlElement = document.querySelector("html")
    if (theme === "dark") {
      htmlElement.classList.add("dark")
    } else {
      htmlElement.classList.remove("dark")
    }
  }, [theme])

  const handleChangeTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"))
  }

  return (
    <div 
      className="min-h-screen w-full font-display 
                 bg-white text-neutral-800 
                 dark:bg-neutral-950 dark:text-neutral-200 
                 transition-colors duration-200"
    >
      <Navbar />

      <button
        onClick={handleChangeTheme}
        className="fixed bottom-4 right-4 z-50 px-4 py-2 rounded-lg font-bold shadow-md transition-colors
          bg-amber-500 hover:bg-amber-600 text-black 
          dark:bg-cyan-400 dark:hover:bg-cyan-500 dark:text-black"
      >
        {theme === "light" ? "🌙" : "🌞"}
      </button>

      <Outlet />
    </div>
  )
}

export default App