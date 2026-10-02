import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', nickname: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    setLoading(true);
    try {
      await authApi.signup({ email: form.email, nickname: form.nickname, password: form.password });
      navigate('/login');
    } catch {
      setError('회원가입에 실패했습니다. 이미 사용 중인 이메일일 수 있습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-blue-600">LogFit</h1>
          <p className="text-gray-500 text-sm mt-2">회원가입</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="이메일" type="email" value={form.email} onChange={handleChange('email')} placeholder="email@example.com" required />
          <Input label="닉네임" value={form.nickname} onChange={handleChange('nickname')} placeholder="닉네임" required />
          <Input label="비밀번호" type="password" value={form.password} onChange={handleChange('password')} placeholder="••••••••" required />
          <Input label="비밀번호 확인" type="password" value={form.confirmPassword} onChange={handleChange('confirmPassword')} placeholder="••••••••" required />
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <Button type="submit" fullWidth size="lg" loading={loading}>가입</Button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="text-blue-600 font-medium">로그인</Link>
        </p>
      </div>
    </div>
  );
}
