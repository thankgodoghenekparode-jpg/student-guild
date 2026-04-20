const { sanitizeText } = require("../utils/sanitize")

function createMentorReply(question) {
  const normalizedQuestion = sanitizeText(question, { maxLength: 500 }).toLowerCase()

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
