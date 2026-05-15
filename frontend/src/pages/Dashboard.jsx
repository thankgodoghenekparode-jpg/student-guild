import { ArrowRight, BookOpen, Compass, GraduationCap, MonitorPlay, Sparkles, Target, Trophy } from "lucide-react"
import { Link } from "react-router-dom"
import heroImg from "../assets/images/dashboard-hero.jpg"

const quickLinks = [
  { title: "CBT Practice", icon: MonitorPlay, to: "/practice", color: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300" },
  { title: "Explore Careers", icon: Compass, to: "/careers", color: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" },
  { title: "Explore Courses", icon: GraduationCap, to: "/courses", color: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" },
  { title: "Survival Guide", icon: BookOpen, to: "/advice", color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
  { title: "Scholarships", icon: Trophy, to: "/scholarships", color: "bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-200" },
  { title: "Goal Tracker", icon: Target, to: "/planner", color: "bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300" }
]

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-rise">
      <div className="relative overflow-hidden rounded-[32px] p-8 shadow-lg group md:p-12">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${heroImg})` }}
        />
        <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-r from-primary to-secondary/80 mix-blend-multiply opacity-90" />
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative z-10 max-w-3xl text-white">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Sparkles size={14} /> JAMB 2026 Focus
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Chart Your Path to Higher Education.
          </h1>
          <p className="mt-4 text-lg font-medium leading-relaxed text-white/90">
            Take the course quiz, compare Nigerian admission requirements, and ask the AI mentor the questions students actually have.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/quiz"
              className="flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-primary shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <Compass size={18} /> Take Course Quiz
            </Link>
            <Link
              to="/practice"
              className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 font-bold text-white backdrop-blur-sm transition-all hover:-translate-y-1 hover:bg-white/20"
            >
              <MonitorPlay size={18} /> Start CBT Practice
            </Link>
            <Link
              to="/courses"
              className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 font-bold text-white backdrop-blur-sm transition-all hover:-translate-y-1 hover:bg-white/20"
            >
              <GraduationCap size={18} /> Explore Courses
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[1.05fr,1.35fr]">
        <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
          <div className="absolute right-0 top-0 p-8 text-primary/5">
            <Target size={120} />
          </div>
          <h3 className="relative z-10 text-xl font-bold text-slate-800 dark:text-white">
            Mock Exam Progress
          </h3>
          <p className="relative z-10 mb-6 text-sm font-medium text-slate-500">
            Targeting University of Lagos admission benchmarks
          </p>

          <div className="relative z-10 space-y-4">
            <div>
              <div className="mb-1.5 flex justify-between text-sm font-bold">
                <span className="text-slate-700 dark:text-slate-200">Current Mock Score</span>
                <span className="text-primary">245 / 400</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                  style={{ width: "61%" }}
                />
              </div>
            </div>
            <p className="flex items-center gap-1 text-xs font-bold text-emerald-500">
              <ArrowRight size={14} className="-rotate-45" /> +15 points from last month
            </p>
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-950 dark:text-slate-300">
              Pair your mock score with the course explorer so you can compare realistic cut-off marks and subjects early.
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((item) => (
            <Link
              key={item.title}
              to={item.to}
              className="group flex flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-sm transition-all hover:border-primary/20 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className={`mb-4 rounded-2xl p-4 transition-transform group-hover:scale-110 ${item.color}`}>
                <item.icon size={28} />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100">{item.title}</h4>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
