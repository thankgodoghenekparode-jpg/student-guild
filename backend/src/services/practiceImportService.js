const { createHttpError } = require("../utils/errors")
const { sanitizeText } = require("../utils/sanitize")

const requiredCsvHeaders = [
  "examtype",
  "subject",
  "topic",
  "year",
  "prompt",
  "optiona",
  "optionb",
  "optionc",
  "optiond",
  "correctoption",
  "explanation"
]

function parsePracticeImport({ format, content }) {
  const normalizedFormat = sanitizeText(format, { maxLength: 10, allowNewLines: false }).toLowerCase()
  const rawContent = String(content || "")

  if (!rawContent.trim()) {
    throw createHttpError(400, "Import content is required.")
  }

  if (normalizedFormat === "json") {
    return parseJsonImport(rawContent)
  }

  if (normalizedFormat === "csv") {
    return parseCsvImport(rawContent)
  }

  throw createHttpError(400, "Import format must be json or csv.")
}

function parseJsonImport(content) {
  let parsed

  try {
    parsed = JSON.parse(content)
  } catch {
    throw createHttpError(400, "JSON import content could not be parsed.")
  }

  const rows = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.questions) ? parsed.questions : null

  if (!rows) {
    throw createHttpError(400, "JSON import must be an array of questions or an object with a questions array.")
  }

  return rows.map((item) => mapImportRecord(item))
}

function parseCsvImport(content) {
  const table = parseCsvTable(content).filter((row) => row.some((cell) => String(cell || "").trim()))

  if (table.length < 2) {
    throw createHttpError(400, "CSV import must include a header row and at least one data row.")
  }

  const normalizedHeaders = table[0].map((header) =>
    sanitizeText(header, { maxLength: 80, allowNewLines: false }).toLowerCase()
  )
  const missingHeaders = requiredCsvHeaders.filter((header) => !normalizedHeaders.includes(header))

  if (missingHeaders.length > 0) {
    throw createHttpError(400, `CSV import is missing required headers: ${missingHeaders.join(", ")}.`)
  }

  return table.slice(1).map((row) => {
    const record = {}

    normalizedHeaders.forEach((header, index) => {
      record[header] = row[index] || ""
    })

    return mapImportRecord({
      examType: record.examtype,
      subject: record.subject,
      topic: record.topic,
      year: record.year,
      prompt: record.prompt,
      optionA: record.optiona,
      optionB: record.optionb,
      optionC: record.optionc,
      optionD: record.optiond,
      correctOption: record.correctoption,
      explanation: record.explanation
    })
  })
}

function mapImportRecord(record = {}) {
  const optionArray = Array.isArray(record.options) && record.options.length === 4
    ? record.options
    : [record.optionA, record.optionB, record.optionC, record.optionD]

  return {
    examType: record.examType,
    subject: record.subject,
    topic: record.topic,
    year: record.year,
    prompt: record.prompt,
    options: optionArray,
    correctOption: record.correctOption,
    explanation: record.explanation
  }
}

function parseCsvTable(content) {
  const rows = []
  let currentRow = []
  let currentValue = ""
  let inQuotes = false

  for (let index = 0; index < content.length; index += 1) {
    const character = content[index]
    const nextCharacter = content[index + 1]

    if (character === "\"") {
      if (inQuotes && nextCharacter === "\"") {
        currentValue += "\""
        index += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (!inQuotes && character === ",") {
      currentRow.push(currentValue)
      currentValue = ""
      continue
    }

    if (!inQuotes && (character === "\n" || character === "\r")) {
      if (character === "\r" && nextCharacter === "\n") {
        index += 1
      }

      currentRow.push(currentValue)
      rows.push(currentRow)
      currentRow = []
      currentValue = ""
      continue
    }

    currentValue += character
  }

  if (currentValue.length > 0 || currentRow.length > 0) {
    currentRow.push(currentValue)
    rows.push(currentRow)
  }

  return rows.map((row) => row.map((cell) => String(cell || "").trim()))
}

module.exports = {
  parsePracticeImport
}
