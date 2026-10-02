import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { exerciseApi } from '../../api/exercises';
import type { Exercise, MuscleGroup } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';

const MUSCLE_GROUPS: { label: string; value: MuscleGroup | 'ALL' }[] = [
  { label: '전체', value: 'ALL' },
  { label: '가슴', value: 'CHEST' },
  { label: '등', value: 'BACK' },
  { label: '어깨', value: 'SHOULDER' },
  { label: '하체', value: 'LEG' },
  { label: '팔', value: 'ARM' },
  { label: '복근', value: 'ABS' },
  { label: '유산소', value: 'CARDIO' },
];

const MUSCLE_LABELS: Record<string, string> = {
  CHEST: '가슴', BACK: '등', SHOULDER: '어깨', LEG: '하체', ARM: '팔', ABS: '복근', CARDIO: '유산소', ETC: '기타',
};

export default function ExerciseSelectPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const sessionId = params.get('sessionId');

  const [keyword, setKeyword] = useState('');
  const [muscle, setMuscle] = useState<MuscleGroup | 'ALL'>('ALL');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setLoading(true);
    try {
      const res = await exerciseApi.list({
        keyword: keyword || undefined,
        muscleGroup: muscle !== 'ALL' ? muscle : undefined,
        size: 50,
      });
      setExercises(res.data.data.content);
    } catch {
      setExercises([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { search(); }, [muscle]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') search();
  };

  const handleSelect = async (exerciseId: number) => {
    if (!sessionId) return;
    try {
      await exerciseApi.list(); // dummy check
      navigate(`/workout/${sessionId}/add-exercise?exerciseId=${exerciseId}`);
    } catch {
      alert('운동 추가에 실패했습니다.');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100">←</button>
          <h2 className="text-lg font-bold">운동 선택</h2>
        </div>
        <input
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-500"
          placeholder="운동 검색..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {MUSCLE_GROUPS.map((g) => (
            <button
              key={g.value}
              onClick={() => setMuscle(g.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors
                ${muscle === g.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <LoadingSpinner className="h-48" />
        ) : exercises.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <p className="text-gray-500 text-sm">검색 결과가 없습니다.</p>
            <Button onClick={() => navigate('/exercises/new')}>새 운동 만들기</Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {exercises.map((ex) => (
              <button
                key={ex.exerciseId}
                onClick={() => handleSelect(ex.exerciseId)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 text-left"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{ex.name}</p>
                  <p className="text-xs text-gray-400">{MUSCLE_LABELS[ex.muscleGroup] || ex.muscleGroup}</p>
                </div>
                {ex.isFavorite && <span className="text-yellow-400">★</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 py-3 border-t border-gray-100">
        <Button variant="ghost" fullWidth onClick={() => navigate('/exercises/new')}>
          + 새 운동 만들기
        </Button>
      </div>
    </div>
  );
}
