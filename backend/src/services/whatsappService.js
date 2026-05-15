const { env } = require("../config/env")
const { createHttpError } = require("../utils/errors")

const MAX_WHATSAPP_TEXT_LENGTH = 4096

function isWhatsAppConfigured() {
  return Boolean(env.whatsappAccessToken && env.whatsappPhoneNumberId)
}

function normalizeWhatsAppNumber(value) {
  const digits = String(value || "").replace(/\D/g, "")

  if (!digits) {
    return ""
  }

  if (digits.startsWith("0")) {
    return `234${digits.slice(1)}`
  }

  return digits
}

function getPersonalRecipient() {
  return normalizeWhatsAppNumber(env.whatsappPersonalRecipient)
}

function assertWhatsAppConfigured() {
  if (!isWhatsAppConfigured()) {
    throw createHttpError(503, "WhatsApp is not configured.")
  }
}

async function sendWhatsAppText(to, message) {
  assertWhatsAppConfigured()

  const recipient = normalizeWhatsAppNumber(to)

  if (!recipient) {
    throw createHttpError(400, "A valid WhatsApp recipient number is required.")
  }

  const text = String(message || "").trim().slice(0, MAX_WHATSAPP_TEXT_LENGTH)

  if (!text) {
    throw createHttpError(400, "WhatsApp message cannot be empty.")
  }

  const response = await fetch(
    `https://graph.facebook.com/${env.whatsappGraphApiVersion}/${env.whatsappPhoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.whatsappAccessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: recipient,
        type: "text",
        text: {
          preview_url: false,
          body: text
        }
      })
    }
  )

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw createHttpError(response.status, "Unable to send WhatsApp message.", data)
  }

  return data
}

function extractIncomingMessages(payload) {
  const entries = Array.isArray(payload?.entry) ? payload.entry : []
  const messages = []

  for (const entry of entries) {
    const changes = Array.isArray(entry?.changes) ? entry.changes : []

    for (const change of changes) {
      const value = change?.value || {}
      const incomingMessages = Array.isArray(value.messages) ? value.messages : []

      for (const message of incomingMessages) {
        if (message.type !== "text" || !message.text?.body || !message.from) {
          continue
        }

        messages.push({
          id: message.id,
          from: message.from,
          text: message.text.body
        })
      }
    }
  }

  return messages
}

function formatMentorWhatsAppReply(reply) {
  const followUps = Array.isArray(reply.followUps) && reply.followUps.length
    ? `\n\nYou can also ask:\n${reply.followUps.map((item) => `- ${item}`).join("\n")}`
    : ""

  return `${reply.message}${followUps}`
}

module.exports = {
  extractIncomingMessages,
  formatMentorWhatsAppReply,
  getPersonalRecipient,
  isWhatsAppConfigured,
  normalizeWhatsAppNumber,
  sendWhatsAppText
}
