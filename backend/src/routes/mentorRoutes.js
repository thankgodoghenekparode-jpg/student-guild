const express = require("express")
const { askMentor } = require("../controllers/mentorController")
const { asyncHandler } = require("../utils/asyncHandler")

const mentorRouter = express.Router()

mentorRouter.post("/query", asyncHandler(askMentor))

module.exports = { mentorRouter }
