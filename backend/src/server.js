const { createApp } = require("./app")
const { env } = require("./config/env")
const { ensureDatabaseSeeded } = require("./database/fileStore")

async function startServer() {
  await ensureDatabaseSeeded()

  const app = createApp()

  app.listen(env.port, () => {
    console.log(`[backend] API listening on http://127.0.0.1:${env.port}`)
  })
}

module.exports = { startServer }
