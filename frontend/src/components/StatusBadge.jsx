const styles = {
  // rooms
  Occupied: 'bg-ink-soft/10 text-ink-soft dark:bg-paper/10 dark:text-paper',
  Vacant: 'bg-teal-mist text-teal-deep',
  Maintenance: 'bg-amber-soft text-amber',
  // rent
  Paid: 'bg-teal-mist text-teal-deep',
  Due: 'bg-amber-soft text-amber',
  Pending: 'bg-amber-soft text-amber',
  Overdue: 'bg-rose-soft text-rose',
  // complaints
  Open: 'bg-rose-soft text-rose',
  'In Progress': 'bg-amber-soft text-amber',
  Resolved: 'bg-teal-mist text-teal-deep',
}

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 font-sans text-xs font-medium ${
        styles[status] || 'bg-ink/10 text-ink/60 dark:bg-paper/10 dark:text-paper/60'
      }`}
    >
      {status}
    </span>
  )
}
