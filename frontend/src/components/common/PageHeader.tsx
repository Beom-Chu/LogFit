import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onBack?: (() => void) | false; // false = no back button
}

export default function PageHeader({ title, subtitle, right, onBack }: PageHeaderProps) {
  const navigate = useNavigate();
  const handleBack = onBack === false ? undefined : (onBack ?? (() => navigate(-1)));

  return (
    <div className="flex items-center gap-3 px-4 py-4">
      {handleBack && (
        <button
          onClick={handleBack}
          className="flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-gray-100 shadow-sm text-gray-600 hover:bg-gray-50 shrink-0"
          aria-label="뒤로가기"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
          </svg>
        </button>
      )}
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-bold text-gray-900 leading-tight truncate">{title}</h1>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}
