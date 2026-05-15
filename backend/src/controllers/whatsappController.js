const { env } = require("../config/env")
const { createMentorReply } = require("../services/mentorService")
const {
  extractIncomingMessages,
  formatMentorWhatsAppReply,
  getPersonalRecipient,
  sendWhatsAppText
} = require("../services/whatsappService")
const { createHttpError } = require("../utils/errors")
const { assertRequiredString } = require("../utils/validation")

function verifyWebhook(request, response) {
  const mode = request.query["hub.mode"]
  const token = request.query["hub.verify_token"]
  const challenge = request.query["hub.challenge"]

  if (mode === "subscribe" && token && token === env.whatsappVerifyToken) {
    response.status(200).send(challenge)
    return
  }

  response.sendStatus(403)
}

async function receiveWebhook(request, response) {
  const messages = extractIncomingMessages(request.body)

  for (const message of messages) {
    const reply = await createMentorReply(message.text, {
      channel: "whatsapp",
      from: message.from
    })

    await sendWhatsAppText(message.from, formatMentorWhatsAppReply(reply))
  }

  response.sendStatus(200)
}

async function sendPersonalMentorMessage(request, response) {
  const recipient = getPersonalRecipient()

  if (!recipient) {
    throw createHttpError(400, "WHATSAPP_PERSONAL_RECIPIENT is not configured.")
  }

  const question = assertRequiredString(request.body.question, "Question", { maxLength: 500 })
  const reply = await createMentorReply(question, {
    channel: "whatsapp",
    from: recipient
  })
  const result = await sendWhatsAppText(recipient, formatMentorWhatsAppReply(reply))

  response.json({
    status: "sent",
    provider: reply.provider,
    recipient,
    result
  })
}

module.exports = {
  receiveWebhook,
  sendPersonalMentorMessage,
  verifyWebhook
}
