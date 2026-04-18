import { Search, Bell, User } from "lucide-react"

export default function DashboardTopNav({ user }) {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200 bg-white/80 px-4 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80 sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 lg:gap-x-6">
        <form className="relative flex flex-1 items-center" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            id="search-field"
            className="block h-10 w-full max-w-md rounded-full border-0 bg-slate-100 py-0 pl-10 pr-4 text-sm text-slate-900 transition-shadow focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-slate-800 dark:text-slate-100 sm:text-sm"
            placeholder="Search classes, students, tasks..."
            type="search"
            name="search"
          />
        </form>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <p className="hidden text-sm font-medium text-slate-700 dark:text-slate-300 sm:block">
            Welcome back, <span className="font-semibold text-slate-900 dark:text-white">{user?.name || "Teacher"}</span>
          </p>

          <button type="button" className="relative p-2 text-slate-400 transition-colors hover:text-slate-500 dark:hover:text-slate-300">
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
          </button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-200 dark:lg:bg-slate-700" aria-hidden="true" />

          {/* Profile avatar */}
          <div className="flex items-center gap-x-4">
            <button type="button" className="flex items-center transition-transform hover:scale-105">
              <span className="sr-only">Open user menu</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white shadow-md">
                <User className="h-4 w-4" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
