const multer = require("multer")
const { createHttpError } = require("../utils/errors")

function imageFileFilter(request, file, callback) {
  if (!file.mimetype.startsWith("image/")) {
    callback(createHttpError(400, "Only image uploads are allowed."))
    return
  }

  callback(null, true)
}

const uploadArticleImage = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 3 * 1024 * 1024
  }
}).single("image")

module.exports = { uploadArticleImage }
