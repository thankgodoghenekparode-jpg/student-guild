const { sanitizeText } = require("../utils/sanitize")
const { env } = require("../config/env")
const OpenAI = require("openai")

const openai = env.openaiApiKey ? new OpenAI({ apiKey: env.openaiApiKey }) : null

async function createMentorReply(question) {
  const sanitizedQuestion = sanitizeText(question, { maxLength: 500 })

  if (openai) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an AI career mentor for Nigerian secondary and university students. Provide helpful, accurate advice on courses, subjects, career paths, and admission requirements in Nigeria. Keep responses concise, practical, and encouraging. Focus on WAEC, JAMB, university/polytechnic options. If unsure, suggest checking official sources.`
          },
          {
            role: "user",
            content: sanitizedQuestion
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      })

      const answer = completion.choices[0]?.message?.content?.trim() || "I'm sorry, I couldn't generate a response right now."

      return {
        provider: "openai-gpt-4o-mini",
        message: answer,
        followUps: [
          "Can you tell me more about your subjects?",
          "What course are you interested in?",
          "Do you have questions about JAMB or WAEC?"
        ]
      }
    } catch (error) {
      console.error("OpenAI API error:", error.message)
      // Fallback to placeholder
    }
  }

  // Placeholder logic as fallback
  const normalizedQuestion = sanitizedQuestion.toLowerCase()

  if (normalizedQuestion.includes("d7") && normalizedQuestion.includes("mathematics")) {
    return {
      provider: "placeholder-rule-engine",
      message:
        "A D7 in Mathematics can close many science, engineering, and finance-heavy courses, but some arts, education, and communication options may still be realistic depending on the institution. Always verify the exact WAEC and JAMB requirements for the school you want, because many Nigerian universities still require at least a credit in Mathematics for broad admission eligibility.",
      followUps: [
        "Check courses in Mass Communication, Theatre Arts, Sociology, or some education pathways.",
        "Consider a resit plan if your preferred course depends heavily on Mathematics.",
        "Compare university requirements with polytechnic options for more flexibility."
      ]
    }
  }

  if (normalizedQuestion.includes("accounting") && normalizedQuestion.includes("economics")) {
    return {
      provider: "placeholder-rule-engine",
      message:
        "Accounting is usually stronger if you want direct financial operations, auditing, tax, or bookkeeping roles. Economics is broader if you care more about policy, markets, analysis, and development thinking. Neither is automatically better; the better fit depends on whether you prefer structured finance work or wider economic reasoning.",
      followUps: [
        "Choose Accounting if you enjoy precision, records, and finance systems.",
        "Choose Economics if you like policy, trends, research, and broad market questions.",
        "You can strengthen either path with Excel, data analysis, and business writing."
      ]
    }
  }

  if (normalizedQuestion.includes("switch") && normalizedQuestion.includes("science") && normalizedQuestion.includes("art")) {
    return {
      provider: "placeholder-rule-engine",
      message:
        "Yes, many students can switch from science to art or social science pathways, but the safest move depends on your current WAEC subjects and the course you now want. Before switching fully, check whether your existing subjects still support Law, Mass Communication, Political Science, or other target courses.",
      followUps: [
        "Review your present subject combination before changing direction.",
        "List three art or social science courses you are considering and compare requirements.",
        "If possible, speak with a school counselor before making subject-registration decisions."
      ]
    }
  }

  return {
    provider: "placeholder-rule-engine",
    message:
      "Your question is valid, and the best answer depends on your subjects, strongest interests, and target institution. The current mentor endpoint uses placeholder logic for now, but it is structured so an OpenAI-powered mentor can be plugged in later without changing the API contract.",
    followUps: [
      "Tell me your best three subjects.",
      "Share the course or career you are considering.",
      "Ask me to compare two courses for Nigerian admission reality."
    ]
  }
}

module.exports = { createMentorReply }
