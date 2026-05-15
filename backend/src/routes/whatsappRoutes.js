const express = require("express")
const {
  receiveWebhook,
  sendPersonalMentorMessage,
  verifyWebhook
} = require("../controllers/whatsappController")
const { asyncHandler } = require("../utils/asyncHandler")

const whatsappRouter = express.Router()

whatsappRouter.get("/webhook", verifyWebhook)
whatsappRouter.post("/webhook", asyncHandler(receiveWebhook))
whatsappRouter.post("/personal-message", asyncHandler(sendPersonalMentorMessage))

module.exports = { whatsappRouter }
