const examDefaults = {
  JAMB: "Use of English",
  WAEC: "English Language"
}

function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  )
}

export default function PracticeQuestionForm({
  form,
  onChange,
  onSubmit,
  onCancel,
  editing,
  submitting
}) {
  return (
    <form className="admin-card form-card" onSubmit={onSubmit}>
      <div className="form-header">
        <div>
          <div className="eyebrow">Practice Bank</div>
          <h2>{editing ? "Update practice question" : "Add practice question"}</h2>
        </div>
        {editing ? (
          <button type="button" className="ghost-button" onClick={onCancel}>
            Cancel edit
          </button>
        ) : null}
      </div>

      <div className="grid two-col">
        <Field label="Exam type">
          <select
            value={form.examType}
            onChange={(event) => {
              const nextExamType = event.target.value
              onChange("examType", nextExamType)

              if (!editing && !form.subject) {
                onChange("subject", examDefaults[nextExamType] || "")
              }
            }}
          >
            {Object.keys(examDefaults).map((examType) => (
              <option key={examType} value={examType}>
                {examType}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Exam year">
          <input
            type="number"
            min="2000"
            max="2035"
            value={form.year}
            onChange={(event) => onChange("year", event.target.value)}
            required
          />
        </Field>
      </div>

      <div className="grid two-col">
        <Field label="Subject">
          <input value={form.subject} onChange={(event) => onChange("subject", event.target.value)} required />
        </Field>

        <Field label="Topic">
          <input value={form.topic} onChange={(event) => onChange("topic", event.target.value)} required />
        </Field>
      </div>

      <Field label="Question prompt">
        <textarea
          rows="4"
          value={form.prompt}
          onChange={(event) => onChange("prompt", event.target.value)}
          required
        />
      </Field>

      <div className="grid two-col">
        <Field label="Option A">
          <input value={form.optionA} onChange={(event) => onChange("optionA", event.target.value)} required />
        </Field>

        <Field label="Option B">
          <input value={form.optionB} onChange={(event) => onChange("optionB", event.target.value)} required />
        </Field>
      </div>

      <div className="grid two-col">
        <Field label="Option C">
          <input value={form.optionC} onChange={(event) => onChange("optionC", event.target.value)} required />
        </Field>

        <Field label="Option D">
          <input value={form.optionD} onChange={(event) => onChange("optionD", event.target.value)} required />
        </Field>
      </div>

      <div className="grid two-col">
        <Field label="Correct option">
          <select value={form.correctOption} onChange={(event) => onChange("correctOption", event.target.value)}>
            <option value="0">Option A</option>
            <option value="1">Option B</option>
            <option value="2">Option C</option>
            <option value="3">Option D</option>
          </select>
        </Field>

        <Field label="Explanation">
          <textarea
            rows="3"
            value={form.explanation}
            onChange={(event) => onChange("explanation", event.target.value)}
            required
          />
        </Field>
      </div>

      <button type="submit" className="primary-button" disabled={submitting}>
        {submitting ? "Saving..." : editing ? "Update question" : "Create question"}
      </button>
    </form>
  )
}
