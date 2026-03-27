import { PlusCircle } from 'lucide-react';

export default function WeightForm({ form, setForm, onSubmit, saving }) {
  return (
    <form onSubmit={onSubmit} className="rounded-[28px] bg-white p-6 shadow-lg shadow-brand-100/60">
      <div className="mb-6 space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">New entry</p>
        <h2 className="text-2xl font-bold tracking-tight text-slateblue">Log today&apos;s weight</h2>
        <p className="text-base leading-relaxed text-slate-500">Keep it simple: date, weight, and an optional note about how you felt.</p>
      </div>

      <div className="space-y-5">
        <label className="block space-y-2">
          <span className="text-base font-medium text-slateblue">Date</span>
          <input
            type="date"
            value={form.date}
            onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
            className="min-h-[48px] w-full rounded-2xl border border-brand-100 bg-brand-50/50 px-4 text-base outline-none transition focus:border-brand-500 focus:bg-white"
            required
          />
        </label>

        <label className="block space-y-2">
          <span className="text-base font-medium text-slateblue">Weight (lb)</span>
          <input
            type="number"
            step="0.1"
            min="1"
            placeholder="180.4"
            value={form.weight}
            onChange={(event) => setForm((current) => ({ ...current, weight: event.target.value }))}
            className="min-h-[48px] w-full rounded-2xl border border-brand-100 bg-brand-50/50 px-4 text-base outline-none transition focus:border-brand-500 focus:bg-white"
            required
          />
        </label>

        <label className="block space-y-2">
          <span className="text-base font-medium text-slateblue">Note</span>
          <textarea
            rows="4"
            placeholder="Morning weigh-in after workout"
            value={form.note}
            onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))}
            className="w-full rounded-2xl border border-brand-100 bg-brand-50/50 px-4 py-3 text-base outline-none transition focus:border-brand-500 focus:bg-white"
          />
        </label>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-slateblue px-6 py-3 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <PlusCircle className="h-5 w-5" />
          {saving ? 'Saving...' : 'Save entry'}
        </button>
      </div>
    </form>
  );
}
