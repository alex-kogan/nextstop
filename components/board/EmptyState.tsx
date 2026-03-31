import Link from "next/link";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center space-y-6">
      <div className="w-16 h-16 border-2 border-border flex items-center justify-center">
        <span className="font-display text-2xl text-muted">⊕</span>
      </div>
      <div className="space-y-2">
        <h2 className="font-display text-xl font-medium">No stops saved yet.</h2>
        <p className="text-muted text-sm font-light max-w-xs">
          Add your favorite Swiss transit stops to see live departures here.
        </p>
      </div>
      <Link
        href="/board/stops"
        className="px-6 py-3 bg-ink text-chalk font-display text-sm tracking-wide hover:bg-rail transition-colors"
      >
        Add your first stop →
      </Link>
    </div>
  );
}
