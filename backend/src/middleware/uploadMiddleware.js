const multer = require("multer")
const path = require("node:path")
const { env } = require("../config/env")
const { createId } = require("../database/fileStore")
const { createHttpError } = require("../utils/errors")

const storage = multer.diskStorage({
  destination: path.join(env.uploadsDir, "images"),
  filename(request, file, callback) {
    const extension = path.extname(file.originalname || "").toLowerCase() || ".jpg"
    callback(null, `${createId("image")}${extension}`)
  }
})

function imageFileFilter(request, file, callback) {
  if (!file.mimetype.startsWith("image/")) {
    callback(createHttpError(400, "Only image uploads are allowed."))
    return
  }

  callback(null, true)
}

const uploadArticleImage = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 3 * 1024 * 1024
  }
}).single("image")

module.exports = { uploadArticleImage }
