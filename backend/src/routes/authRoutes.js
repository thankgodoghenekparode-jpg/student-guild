const express = require("express")
const { login, me, register, forgotPassword, resetPassword } = require("../controllers/authController")
const { requireAuth } = require("../middleware/authMiddleware")
const { asyncHandler } = require("../utils/asyncHandler")

const authRouter = express.Router()

authRouter.post("/register", asyncHandler(register))
authRouter.post("/login", asyncHandler(login))
authRouter.post("/forgot-password", asyncHandler(forgotPassword))
authRouter.post("/reset-password", asyncHandler(resetPassword))
authRouter.get("/me", asyncHandler(requireAuth), asyncHandler(me))

module.exports = { authRouter }
