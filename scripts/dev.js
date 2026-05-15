const { spawn } = require("node:child_process")
const fs = require("node:fs")
const http = require("node:http")
const path = require("node:path")

const rootDir = path.resolve(__dirname, "..")
const frontendDir = path.join(rootDir, "frontend")
const adminDir = path.join(rootDir, "admin")
const viteCliPath = path.join(frontendDir, "node_modules", "vite", "bin", "vite.js")
const adminViteCliPath = path.join(adminDir, "node_modules", "vite", "bin", "vite.js")
const children = []
let shuttingDown = false

function forwardOutput(stream, writer, label) {
  let buffered = ""

  stream.on("data", (chunk) => {
    buffered += chunk.toString()
    const lines = buffered.split(/\r?\n/)
    buffered = lines.pop()

    for (const line of lines) {
      writer(`[${label}] ${line}\n`)
    }
  })

  stream.on("end", () => {
    if (buffered) {
      writer(`[${label}] ${buffered}\n`)
    }
  })
}

function stopChildren() {
  shuttingDown = true

  for (const child of children) {
    if (!child.killed) {
      child.kill("SIGINT")
    }
  }
}

function runProcess(label, command, args, options = {}) {
  const child = spawn(command, args, {
    cwd: options.cwd || rootDir,
    env: process.env,
    stdio: ["inherit", "pipe", "pipe"]
  })

  children.push(child)
  forwardOutput(child.stdout, process.stdout.write.bind(process.stdout), label)
  forwardOutput(child.stderr, process.stderr.write.bind(process.stderr), label)

  child.on("exit", (code, signal) => {
    if (shuttingDown) {
      return
    }

    const reason = signal ? `signal ${signal}` : `code ${code ?? 0}`
    process.stderr.write(`[${label}] exited with ${reason}\n`)
    stopChildren()
    process.exitCode = code ?? 0
  })

  return child
}

function isServiceAvailable(url) {
  return new Promise((resolve) => {
    const request = http.get(url, (response) => {
      response.resume()
      resolve(response.statusCode >= 200 && response.statusCode < 500)
    })

    request.setTimeout(1000, () => {
      request.destroy()
      resolve(false)
    })

    request.on("error", () => {
      resolve(false)
    })
  })
}

process.on("SIGINT", () => {
  stopChildren()
})

process.on("SIGTERM", () => {
  stopChildren()
})

async function main() {
  if (!fs.existsSync(viteCliPath)) {
    process.stderr.write("[frontend] Missing Vite CLI. Run `npm run setup` from the repo root first.\n")
    process.exit(1)
  }

  if (!fs.existsSync(adminViteCliPath)) {
    process.stderr.write("[admin] Missing Vite CLI. Run `npm run setup` from the repo root first.\n")
    process.exit(1)
  }

  if (await isServiceAvailable("http://127.0.0.1:5000/api/health")) {
    process.stdout.write("[backend] Reusing existing API at http://127.0.0.1:5000\n")
  } else {
    runProcess("backend", process.execPath, [path.join(rootDir, "backend", "server.js")])
  }

  if (await isServiceAvailable("http://127.0.0.1:5173")) {
    process.stdout.write("[frontend] Reusing existing app at http://127.0.0.1:5173\n")
  } else {
    runProcess("frontend", process.execPath, [viteCliPath, "--host", "127.0.0.1", "--strictPort"], {
      cwd: frontendDir
    })
  }

  if (await isServiceAvailable("http://127.0.0.1:5174")) {
    process.stdout.write("[admin] Reusing existing app at http://127.0.0.1:5174\n")
  } else {
    runProcess("admin", process.execPath, [adminViteCliPath, "--host", "127.0.0.1", "--port", "5174", "--strictPort"], {
      cwd: adminDir
    })
  }
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error.message || error}\n`)
  stopChildren()
  process.exit(1)
})
