import { Sparkles, ArrowRight, Target, Compass, BookOpen, GraduationCap, Trophy } from "lucide-react"
import { Link } from "react-router-dom"
import heroImg from "../assets/images/dashboard-hero.jpg"

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-rise">
      {/* Student Welcome Hero */}
      <div className="relative overflow-hidden rounded-[32px] p-8 md:p-12 shadow-lg group">
        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${heroImg})` }} />
        <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-r from-primary to-secondary/80 mix-blend-multiply opacity-90" />
        <div className="absolute inset-0 bg-black/10" />
        
        <div className="relative z-10 text-white max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/30">
             <Sparkles size={14} /> JAMB 2026 Focus
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Chart Your Path to Higher Education.
          </h1>
          <p className="mt-4 text-lg text-white/90 leading-relaxed font-medium">
            Not sure what to study? Let's discover your strengths, check subject combinations, and prepare for your university journey.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/quiz" className="bg-white text-primary px-6 py-3.5 rounded-xl font-bold hover:-translate-y-1 hover:shadow-xl transition-all shadow-lg flex items-center gap-2">
              <Compass size={18} /> Take Career Quiz
            </Link>
            <Link to="/courses" className="border border-white/30 bg-white/10 px-6 py-3.5 rounded-xl font-bold text-white hover:-translate-y-1 hover:bg-white/20 transition-all flex items-center gap-2 backdrop-blur-sm">
              <GraduationCap size={18} /> Explore Courses
            </Link>
          </div>
        </div>
      </div>

      {/* JAMB Progress Snapshot */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 text-primary/5">
              <Target size={120} />
           </div>
           <h3 className="text-xl font-display font-bold text-slate-800 dark:text-white relative z-10">Mock Exam Progress</h3>
           <p className="text-sm text-slate-500 font-medium mb-6 relative z-10">Targeting University of Lagos (Medicine)</p>
           
           <div className="space-y-4 relative z-10">
              <div>
                <div className="flex justify-between text-sm font-bold mb-1.5">
                  <span className="text-slate-700 dark:text-slate-200">Current Mock Score</span>
                  <span className="text-primary">245 / 400</span>
                </div>
                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                   <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: '61%' }} />
                </div>
              </div>
              <p className="text-xs font-bold text-emerald-500 flex items-center gap-1"><ArrowRight size={14} className="-rotate-45" /> +15 points from last month</p>
           </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-4">
           {[
             { title: "Explore Careers", icon: Compass, to: "/careers", color: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" },
             { title: "Explore Courses", icon: GraduationCap, to: "/courses", color: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" },
             { title: "Scholarships", icon: Trophy, to: "/scholarships", color: "bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-500/10 dark:text-fuchsia-400" },
             { title: "Study Planner", icon: BookOpen, to: "/planner", color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
           ].map((item, i) => (
             <Link key={i} to={item.to} className="group bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-center items-center text-center hover:border-primary/20 hover:shadow-md transition-all">
                <div className={`p-4 rounded-2xl mb-4 transition-transform group-hover:scale-110 ${item.color}`}>
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
