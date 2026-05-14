const fsp = require("node:fs/promises")
const path = require("node:path")
const { put } = require("@vercel/blob")
const { createClient } = require("@supabase/supabase-js")
const { env } = require("../config/env")
const { createId } = require("../database/fileStore")
const { createHttpError } = require("../utils/errors")

async function saveUploadedImage(file) {
  if (!file) {
    throw createHttpError(400, "An image file is required.")
  }

  if (env.uploadBackend === "supabase") {
    return saveImageToSupabase(file)
  }

  if (env.uploadBackend === "blob") {
    return saveImageToBlob(file)
  }

  if (env.isVercel) {
    throw createHttpError(500, "Configure BLOB_READ_WRITE_TOKEN before uploading images on Vercel.")
  }

  return saveImageToLocalDisk(file)
}

async function saveImageToSupabase(file) {
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey || !env.supabaseStorageBucket) {
    throw createHttpError(500, "Supabase storage is not configured correctly.")
  }

  const extension = path.extname(file.originalname || "").toLowerCase() || ".jpg"
  const fileName = `${createId("image")}${extension}`
  const filePath = `images/${fileName}`
  const supabase = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  const { error: uploadError } = await supabase.storage
    .from(env.supabaseStorageBucket)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      cacheControl: "public, max-age=31536000, immutable",
      upsert: false
    })

  if (uploadError) {
    throw createHttpError(500, `Supabase storage upload failed: ${uploadError.message}`)
  }

  const { data } = supabase.storage.from(env.supabaseStorageBucket).getPublicUrl(filePath)

  if (!data?.publicUrl) {
    throw createHttpError(500, "Unable to resolve Supabase public URL.")
  }

  return data.publicUrl
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
