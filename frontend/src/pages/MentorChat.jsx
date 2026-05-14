import { useEffect, useRef, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Bot, CornerDownLeft, LoaderCircle, MessageSquareQuote, Sparkles, User } from "lucide-react"
import Card from "../components/Card"
import SectionHeader from "../components/SectionHeader"
import { apiRequest } from "../utils/api"

const starterPrompts = [
  "What can I study with D7 in mathematics?",
  "Is accounting better than economics?",
  "Can I switch from science to art?"
]

export default function MentorChat() {
  const [draft, setDraft] = useState("")
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      text:
        "Ask about admission requirements, course comparisons, or switching paths. This mentor currently uses structured placeholder logic, and the backend is ready for OpenAI integration later.",
      followUps: starterPrompts
    }
  ])
  const [error, setError] = useState("")
  const endRef = useRef(null)

  const mutation = useMutation({
    mutationFn: async (question) => {
      const response = await apiRequest("/mentor/query", {
        method: "POST",
        body: JSON.stringify({ question })
      })
      return response
    },
    onSuccess: (response) => {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: response?.answer || "I could not generate a reply right now.",
          followUps: response?.followUps || []
        }
      ])
    },
    onError: (error) => {
      setError(error.message || "Unable to reach the AI mentor right now.")
    }
  })

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, mutation.isPending])

  const submitQuestion = (questionText) => {
    const question = String(questionText || draft).trim()

    if (!question) {
      return
    }

    setError("")
    setDraft("")
    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        role: "user",
        text: question
      }
    ])

    mutation.mutate(question)
  }

  return (
    <div className="space-y-6 animate-rise">
      <SectionHeader
        title="AI Mentor Chat"
        subtitle="Ask realistic school and course questions now, then plug in OpenAI later without changing the interface."
      />

      <div className="grid gap-6 xl:grid-cols-[0.82fr,1.18fr]">
        <Card className="space-y-5 p-6 sm:p-7">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary/70">
              Example prompts
            </p>
            <h3 className="mt-2 font-display text-2xl font-semibold text-slate-900 dark:text-white">
              Start with questions students actually ask
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              The backend endpoint uses placeholder response logic today, so we can drop in an OpenAI provider later without changing the chat contract.
            </p>
          </div>

          <div className="space-y-3">
            {starterPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => submitQuestion(prompt)}
                className="flex w-full items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-4 text-left transition-colors hover:border-primary/30 hover:bg-primary/5 dark:border-slate-800 dark:bg-slate-950"
              >
                <span className="mt-0.5 rounded-xl bg-primary/10 p-2 text-primary">
                  <MessageSquareQuote size={16} />
                </span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{prompt}</span>
              </button>
            ))}
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-primary to-secondary p-6 text-white">
            <div className="flex items-center gap-3">
              <Sparkles size={20} />
              <p className="text-sm font-bold uppercase tracking-[0.22em]">Scalable setup</p>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-white/85">
              Keep the frontend request shape stable and swap the placeholder provider in the backend for OpenAI when you are ready to add real mentor intelligence.
            </p>
          </div>
        </Card>

        <Card className="flex h-[72vh] flex-col overflow-hidden p-0">
          <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <span className="rounded-2xl bg-primary/10 p-3 text-primary">
                <Bot size={22} />
              </span>
              <div>
                <p className="font-display text-xl font-semibold text-slate-900 dark:text-white">Mentor Assistant</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Placeholder AI responses through the new backend endpoint
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/70 px-5 py-5 dark:bg-slate-950/60">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-3xl px-4 py-4 shadow-sm ${
                    message.role === "user"
                      ? "bg-primary text-white"
                      : "border border-slate-100 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                  }`}
                >
                  <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em]">
                    {message.role === "user" ? <User size={14} /> : <Bot size={14} />}
                    {message.role === "user" ? "Student" : "Mentor"}
                  </div>
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  {message.followUps?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {message.followUps.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => submitQuestion(prompt)}
                          className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-primary/10 hover:text-primary dark:bg-slate-800 dark:text-slate-300"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {mutation.isPending && (
              <div className="flex justify-start">
                <div className="rounded-3xl border border-slate-100 bg-white px-4 py-4 text-sm font-semibold text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <LoaderCircle className="animate-spin" size={16} />
                    Mentor is thinking...
                  </div>
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>

          <div className="border-t border-slate-200 px-5 py-5 dark:border-slate-800">
            {error && (
              <div className="mb-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-900/40 dark:bg-red-900/10 dark:text-red-300">
                {error}
              </div>
            )}

            <form
              onSubmit={(event) => {
                event.preventDefault()
                submitQuestion(draft)
              }}
              className="flex gap-3"
            >
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                rows={2}
                placeholder="Ask about subjects, comparisons, switching from science to art, or realistic course options..."
                className="min-h-[72px] flex-1 resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all focus:border-primary/50 focus:ring-4 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              />
              <button
                type="submit"
                disabled={mutation.isPending}
                className="inline-flex items-center gap-2 self-end rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                <CornerDownLeft size={16} />
                Send
              </button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  )
}
