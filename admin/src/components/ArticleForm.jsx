import { articleCategories } from "./articleCategories"

function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  )
}

export default function ArticleForm({
  form,
  onChange,
  onSubmit,
  onCancel,
  onImageUpload,
  editing,
  submitting,
  uploadInProgress
}) {
  return (
    <form className="admin-card form-card" onSubmit={onSubmit}>
      <div className="form-header">
        <div>
          <div className="eyebrow">Survival Guide</div>
          <h2>{editing ? "Update article" : "Add new article"}</h2>
        </div>
        {editing ? (
          <button type="button" className="ghost-button" onClick={onCancel}>
            Cancel edit
          </button>
        ) : null}
      </div>

      <div className="grid two-col">
        <Field label="Article title">
          <input value={form.title} onChange={(event) => onChange("title", event.target.value)} required />
        </Field>

        <Field label="Category">
          <select value={form.category} onChange={(event) => onChange("category", event.target.value)}>
            {articleCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Summary">
        <textarea
          rows="3"
          value={form.summary}
          onChange={(event) => onChange("summary", event.target.value)}
          required
        />
      </Field>

      <Field label="Content points (one line per point)">
        <textarea
          rows="6"
          value={form.content}
          onChange={(event) => onChange("content", event.target.value)}
          required
        />
      </Field>

      <div className="grid two-col">
        <Field label="Read time in minutes">
          <input
            type="number"
            min="1"
            max="30"
            value={form.readTimeMinutes}
            onChange={(event) => onChange("readTimeMinutes", event.target.value)}
            required
          />
        </Field>

        <Field label="Image URL">
          <input value={form.imageUrl} onChange={(event) => onChange("imageUrl", event.target.value)} />
        </Field>
      </div>

      <div className="upload-row">
        <label className="upload-button">
          <input
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0]

              if (file) {
                onImageUpload(file)
              }
            }}
          />
          {uploadInProgress ? "Uploading image..." : "Upload article image"}
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(event) => onChange("featured", event.target.checked)}
          />
          <span>Mark as featured</span>
        </label>
      </div>

      <button type="submit" className="primary-button" disabled={submitting}>
        {submitting ? "Saving..." : editing ? "Update article" : "Create article"}
      </button>
    </form>
  )
}
