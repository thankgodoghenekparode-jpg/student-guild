const express = require("express")
const { authRouter } = require("./authRoutes")
const { courseRouter } = require("./courseRoutes")
const { recommendationRouter } = require("./recommendationRoutes")
const { articleRouter } = require("./articleRoutes")
const { mentorRouter } = require("./mentorRoutes")
const { adminRouter } = require("./adminRoutes")
const { practiceRouter } = require("./practiceRoutes")
const { whatsappRouter } = require("./whatsappRoutes")

const apiRouter = express.Router()

apiRouter.use("/auth", authRouter)
apiRouter.use("/courses", courseRouter)
apiRouter.use("/recommendations", recommendationRouter)
apiRouter.use("/articles", articleRouter)
apiRouter.use("/mentor", mentorRouter)
apiRouter.use("/practice", practiceRouter)
apiRouter.use("/admin", adminRouter)
apiRouter.use("/whatsapp", whatsappRouter)

module.exports = { apiRouter }
