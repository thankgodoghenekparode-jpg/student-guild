import { useState } from "react"

function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  )
}

export default function PracticeImportPanel({
  form,
  onChange,
  onSubmit,
  onLoadSample,
  onFileSelect,
  importing,
  fileLoading,
  result
}) {
  const [isDragging, setIsDragging] = useState(false)

  function handleDrop(event) {
    event.preventDefault()
    setIsDragging(false)
    onFileSelect?.(event.dataTransfer.files?.[0] || null)
  }

  return (
    <form className="admin-card form-card" onSubmit={onSubmit}>
      <div className="form-header">
        <div>
          <div className="eyebrow">Bulk import</div>
          <h2>Upload or paste JSON and CSV questions</h2>
        </div>
        <div className="button-row">
          <label className="ghost-button upload-trigger">
            {fileLoading ? "Loading file..." : "Choose file"}
            <input
              type="file"
              accept=".json,.csv,application/json,text/csv"
              onChange={(event) => {
                onFileSelect?.(event.target.files?.[0] || null)
                event.target.value = ""
              }}
              disabled={fileLoading || importing}
            />
          </label>
          <button type="button" className="ghost-button" onClick={() => onLoadSample(form.format)}>
            Load {form.format.toUpperCase()} sample
          </button>
        </div>
      </div>

      <div className="grid two-col">
        <Field label="Import format">
          <select value={form.format} onChange={(event) => onChange("format", event.target.value)}>
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
          </select>
        </Field>

        <div className="import-hint">
          <strong>Expected fields</strong>
          <span>
            `examType`, `subject`, `topic`, `year`, `prompt`, four options, `correctOption`, and `explanation`
          </span>
        </div>
      </div>

      {form.fileName ? (
        <div className="helper-copy compact-copy">Loaded file: {form.fileName}</div>
      ) : (
        <div className="helper-copy compact-copy">
          Choose a local `.json` or `.csv` file to auto-fill the import area, or paste content manually below.
        </div>
      )}

      <div
        className={`drop-zone ${isDragging ? "active" : ""}`}
        onDragEnter={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragOver={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={(event) => {
          event.preventDefault()

          if (event.currentTarget.contains(event.relatedTarget)) {
            return
          }

          setIsDragging(false)
        }}
        onDrop={handleDrop}
      >
        <strong>{fileLoading ? "Reading file..." : "Drag and drop a JSON or CSV file here"}</strong>
        <span>Or use the file picker above if you prefer. The import area updates automatically.</span>
      </div>

      <Field label="Import content">
        <textarea
          rows="12"
          value={form.content}
          onChange={(event) => onChange("content", event.target.value)}
          placeholder={form.format === "json" ? "Paste question JSON here..." : "Paste CSV rows here..."}
          required
        />
      </Field>

      <button type="submit" className="primary-button" disabled={importing}>
        {importing ? "Importing..." : "Import questions"}
      </button>

      {result ? (
        <div className="status-panel">
          <div className="status-grid">
            <div className="status-pill">Created: {result.createdCount}</div>
            <div className="status-pill">Skipped: {result.skippedCount}</div>
            <div className="status-pill">Errors: {result.errorCount}</div>
          </div>

          {result.errors?.length > 0 ? (
            <div className="mono-block">
              {result.errors.map((item) => (
                <div key={`${item.row}-${item.message}`}>Row {item.row}: {item.message}</div>
              ))}
            </div>
          ) : null}

          {result.skippedItems?.length > 0 ? (
            <div className="mono-block">
              {result.skippedItems.map((item, index) => (
                <div key={`${item.prompt}-${index}`}>{item.reason}: {item.prompt}</div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </form>
  )
}
