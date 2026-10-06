import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { exerciseApi } from '../../api/exercises';
import type { Exercise, MuscleGroup } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import PageHeader from '../../components/common/PageHeader';

const MUSCLE_GROUPS: { label: string; value: MuscleGroup | 'ALL' }[] = [
  { label: '전체',    value: 'ALL'      },
  { label: '가슴',    value: 'CHEST'    },
  { label: '등',      value: 'BACK'     },
  { label: '어깨',    value: 'SHOULDER' },
  { label: '하체',    value: 'LEG'      },
  { label: '이두',    value: 'BICEPS'   },
  { label: '삼두',    value: 'TRICEPS'  },
  { label: '전완',    value: 'FOREARM'  },
  { label: '엉덩이',  value: 'GLUTE'    },
  { label: '복근',    value: 'ABS'      },
  { label: '유산소',  value: 'CARDIO'   },
];

const MUSCLE_LABELS: Record<string, string> = {
  CHEST: '가슴', BACK: '등', SHOULDER: '어깨',
  BICEPS: '이두', TRICEPS: '삼두', FOREARM: '전완',
  LEG: '하체', GLUTE: '엉덩이', ABS: '복근', CARDIO: '유산소',
  ARM: '팔', ETC: '기타',
};

/** Exercise thumbnail with lazy loading and muscleGroup placeholder fallback */
function ExerciseThumb({ imageUrl, name }: { imageUrl?: string | null; name: string; muscleGroup: string }) {
  const [failed, setFailed] = useState(false);
  if (!imageUrl || failed) {
    return (
      <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-700">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M5.121 17.804A8.966 8.966 0 0112 15c2.21 0 4.235.8 5.879 2.118M12 12a4 4 0 100-8 4 4 0 000 8z" />
        </svg>
      </div>
    );
  }
  return (
    <img
      src={imageUrl}
      alt={name}
      loading="lazy"
      onError={() => setFailed(true)}
      className="w-14 h-14 rounded-xl object-contain bg-[#eff4fa] shrink-0"
    />
  );
}

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
    <div className="flex flex-col h-screen bg-[#F5F7F8]">
      <div className="bg-white border-b border-gray-100">
        <PageHeader title="운동 선택" />
        <div className="px-4 pb-4">
          <input
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none transition-colors
              focus:border-emerald-600 focus:ring-2 focus:ring-emerald-50"
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
                  ${muscle === g.value ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <LoadingSpinner className="h-48" />
        ) : exercises.length === 0 ? (
          <EmptyState
            message="검색 결과가 없습니다."
            description="다른 키워드로 검색하거나 새 운동을 만들어보세요."
            actionLabel="새 운동 만들기"
            onAction={() => navigate('/exercises/new')}
          />
        ) : (
          <div className="bg-white divide-y divide-gray-50">
            {exercises.map((ex) => (
              <button
                key={ex.exerciseId}
                onClick={() => handleSelect(ex.exerciseId)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
              >
                <ExerciseThumb imageUrl={ex.imageUrl} name={ex.name} muscleGroup={ex.muscleGroup} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{ex.name}</p>
                  <p className="text-xs text-secondary mt-0.5">
                    {MUSCLE_LABELS[ex.muscleGroup] || ex.muscleGroup}
                  </p>
                </div>
                {ex.isFavorite && <span className="text-yellow-400 text-base shrink-0">★</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 py-3 bg-white border-t border-gray-100">
        <Button variant="ghost" fullWidth onClick={() => navigate('/exercises/new')}>
          + 새 운동 만들기
        </Button>
      </div>
    </div>
  );
}
