type BadgeVariant = 'completed' | 'in_progress' | 'planned' | 'neutral' | 'pr';

const styles: Record<BadgeVariant, string> = {
  completed:   'bg-emerald-50 text-emerald-700',
  in_progress: 'bg-amber-50 text-amber-700',
  planned:     'bg-sky-50 text-sky-700',
  neutral:     'bg-gray-100 text-gray-600',
  pr:          'bg-purple-50 text-purple-700',
};

const labels: Record<BadgeVariant, string> = {
  completed:   '완료',
  in_progress: '진행중',
  planned:     '계획',
  neutral:     '',
  pr:          'PR',
};

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
  className?: string;
}

export default function Badge({ variant, label, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
      ${styles[variant]} ${className}`}>
      {label ?? labels[variant]}
    </span>
  );
}

/** Map WorkoutSessionStatus string to badge variant */
export function statusVariant(status: string): BadgeVariant {
  if (status === 'COMPLETED') return 'completed';
  if (status === 'IN_PROGRESS') return 'in_progress';
  return 'planned';
}
