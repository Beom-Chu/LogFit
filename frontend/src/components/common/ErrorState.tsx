import Button from './Button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message = '데이터를 불러올 수 없습니다.', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center px-6">
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-red-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <div>
        <p className="text-gray-700 font-medium">{message}</p>
        <p className="text-gray-400 text-sm mt-1">네트워크 연결을 확인해주세요.</p>
      </div>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} size="md">
          다시 시도
        </Button>
      )}
    </div>
  );
}
