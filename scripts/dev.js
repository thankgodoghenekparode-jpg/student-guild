const { spawn } = require("node:child_process")
const fs = require("node:fs")
const path = require("node:path")

const rootDir = path.resolve(__dirname, "..")
const frontendDir = path.join(rootDir, "frontend")
const viteCliPath = path.join(frontendDir, "node_modules", "vite", "bin", "vite.js")
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

process.on("SIGINT", () => {
  stopChildren()
})

process.on("SIGTERM", () => {
  stopChildren()
})

if (!fs.existsSync(viteCliPath)) {
  process.stderr.write("[frontend] Missing Vite CLI. Run `npm run setup` from the repo root first.\n")
  process.exit(1)
}

runProcess("backend", process.execPath, [path.join(rootDir, "backend", "server.js")])
runProcess("frontend", process.execPath, [viteCliPath, "--host", "127.0.0.1"], {
  cwd: frontendDir
})
