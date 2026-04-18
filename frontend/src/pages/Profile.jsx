import { Heart, LogOut, Star, Target, Trash2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import useLocalStorage from "../hooks/useLocalStorage"

const SAVED_CAREERS_KEY = "scg-saved-careers"
const QUIZ_RESULTS_KEY = "scg-quiz-results"

export default function Profile() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [savedCareers, setSavedCareers] = useLocalStorage(SAVED_CAREERS_KEY, [])
  const [savedQuizResults] = useLocalStorage(QUIZ_RESULTS_KEY, [])

  const latestRecommendation = savedQuizResults[0]?.recommendations?.[0]
  const aspiration = savedCareers[0]?.title || latestRecommendation?.title || "Aspiring Student"

  const removeSavedCareer = (careerId) => {
    setSavedCareers((current) => current.filter((career) => career.id !== careerId))
  }

  const handleSignOut = () => {
    logout()
    navigate("/auth")
  }

  return (
    <div className="space-y-6 animate-rise">
      {/* Profile Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-r from-primary/80 to-secondary/80 mix-blend-multiply" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end gap-6 mt-6">
          <div className="h-24 w-24 rounded-full bg-white dark:bg-slate-900 p-1.5 shadow-lg shrink-0">
             <div className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Avatar" className="w-full h-full object-cover" />
             </div>
          </div>
          <div className="text-center sm:text-left pb-1">
             <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">{user?.name || "Student"}</h1>
             <p className="text-slate-500 font-medium">{aspiration}</p>
             <p className="mt-1 text-sm text-slate-400">{user?.email || "No email available"}</p>
          </div>
          <div className="sm:ml-auto flex gap-3 pb-1">
             <button
               type="button"
               onClick={() => navigate("/careers")}
               className="px-4 py-2 text-sm font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-2"
             >
               Explore Careers
             </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
         {/* Top Subject Strengths */}
         <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
               <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2"><Star size={18} className="text-secondary" /> Exam Strengths</h3>
            </div>
            <div className="space-y-4">
               {[
                 { sub: "Mathematics", score: "82%" },
                 { sub: "Physics", score: "74%" },
                 { sub: "English Language", score: "68%" }
               ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                     <span className="font-medium text-slate-700 dark:text-slate-300">{item.sub}</span>
                     <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{item.score}</span>
                  </div>
               ))}
            </div>
         </div>

         {/* Saved Careers */}
         <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
               <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2"><Heart size={18} className="text-red-500" /> Bookmarked Paths</h3>
               <span className="text-xs font-bold text-slate-400">{savedCareers.length} saved</span>
            </div>
            <div className="space-y-3">
               {savedCareers.length > 0 ? savedCareers.map((career) => (
                  <div key={career.id} className="group p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-colors">
                     <div className="flex items-start justify-between gap-3">
                        <div>
                           <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1">{career.title}</h4>
                           <p className="text-xs text-slate-500 dark:text-slate-400">{career.field}</p>
                           <p className="mt-2 text-xs text-slate-500 flex items-center gap-1"><Target size={12} /> {(career.universities || []).join(", ") || "Universities coming soon"}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSavedCareer(career.id)}
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                          aria-label={`Remove ${career.title} from saved careers`}
                        >
                          <Trash2 size={15} />
                        </button>
                     </div>
                  </div>
               )) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-5 text-center dark:border-slate-700">
                     <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No careers saved yet.</p>
                     <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Use the Save to Profile button on the careers page and your picks will appear here.</p>
                  </div>
               )}
               <button
                 type="button"
                 onClick={() => navigate("/careers")}
                 className="w-full py-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-400 font-bold text-xs hover:border-primary hover:text-primary transition-colors flex justify-center items-center gap-2 mt-4"
               >
                 Explore More Careers
               </button>
            </div>
         </div>
      </div>

       <div className="flex justify-center mt-8">
          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-600 transition-colors hover:underline"
          >
             <LogOut size={16} /> Sign out of account
          </button>
       </div>
    </div>
  )
}
