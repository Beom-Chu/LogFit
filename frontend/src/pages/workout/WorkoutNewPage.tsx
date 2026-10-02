import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { workoutApi } from '../../api/workout';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export default function WorkoutNewPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const defaultDate = params.get('date') || dayjs().format('YYYY-MM-DD');
  const defaultStatus = params.get('status') || 'IN_PROGRESS';

  const [date, setDate] = useState(defaultDate);
  const [status, setStatus] = useState<'IN_PROGRESS' | 'PLANNED'>(defaultStatus as 'IN_PROGRESS' | 'PLANNED');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    setLoading(true);
    try {
      const res = await workoutApi.createSession({ workoutDate: date, status });
      navigate(`/workout/${res.data.data.sessionId}`);
    } catch {
      alert('운동 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100">←</button>
        <h2 className="text-lg font-bold">운동 생성</h2>
      </div>

      <div className="space-y-5">
        <Input
          label="운동 날짜"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">상태</p>
          <div className="flex gap-3">
            <button
              onClick={() => setStatus('IN_PROGRESS')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors
                ${status === 'IN_PROGRESS' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200'}`}
            >
              진행중
            </button>
            <button
              onClick={() => setStatus('PLANNED')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors
                ${status === 'PLANNED' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200'}`}
            >
              계획
            </button>
          </div>
        </div>

        <Button fullWidth size="lg" onClick={handleContinue} loading={loading}>계속</Button>
      </div>
    </div>
  );
}
