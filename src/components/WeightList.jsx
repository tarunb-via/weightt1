import { format } from 'date-fns';
import { AlertCircle, NotebookPen, Scale } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WeightList({ entries, loading, error, onRetry }) {
  return (
    <section className="rounded-[28px] bg-white p-6 shadow-lg shadow-brand-100/60">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">History</p>
          <h2 className="text-2xl font-bold tracking-tight text-slateblue">Your recent weigh-ins</h2>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-3xl bg-brand-50" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-3xl bg-rose-50 p-5 text-rose-700">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5" />
            <div>
              <p className="text-base font-semibold">{error}</p>
              <button type="button" onClick={onRetry} className="mt-3 min-h-[44px] rounded-full bg-rose-600 px-4 py-2 text-base font-medium text-white">
                Try again
              </button>
            </div>
          </div>
        </div>
      ) : entries.length === 0 ? (
        <div className="rounded-3xl bg-brand-50 p-8 text-center">
          <NotebookPen className="mx-auto h-10 w-10 text-brand-600" />
          <h3 className="mt-4 text-xl font-semibold text-slateblue">No entries yet</h3>
          <p className="mt-2 text-base text-slate-500">Start by logging your first weight entry to build your daily trend.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry, index) => (
            <motion.article
              key={entry.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-3xl bg-gradient-to-r from-white to-brand-50 p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">{format(new Date(entry.date), 'EEEE, MMM d')}</p>
                  <div className="mt-2 flex items-center gap-2 text-2xl font-bold text-slateblue">
                    <Scale className="h-6 w-6 text-brand-600" />
                    {entry.weight} lb
                  </div>
                </div>
                <p className="max-w-md text-base leading-relaxed text-slate-500">{entry.note || 'No note added for this day.'}</p>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </section>
  );
}
