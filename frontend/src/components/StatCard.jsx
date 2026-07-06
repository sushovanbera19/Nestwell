import { motion } from 'framer-motion'
import { useCountUp } from '../hooks/useCountUp'

export default function StatCard({ icon: Icon, label, value, prefix = '', suffix = '', accent = 'teal', delay = 0 }) {
  const { ref, value: animated } = useCountUp(value)

  const accentStyles = {
    teal: 'bg-teal-mist text-teal-deep',
    rose: 'bg-rose-soft text-rose',
    amber: 'bg-amber-soft text-amber',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-2xl border border-ink/10 bg-white p-5 shadow-card dark:border-paper/10 dark:bg-ink-soft"
    >
      <div className="flex items-center justify-between">
        <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${accentStyles[accent]}`}>
          <Icon className="h-4.5 w-4.5" strokeWidth={2} />
        </span>
      </div>
      <div ref={ref} className="mt-4 font-display text-2xl font-medium text-ink dark:text-paper">
        {prefix}
        {animated.toLocaleString('en-IN')}
        {suffix}
      </div>
      <div className="mt-1 font-sans text-xs text-ink/50 dark:text-paper/50">{label}</div>
    </motion.div>
  )
}
