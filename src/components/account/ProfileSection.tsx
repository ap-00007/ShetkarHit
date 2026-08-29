import type { ReactNode } from 'react';
import { Pencil } from 'lucide-react';

interface ProfileRow {
  label: string;
  value: string;
}

interface Props {
  title: string;
  rows: ProfileRow[];
  onEdit?: () => void;
}

export function ProfileSection({ title, rows, onEdit }: Props) {
  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-ochre-50">
        <h3 className="font-semibold text-sm text-ink">{title}</h3>
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex items-center gap-1 text-xs font-medium text-brand-700 hover:text-brand-800 transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
            {/* Edit label hidden on small screens */}
            <span className="hidden sm:inline">Edit</span>
          </button>
        )}
      </div>
      {/* Rows */}
      <div>
        {rows.map((r, i) => (
          <div
            key={i}
            className={`flex items-center justify-between gap-4 px-5 py-3 ${
              i < rows.length - 1 ? 'border-b border-ochre-50' : ''
            }`}
          >
            <span className="text-sm text-muted shrink-0">{r.label}</span>
            <span className="text-sm font-medium text-ink text-right">{r.value || '—'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Section card with arbitrary children (used for crop list, settings, etc.) */
export function ProfileSectionWithChildren({
  title,
  children,
  onEdit,
}: {
  title: string;
  children: ReactNode;
  onEdit?: () => void;
}) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-ochre-50">
        <h3 className="font-semibold text-sm text-ink">{title}</h3>
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex items-center gap-1 text-xs font-medium text-brand-700 hover:text-brand-800 transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Edit</span>
          </button>
        )}
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}
