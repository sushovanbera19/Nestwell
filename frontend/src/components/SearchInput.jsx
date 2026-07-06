import { Search } from 'lucide-react'

export default function SearchInput({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-ink/10 bg-white px-3.5 py-2.5 dark:border-paper/10 dark:bg-ink-soft">
      <Search className="h-4 w-4 text-ink/40 dark:text-paper/40" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent font-sans text-sm text-ink placeholder:text-ink/40 focus:outline-none dark:text-paper dark:placeholder:text-paper/40"
      />
    </div>
  )
}
