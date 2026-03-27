import clsx from 'clsx';

const accentStyles = {
  default: 'from-white to-brand-50 text-slateblue',
  success: 'from-emerald-50 to-white text-emerald-700',
  warning: 'from-amber-50 to-white text-amber-700',
};

export default function SummaryCard({ icon: Icon, label, value, detail, accent = 'default' }) {
  return (
    <div className={clsx('rounded-[24px] bg-gradient-to-br p-5 shadow-sm', accentStyles[accent])}>
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
        <Icon className="h-6 w-6" />
      </div>
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight">{value}</h2>
      <p className="mt-2 text-base text-slate-500">{detail}</p>
    </div>
  );
}
