const institutionTypes = ["University", "Polytechnic"]

function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  )
}

export default function CourseForm({
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
          <div className="eyebrow">Courses</div>
          <h2>{editing ? "Update course" : "Add new course"}</h2>
        </div>
        {editing ? (
          <button type="button" className="ghost-button" onClick={onCancel}>
            Cancel edit
          </button>
        ) : null}
      </div>

      <div className="grid two-col">
        <Field label="Course title">
          <input value={form.title} onChange={(event) => onChange("title", event.target.value)} required />
        </Field>

        <Field label="Institution type">
          <select
            value={form.institutionType}
            onChange={(event) => onChange("institutionType", event.target.value)}
          >
            {institutionTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid two-col">
        <Field label="Category">
          <input value={form.category} onChange={(event) => onChange("category", event.target.value)} required />
        </Field>

        <Field label="Cut-off mark">
          <input
            type="number"
            min="120"
            max="320"
            value={form.cutoffMark}
            onChange={(event) => onChange("cutoffMark", event.target.value)}
            required
          />
        </Field>
      </div>

      <Field label="Short summary">
        <textarea
          rows="3"
          value={form.summary}
          onChange={(event) => onChange("summary", event.target.value)}
          required
        />
      </Field>

      <Field label="Overview">
        <textarea
          rows="4"
          value={form.overview}
          onChange={(event) => onChange("overview", event.target.value)}
          required
        />
      </Field>

      <div className="grid two-col">
        <Field label="Required subjects (comma separated)">
          <textarea
            rows="3"
            value={form.requiredSubjects}
            onChange={(event) => onChange("requiredSubjects", event.target.value)}
            required
          />
        </Field>

        <Field label="JAMB combination (comma separated)">
          <textarea
            rows="3"
            value={form.jambCombination}
            onChange={(event) => onChange("jambCombination", event.target.value)}
            required
          />
        </Field>
      </div>

      <div className="grid two-col">
        <Field label="Possible careers (comma separated)">
          <textarea rows="3" value={form.careers} onChange={(event) => onChange("careers", event.target.value)} required />
        </Field>

        <Field label="Recommended side skills (comma separated)">
          <textarea rows="3" value={form.sideSkills} onChange={(event) => onChange("sideSkills", event.target.value)} required />
        </Field>
      </div>

      <Field label="Tags (comma separated)">
        <input value={form.tags} onChange={(event) => onChange("tags", event.target.value)} required />
      </Field>

      <div className="grid two-col">
        <Field label="Strength signals">
          <input value={form.strengths} onChange={(event) => onChange("strengths", event.target.value)} required />
        </Field>

        <Field label="Interest signals">
          <input value={form.interests} onChange={(event) => onChange("interests", event.target.value)} required />
        </Field>
      </div>

      <div className="grid two-col">
        <Field label="Work style signals">
          <input value={form.workStyles} onChange={(event) => onChange("workStyles", event.target.value)} required />
        </Field>

        <Field label="Goal signals">
          <input value={form.goals} onChange={(event) => onChange("goals", event.target.value)} required />
        </Field>
      </div>

      <Field label="Study preference signals">
        <input
          value={form.studyPreferences}
          onChange={(event) => onChange("studyPreferences", event.target.value)}
          required
        />
      </Field>

      <button type="submit" className="primary-button" disabled={submitting}>
        {submitting ? "Saving..." : editing ? "Update course" : "Create course"}
      </button>
    </form>
  )
}
