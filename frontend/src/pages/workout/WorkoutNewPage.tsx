import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { workoutApi } from '../../api/workout';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import PageHeader from '../../components/common/PageHeader';

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
    <div className="min-h-screen bg-[#F5F7F8]">
      <PageHeader title="운동 생성" />

      <div className="px-4 space-y-5">
        <Input
          label="운동 날짜"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <div>
          <p className="text-sm font-medium text-gray-700 mb-2.5">유형</p>
          <div className="grid grid-cols-2 gap-3">
            {([['IN_PROGRESS', '지금 운동', '바로 운동 시작'], ['PLANNED', '운동 계획', '미래 운동 예약']] as const).map(
              ([val, label, sub]) => (
                <button
                  key={val}
                  onClick={() => setStatus(val)}
                  className={`py-3 px-4 rounded-xl text-sm font-medium border-2 transition-colors text-left
                    ${status === val
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200'
                    }`}
                >
                  <span className="block font-semibold">{label}</span>
                  <span className={`block text-xs mt-0.5 ${status === val ? 'text-emerald-100' : 'text-gray-400'}`}>
                    {sub}
                  </span>
                </button>
              )
            )}
          </div>
        </div>

        <Button fullWidth size="lg" onClick={handleContinue} loading={loading}>
          운동 시작하기
        </Button>
      </div>
    </div>
  );
}
