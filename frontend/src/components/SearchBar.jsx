import { Search } from "lucide-react"

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search courses, careers, tips...",
  suggestions = [],
  listId = "search-suggestions"
}) {
  const hasSuggestions = suggestions.length > 0

  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        list={hasSuggestions ? listId : undefined}
        className="w-full rounded-[24px] border border-white/60 bg-white/75 py-3.5 pl-11 pr-4 text-sm text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] outline-none transition placeholder:text-slate-400 focus:border-primary/40 focus:bg-white focus:ring-4 focus:ring-primary/15 dark:border-slate-700/80 dark:bg-slate-950/70 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-950"
      />
      {hasSuggestions && (
        <datalist id={listId}>
          {suggestions.map((suggestion) => (
            <option key={suggestion} value={suggestion} />
          ))}
        </datalist>
      )}
    </div>
  )
}
