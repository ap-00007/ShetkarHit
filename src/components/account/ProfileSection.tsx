import type { ReactNode } from 'react';

interface Props {
  title: string;
  rows: { label: string; value: string }[];
}

export function ProfileSection({ title, rows }: Props) {
  return (
    <div className="card p-4">
      <h3 className="font-semibold text-ink mb-3">{title}</h3>
      <div className="space-y-2.5">
        {rows.map((r, i) => (
          <div key={i} className="flex items-center justify-between gap-3">
            <span className="text-sm text-muted">{r.label}</span>
            <span className="text-sm font-medium text-ink text-right">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProfileSectionWithChildren({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="card p-4">
      <h3 className="font-semibold text-ink mb-3">{title}</h3>
      {children}
    </div>
  );
}
