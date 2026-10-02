import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bodyApi } from '../../api/body';
import type { BodyWeightChartPoint } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Tab = 'weight' | 'composition';

export default function BodyPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('weight');
  const [latestWeight, setLatestWeight] = useState<number | null>(null);
  const [chartData, setChartData] = useState<BodyWeightChartPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [wRes, cRes] = await Promise.allSettled([
        bodyApi.getLatestWeight(),
        bodyApi.getWeightChart(),
      ]);
      if (wRes.status === 'fulfilled') setLatestWeight(wRes.value.data.data.weight);
      if (cRes.status === 'fulfilled') setChartData(cRes.value.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingSpinner className="h-64" />;

  return (
    <div className="px-4 py-6 space-y-4">
      <h1 className="text-xl font-bold text-gray-900">신체 관리</h1>

      <div className="flex bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setTab('weight')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors
            ${tab === 'weight' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
        >
          체중
        </button>
        <button
          onClick={() => setTab('composition')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors
            ${tab === 'composition' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
        >
          체성분
        </button>
      </div>

      {tab === 'weight' ? (
        <>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">현재 체중</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {latestWeight != null ? `${latestWeight}kg` : '기록 없음'}
                </p>
              </div>
              <Button onClick={() => navigate('/body/weight/new')}>입력</Button>
            </div>
          </Card>

          {chartData.length > 0 && (
            <Card>
              <p className="text-sm font-medium text-gray-700 mb-3">체중 변화</p>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
                  <YAxis tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
                  <Tooltip formatter={(v) => [`${v}kg`, '체중']} labelFormatter={(l) => l} />
                  <Line type="monotone" dataKey="weight" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          )}

          <Button variant="ghost" fullWidth onClick={() => navigate('/body/weight/history')}>
            기록 전체 보기
          </Button>
        </>
      ) : (
        <>
          <Card>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700">체성분 관리</p>
              <Button onClick={() => navigate('/body/composition/new')}>입력</Button>
            </div>
          </Card>
          <Button variant="ghost" fullWidth onClick={() => navigate('/body/composition/history')}>
            기록 전체 보기
          </Button>
        </>
      )}
    </div>
  );
}
