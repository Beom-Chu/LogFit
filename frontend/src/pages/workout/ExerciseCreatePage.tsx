import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { exerciseApi } from '../../api/exercises';
import type { MuscleGroup, TrackingType } from '../../types';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const MUSCLE_OPTIONS: { label: string; value: MuscleGroup }[] = [
  { label: '가슴', value: 'CHEST' }, { label: '등', value: 'BACK' },
  { label: '어깨', value: 'SHOULDER' }, { label: '하체', value: 'LEG' },
  { label: '팔', value: 'ARM' }, { label: '복근', value: 'ABS' },
  { label: '유산소', value: 'CARDIO' }, { label: '기타', value: 'ETC' },
];

const TRACKING_OPTIONS: { label: string; value: TrackingType }[] = [
  { label: '중량+횟수', value: 'WEIGHT_REPS' },
  { label: '횟수만', value: 'REPS_ONLY' },
  { label: '시간', value: 'DURATION' },
  { label: '거리', value: 'DISTANCE' },
];

export default function ExerciseCreatePage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const sessionId = params.get('sessionId');

  const [name, setName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>('CHEST');
  const [trackingType, setTrackingType] = useState<TrackingType>('WEIGHT_REPS');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!name.trim()) { setError('운동명을 입력해주세요.'); return; }
    setLoading(true);
    try {
      await exerciseApi.create({ name, muscleGroup, trackingType });
      if (sessionId) {
        navigate(`/exercises/select?sessionId=${sessionId}`);
      } else {
        navigate('/exercises');
      }
    } catch {
      setError('운동 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100">←</button>
        <h2 className="text-lg font-bold">커스텀 운동 생성</h2>
      </div>

      <div className="space-y-5">
        <Input label="운동명" value={name} onChange={(e) => setName(e.target.value)} placeholder="원암 케이블 로우" error={error} />

        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">부위</p>
          <div className="grid grid-cols-4 gap-2">
            {MUSCLE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setMuscleGroup(opt.value)}
                className={`py-2 rounded-xl text-xs font-medium border transition-colors
                  ${muscleGroup === opt.value ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white text-gray-600 border-gray-200'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">기록 방식</p>
          <div className="grid grid-cols-2 gap-2">
            {TRACKING_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTrackingType(opt.value)}
                className={`py-2.5 rounded-xl text-xs font-medium border transition-colors
                  ${trackingType === opt.value ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white text-gray-600 border-gray-200'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <Button fullWidth size="lg" onClick={handleSave} loading={loading}>저장</Button>
      </div>
    </div>
  );
}
