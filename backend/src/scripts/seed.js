const { ensureDatabaseSeeded } = require("../database/fileStore")

ensureDatabaseSeeded()
  .then(() => {
    console.log("[backend] seed data is ready.")
  })
  .catch((error) => {
    console.error("[backend] failed to seed data", error)
    process.exitCode = 1
  })
