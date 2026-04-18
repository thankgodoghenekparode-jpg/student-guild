import { Calendar, Clock, CheckCircle } from "lucide-react"

export default function Planner() {
  const milestones = [
    { title: "NIN Registration", date: "Jan 15, 2026", status: "completed", type: "Prerequisite" },
    { title: "JAMB Form Purchase", date: "Feb 10, 2026", status: "pending", type: "Important" },
    { title: "JAMB Mock Exam", date: "Mar 12, 2026", status: "upcoming", type: "Exam" },
    { title: "Main UTME Examination", date: "Apr 20, 2026", status: "upcoming", type: "Exam" },
  ]

  const subjectsToStudy = [
    { title: "Organic Chemistry", time: "2 Hours", day: "Today" },
    { title: "English Lexis & Structure", time: "1 Hour", day: "Tomorrow" },
    { title: "Physics: Motion", time: "3 Hours", day: "Wednesday" },
  ]

  return (
    <div className="space-y-8 animate-rise">
      <div>
        <h1 className="font-display text-4xl font-bold text-slate-900 dark:text-white">Study Planner</h1>
        <p className="text-slate-500 mt-1 font-medium">Keep track of your study goals and admission deadlines</p>
      </div>

      <div className="grid md:grid-cols-[1fr_1.5fr] gap-6">
        {/* Urgent Syllabus tasks */}
        <div className="space-y-6">
           <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Clock className="text-primary" size={20} /> Upcoming Study Sessions
           </h3>
           <div className="space-y-3">
             {subjectsToStudy.map((sub, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm flex justify-between items-center group cursor-pointer hover:border-primary/30 transition-colors">
                   <div>
                     <p className="font-bold text-sm text-slate-800 dark:text-slate-200">{sub.title}</p>
                     <p className="text-xs text-slate-500 font-medium mt-0.5">{sub.day} • {sub.time}</p>
                   </div>
                   <button className="h-8 w-8 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-transparent group-hover:border-primary group-hover:bg-primary/10 transition-all">
                      <CheckCircle size={16} className="text-primary opacity-0 group-hover:opacity-100" />
                   </button>
                </div>
             ))}
           </div>
           
           <button className="w-full py-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-500 font-bold text-sm hover:border-primary hover:text-primary transition-colors">
             + Add Study Topic
           </button>
        </div>

        {/* JAMB Calendar */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
           <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                 <Calendar className="text-secondary" size={20} /> Admission Milestones
              </h3>
           </div>
           
           <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent">
              {milestones.map((ms, i) => (
                 <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 text-slate-500 group-[.is-active]:bg-primary group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 overflow-hidden z-10 transition-colors">
                       {ms.status === 'completed' ? <CheckCircle size={18} className="text-emerald-500" /> : <div className="w-3 h-3 bg-secondary rounded-full" />}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-sm">
                       <span className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1 block">{ms.type}</span>
                       <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1">{ms.title}</h4>
                       <span className="text-xs text-slate-500 font-bold bg-white dark:bg-slate-900 px-2 py-1 rounded inline-block shadow-sm">{ms.date}</span>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  )
}
