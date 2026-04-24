const fsp = require("node:fs/promises")
const path = require("node:path")
const { put } = require("@vercel/blob")
const { env } = require("../config/env")
const { createId } = require("../database/fileStore")
const { createHttpError } = require("../utils/errors")

async function saveUploadedImage(file) {
  if (!file) {
    throw createHttpError(400, "An image file is required.")
  }

  if (env.uploadBackend === "blob") {
    return saveImageToBlob(file)
  }

  if (env.isVercel) {
    throw createHttpError(500, "Configure BLOB_READ_WRITE_TOKEN before uploading images on Vercel.")
  }

  return saveImageToLocalDisk(file)
}

async function saveImageToBlob(file) {
  const extension = path.extname(file.originalname || "").toLowerCase() || ".jpg"
  const pathname = `articles/${createId("image")}${extension}`
  const blob = await put(pathname, file.buffer, {
    access: "public",
    addRandomSuffix: false,
    contentType: file.mimetype
  })

  return blob.url
}

async function saveImageToLocalDisk(file) {
  const extension = path.extname(file.originalname || "").toLowerCase() || ".jpg"
  const fileName = `${createId("image")}${extension}`
  const imagesDir = path.join(env.uploadsDir, "images")

  await fsp.mkdir(imagesDir, { recursive: true })
  await fsp.writeFile(path.join(imagesDir, fileName), file.buffer)

  return `/uploads/images/${fileName}`
}

module.exports = { saveUploadedImage }
