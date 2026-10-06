import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { bodyApi } from '../../api/body';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import PageHeader from '../../components/common/PageHeader';

export default function BodyCompositionFormPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ weight: '', skeletalMuscleMass: '', bodyFatPercentage: '', measureDate: dayjs().format('YYYY-MM-DD') });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = async () => {
    if (!form.weight || !form.skeletalMuscleMass || !form.bodyFatPercentage) {
      setError('모든 항목을 입력해주세요.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await bodyApi.createComposition({
        weight: Number(form.weight),
        skeletalMuscleMass: Number(form.skeletalMuscleMass),
        bodyFatPercentage: Number(form.bodyFatPercentage),
        measureDate: form.measureDate,
      });
      navigate('/body');
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(msg || '저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7F8] pb-8">
      <PageHeader title="체성분 입력" />

      <div className="px-4 space-y-4">
        <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-lg">
          💡 체성분 저장 시 체중이 자동으로 기록됩니다.
        </p>
        <Input label="체중 (kg)" type="number" value={form.weight} onChange={handleChange('weight')} placeholder="77.3" step="0.1" />
        <Input label="골격근량 (kg)" type="number" value={form.skeletalMuscleMass} onChange={handleChange('skeletalMuscleMass')} placeholder="35.5" step="0.1" />
        <Input label="체지방률 (%)" type="number" value={form.bodyFatPercentage} onChange={handleChange('bodyFatPercentage')} placeholder="18.2" step="0.1" />
        <Input label="측정 날짜" type="date" value={form.measureDate} onChange={handleChange('measureDate')} />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button fullWidth size="lg" onClick={handleSave} loading={loading}>저장</Button>
      </div>
    </div>
  );
}

