const { createMentorReply } = require("../services/mentorService")
const { assertRequiredString } = require("../utils/validation")

async function askMentor(request, response) {
  const question = assertRequiredString(request.body.question, "Question", { maxLength: 500 })
  const reply = await createMentorReply(question)

  response.json({
    provider: reply.provider,
    question,
    answer: reply.message,
    followUps: reply.followUps,
    timestamp: new Date().toISOString()
  })
}

module.exports = { askMentor }
