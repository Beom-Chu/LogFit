import { useEffect, useState } from 'react';
import { statisticsApi } from '../../api/statistics';
import type { MuscleDistribution, OneRmData, PrData, VolumePoint, WorkoutSummary } from '../../types';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const MUSCLE_LABEL: Record<string, string> = {
  CHEST: '가슴', BACK: '등', SHOULDER: '어깨', LEG: '하체', ARM: '팔', ABS: '복근', CARDIO: '유산소', ETC: '기타',
};
const COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#6b7280'];

type Tab = 'summary' | 'pr' | 'volume' | 'muscle';

export default function StatisticsPage() {
  const [tab, setTab] = useState<Tab>('summary');
  const [summary, setSummary] = useState<WorkoutSummary | null>(null);
  const [prs, setPrs] = useState<PrData[]>([]);
  const [oneRms, setOneRms] = useState<OneRmData[]>([]);
  const [volume, setVolume] = useState<VolumePoint[]>([]);
  const [muscles, setMuscles] = useState<MuscleDistribution | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const [s, p, o, v, m] = await Promise.all([
        statisticsApi.getWorkoutSummary(),
        statisticsApi.getPRs(),
        statisticsApi.get1RMs(),
        statisticsApi.getVolume(),
        statisticsApi.getMuscleDistribution(),
      ]);
      setSummary(s.data.data);
      setPrs(p.data.data);
      setOneRms(o.data.data);
      setVolume(v.data.data);
      setMuscles(m.data.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'summary', label: '요약' },
    { id: 'pr', label: 'PR' },
    { id: 'volume', label: '볼륨' },
    { id: 'muscle', label: '부위' },
  ];

  return (
    <div className="px-4 py-6">
      <h1 className="text-xl font-bold text-gray-900 mb-4">통계</h1>

      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors
              ${tab === t.id ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner className="h-48" />
      ) : error ? (
        <ErrorState onRetry={load} />
      ) : (
        <>
          {tab === 'summary' && summary && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Card className="text-center">
                  <p className="text-xs text-gray-400">총 운동 횟수</p>
                  <p className="text-2xl font-bold text-blue-600">{summary.totalWorkouts}</p>
                </Card>
                <Card className="text-center">
                  <p className="text-xs text-gray-400">총 세트 수</p>
                  <p className="text-2xl font-bold text-blue-600">{summary.totalSets}</p>
                </Card>
                <Card className="text-center">
                  <p className="text-xs text-gray-400">연속 운동</p>
                  <p className="text-2xl font-bold text-green-600">{summary.currentStreak}일</p>
                </Card>
                <Card className="text-center">
                  <p className="text-xs text-gray-400">최장 연속</p>
                  <p className="text-2xl font-bold text-orange-600">{summary.longestStreak}일</p>
                </Card>
              </div>
              {summary.avgDurationMinutes && (
                <Card className="text-center">
                  <p className="text-xs text-gray-400">평균 운동 시간</p>
                  <p className="text-2xl font-bold text-gray-900">{summary.avgDurationMinutes}분</p>
                </Card>
              )}
            </div>
          )}

          {tab === 'pr' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500">운동별 최고 기록</p>
              {prs.length === 0 ? (
                <p className="text-center text-gray-400 py-8">기록이 없습니다.</p>
              ) : (
                prs.map((pr) => (
                  <Card key={pr.exerciseId}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{pr.exerciseName}</p>
                        <p className="text-xs text-gray-400">{pr.achievedDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">{pr.maxWeight}kg</p>
                        <p className="text-xs text-gray-400">{pr.repsAtMaxWeight}회</p>
                      </div>
                    </div>
                  </Card>
                ))
              )}
              <p className="text-sm text-gray-500 mt-4">예상 1RM</p>
              {oneRms.map((orm) => (
                <Card key={orm.exerciseId}>
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{orm.exerciseName}</p>
                    <p className="font-bold text-purple-600">{orm.estimated1RM}kg</p>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {tab === 'volume' && (
            <div className="space-y-4">
              <Card>
                <p className="text-sm font-medium text-gray-700 mb-3">볼륨 추이 (최근 30일)</p>
                {volume.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">기록이 없습니다.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={volume}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 9 }} tickFormatter={(v) => v.slice(5)} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(v) => [`${v}kg`, '볼륨']} />
                      <Bar dataKey="totalVolume" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Card>
            </div>
          )}

          {tab === 'muscle' && muscles && (
            <div className="space-y-4">
              {muscles.distribution.length === 0 ? (
                <p className="text-center text-gray-400 py-8">기록이 없습니다.</p>
              ) : (
                <>
                  <Card>
                    <p className="text-sm font-medium text-gray-700 mb-3">부위별 분포</p>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={muscles.distribution.map((d) => ({ ...d, name: MUSCLE_LABEL[d.muscleGroup] || d.muscleGroup }))}
                          dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={(entry) => `${entry.name} ${Math.round((entry.percent || 0) * 100)}%`}>
                          {muscles.distribution.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>
                  <div className="space-y-2">
                    {muscles.distribution.map((d, i) => (
                      <div key={d.muscleGroup} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-sm text-gray-700 flex-1">{MUSCLE_LABEL[d.muscleGroup] || d.muscleGroup}</span>
                        <span className="text-sm font-medium text-gray-900">{d.percentage}%</span>
                        <span className="text-xs text-gray-400">({d.count})</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
