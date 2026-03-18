import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Activity, Scale, Target, TrendingDown, TrendingUp, CalendarDays, RefreshCcw } from 'lucide-react';
import clsx from 'clsx';
import SummaryCard from './components/SummaryCard';
import WeightForm from './components/WeightForm';
import WeightList from './components/WeightList';

const emptyForm = {
  date: format(new Date(), 'yyyy-MM-dd'),
  weight: '',
  note: '',
};

export default function App() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadEntries = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await axios.get('/api/weights');
      setEntries(data);
    } catch {
      setError('Could not load your weight history right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const stats = useMemo(() => {
    if (!entries.length) {
      return { latest: null, change: null, average: null, streak: 0 };
    }

    const latest = entries[0];
    const oldest = entries[entries.length - 1];
    const average = entries.reduce((sum, entry) => sum + Number(entry.weight), 0) / entries.length;
    const change = Number(latest.weight) - Number(oldest.weight);

    let streak = 1;
    for (let i = 1; i < entries.length; i += 1) {
      const prev = new Date(entries[i - 1].date);
      const current = new Date(entries[i].date);
      const diff = Math.round((prev - current) / (1000 * 60 * 60 * 24));
      if (diff === 1) streak += 1;
      else break;
    }

    return { latest, change, average, streak };
  }, [entries]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError('');
      await axios.post('/api/weights', {
        date: form.date,
        weight: Number(form.weight),
        note: form.note,
      });
      setForm(emptyForm);
      await loadEntries();
    } catch {
      setError('Saving failed. Check your entry and try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen px-4 py-6 text-slateblue sm:px-5">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="overflow-hidden rounded-[28px] bg-gradient-to-br from-brand-600 via-brand-500 to-accent-500 p-6 text-white shadow-xl shadow-brand-500/20"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-2 text-sm font-medium backdrop-blur">
                <Activity className="h-4 w-4" />
                Daily weight journal
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">Track your weight, spot trends, stay consistent.</h1>
              <p className="text-base leading-relaxed text-white/85 md:text-lg">
                Log your weight every day, add quick notes, and keep a simple view of your progress over time.
              </p>
            </div>
            <button
              type="button"
              onClick={loadEntries}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 self-start rounded-full bg-white px-5 py-3 text-base font-semibold text-brand-700 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <RefreshCcw className="h-5 w-5" />
              Refresh
            </button>
          </div>
        </motion.section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard icon={Scale} label="Latest" value={stats.latest ? `${stats.latest.weight} lb` : '--'} detail={stats.latest ? format(new Date(stats.latest.date), 'MMM d, yyyy') : 'No entries yet'} />
          <SummaryCard icon={stats.change !== null && stats.change <= 0 ? TrendingDown : TrendingUp} label="Overall change" value={stats.change !== null ? `${stats.change > 0 ? '+' : ''}${stats.change.toFixed(1)} lb` : '--'} detail="From first to latest entry" accent={stats.change !== null && stats.change <= 0 ? 'success' : 'warning'} />
          <SummaryCard icon={Target} label="Average" value={stats.average ? `${stats.average.toFixed(1)} lb` : '--'} detail="Across all logged days" />
          <SummaryCard icon={CalendarDays} label="Current streak" value={`${stats.streak} day${stats.streak === 1 ? '' : 's'}`} detail="Consecutive daily logs" />
        </section>

        <section className="grid gap-6 lg:grid-cols-[380px,1fr]">
          <WeightForm form={form} setForm={setForm} onSubmit={handleSubmit} saving={saving} />
          <WeightList entries={entries} loading={loading} error={error} onRetry={loadEntries} />
        </section>
      </div>
    </main>
  );
}
