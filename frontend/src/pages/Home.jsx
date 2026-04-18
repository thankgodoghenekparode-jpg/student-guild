import { BookOpen, Compass, GraduationCap, Lightbulb, Sparkles, Trophy } from "lucide-react"
import { Link } from "react-router-dom"
import Card from "../components/Card"
import SectionHeader from "../components/SectionHeader"
import QuoteCard from "../components/QuoteCard"
import { quotes } from "../data/quotes"
import heroImg from "../assets/images/dashboard-hero.jpg"

const features = [
  { id: "quiz", title: "Career Quiz", icon: Sparkles, desc: "Match your strengths with in-demand careers.", to: "/quiz", color: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary" },
  { id: "courses", title: "Explore Courses", icon: GraduationCap, desc: "Compare WAEC and JAMB requirements fast.", to: "/courses", color: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary" },
  { id: "tips", title: "Study Tips", icon: Lightbulb, desc: "Learn techniques that improve retention.", to: "/advice", color: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary" },
  { id: "scholarships", title: "Scholarships", icon: Trophy, desc: "Find local and global funding.", to: "/scholarships", color: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary" },
  { id: "advice", title: "Student Advice", icon: BookOpen, desc: "Guides for WAEC, JAMB, and beyond.", to: "/advice", color: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary" }
]

export default function Home({ searchValue }) {
  const quote = quotes[Math.floor(Math.random() * quotes.length)]

  return (
    <div className="space-y-6 animate-rise">


      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="relative overflow-hidden rounded-[32px] px-6 py-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroImg})` }} />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/80 to-secondary/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-black/10" />
          
          <div className="relative space-y-6 text-white">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-white/20 p-3 shadow-lg backdrop-blur-md">
                <Compass size={24} className="text-white" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/80">
                  Welcome Back
                </p>
                <h2 className="font-display text-3xl font-bold text-white tracking-tight">
                  Your Career Dashboard
                </h2>
              </div>
            </div>

            <p className="max-w-xl text-base leading-relaxed text-white/90">
              Discover pathways, compare course requirements, and build an action plan that feels realistic and motivating.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/quiz"
                className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-primary shadow-[0_4px_14px_0_rgba(255,255,255,0.39)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-[0_6px_20px_rgba(255,255,255,0.23)]"
              >
                Take the Quiz
              </Link>
              <Link
                to="/courses"
                className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/20"
              >
                Explore Courses
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 pt-4">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-lg transition-transform duration-300 hover:-translate-y-1 hover:bg-white/20">
                <p className="font-display text-4xl font-bold">5</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] font-semibold text-white/80">Core paths</p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-lg transition-transform duration-300 hover:-translate-y-1 hover:bg-white/20">
                <p className="font-display text-4xl font-bold">24/7</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] font-semibold text-white/80">Study support</p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-lg transition-transform duration-300 hover:-translate-y-1 hover:bg-white/20">
                <p className="font-display text-4xl font-bold">1</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] font-semibold text-white/80">Clear next step</p>
              </div>
            </div>
          </div>
        </div>

        <Card className="space-y-5 border-none bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:bg-slate-900">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary">Focus now</p>
              <h3 className="mt-2 font-display text-xl font-bold text-slate-900 dark:text-white">
                Build Momentum
              </h3>
            </div>
            <span className="rounded-2xl bg-secondary/10 p-3 text-secondary shadow-inner">
              <Sparkles size={20} />
            </span>
          </div>

          <div className="space-y-4 pt-2">
            {[
              "Take the career quiz to narrow your direction.",
              "Compare course requirements before making choices.",
              "Save scholarships and tips that match your goals."
            ].map((step) => (
              <div
                key={step}
                className="group flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary/5 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-primary/10"
              >
                <span className="mt-0.5 flex h-7 w-7 min-w-[28px] items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  +
                </span>
                <p className="text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300">{step}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <SectionHeader
        title="Quick Actions"
        subtitle="Choose the area you want to improve today"
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((item) => (
          <Link key={item.id} to={item.to} className="block group h-full">
            <Card className="h-full space-y-4 border-none bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgb(0,0,0,0.08)] dark:bg-slate-900">
              <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${item.color}`}>
                <item.icon size={22} />
              </span>
              <div>
                <p className="text-base font-bold text-slate-800 dark:text-slate-100">{item.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <SectionHeader
        title="Motivation"
        subtitle="Daily boost to keep you going"
      />
      <QuoteCard quote={quote} />

      <SectionHeader
        title="Search Preview"
        subtitle="Popular goals students are exploring right now"
      />
      <Card className="space-y-3">
        <p className="text-xs uppercase tracking-[0.24em] text-primary/75">Trending</p>
        <div className="flex flex-wrap gap-2">
          {["Software Engineering", "Medicine", "Study planner", "Scholarships", "JAMB combo"].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary dark:border-primary/50 dark:bg-primary/10"
            >
              {tag}
            </span>
          ))}
        </div>
        {searchValue && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Searching for "{searchValue}"...
          </p>
        )}
      </Card>
    </div>
  )
}
