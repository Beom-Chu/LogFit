import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { bodyApi } from '../../api/body';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export default function BodyWeightFormPage() {
  const navigate = useNavigate();
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!weight) { setError('체중을 입력해주세요.'); return; }
    setLoading(true);
    setError('');
    try {
      await bodyApi.createWeight({ weight: Number(weight), measureDate: date });
      navigate('/body');
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(msg || '저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100">←</button>
        <h2 className="text-lg font-bold">체중 입력</h2>
      </div>

      <div className="space-y-5">
        <Input label="체중 (kg)" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="77.3" step="0.1" error={error} />
        <Input label="측정 날짜" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <Button fullWidth size="lg" onClick={handleSave} loading={loading}>저장</Button>
      </div>
    </div>
  );
}
