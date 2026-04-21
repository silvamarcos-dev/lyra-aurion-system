export default function StatCard({ title, value, subtitle }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
      <p className="text-sm text-slate-400">{title}</p>
      <h3 className="mt-3 text-3xl font-bold tracking-tight">{value}</h3>
      {subtitle && <p className="mt-2 text-sm text-slate-500">{subtitle}</p>}
    </div>
  );
}