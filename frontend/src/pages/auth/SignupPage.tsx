import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { authApi } from '../../api/auth';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

type FieldKey = 'email' | 'nickname' | 'password' | 'confirmPassword';
type FieldErrors = Partial<Record<FieldKey, string>>;

// 백엔드 필드명 → 프론트 필드 키
const BACKEND_FIELD_MAP: Record<string, FieldKey> = {
  email: 'email',
  password: 'password',
  nickname: 'nickname',
};

// 백엔드 Spring 기본 메시지 → 한국어 안내
const toKoreanFieldError = (fieldName: string, rawMsg: string): string => {
  if (fieldName === 'email') return '올바른 이메일 형식으로 입력해주세요. (예: user@example.com)';
  if (fieldName === 'password') {
    if (rawMsg.includes('크기') || rawMsg.includes('size')) return '비밀번호는 8자 이상 입력해주세요.';
    return '비밀번호를 확인해주세요.';
  }
  if (fieldName === 'nickname') {
    if (rawMsg.includes('크기') || rawMsg.includes('size')) return '닉네임은 최대 50자까지 입력할 수 있습니다.';
    return '닉네임을 입력해주세요.';
  }
  return rawMsg;
};

const parseBackend400 = (message: string): FieldErrors => {
  const colonIdx = message.indexOf(': ');
  if (colonIdx === -1) return {};
  const fieldName = message.slice(0, colonIdx);
  const rawMsg = message.slice(colonIdx + 2);
  const fieldKey = BACKEND_FIELD_MAP[fieldName];
  if (!fieldKey) return {};
  return { [fieldKey]: toKoreanFieldError(fieldName, rawMsg) };
};

const validate = (form: Record<FieldKey, string>): FieldErrors => {
  const errors: FieldErrors = {};
  if (!form.email) {
    errors.email = '이메일을 입력해주세요.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = '올바른 이메일 형식으로 입력해주세요. (예: user@example.com)';
  }
  if (!form.nickname) {
    errors.nickname = '닉네임을 입력해주세요.';
  } else if (form.nickname.length > 50) {
    errors.nickname = '닉네임은 최대 50자까지 입력할 수 있습니다.';
  }
  if (!form.password) {
    errors.password = '비밀번호를 입력해주세요.';
  } else if (form.password.length < 8) {
    errors.password = '비밀번호는 8자 이상 입력해주세요.';
  }
  if (!form.confirmPassword) {
    errors.confirmPassword = '비밀번호 확인을 입력해주세요.';
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = '비밀번호가 일치하지 않습니다.';
  }
  return errors;
};

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<Record<FieldKey, string>>({
    email: '', nickname: '', password: '', confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field: FieldKey) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    // 타이핑하면 해당 필드 에러 즉시 제거
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    setServerError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    // 1단계: 클라이언트 검증
    const errors = validate(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    // 2단계: API 호출
    setLoading(true);
    try {
      await authApi.signup({ email: form.email, nickname: form.nickname, password: form.password });
      navigate('/login');
    } catch (err) {
      if (isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 409) {
          setFieldErrors({ email: '이미 사용 중인 이메일입니다.' });
        } else if (status === 400) {
          const msg: string = err.response?.data?.message ?? '';
          const parsed = parseBackend400(msg);
          if (Object.keys(parsed).length > 0) {
            setFieldErrors(parsed);
          } else {
            setServerError('입력값을 다시 확인해주세요.');
          }
        } else if (!err.response) {
          setServerError('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
        } else {
          setServerError('회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.');
        }
      } else {
        setServerError('알 수 없는 오류가 발생했습니다.');
      }
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <Input
              label="이메일"
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              placeholder="user@example.com"
            />
            {fieldErrors.email && (
              <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>
            )}
          </div>
          <div>
            <Input
              label="닉네임"
              value={form.nickname}
              onChange={handleChange('nickname')}
              placeholder="닉네임 (최대 50자)"
            />
            {fieldErrors.nickname && (
              <p className="text-xs text-red-500 mt-1">{fieldErrors.nickname}</p>
            )}
          </div>
          <div>
            <Input
              label="비밀번호"
              type="password"
              value={form.password}
              onChange={handleChange('password')}
              placeholder="8자 이상 입력해주세요"
            />
            {fieldErrors.password && (
              <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>
            )}
          </div>
          <div>
            <Input
              label="비밀번호 확인"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange('confirmPassword')}
              placeholder="비밀번호를 다시 입력해주세요"
            />
            {fieldErrors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">{fieldErrors.confirmPassword}</p>
            )}
          </div>
          {serverError && (
            <p className="text-sm text-red-500 text-center">{serverError}</p>
          )}
          <Button type="submit" fullWidth size="lg" loading={loading} className="mt-2">
            가입
          </Button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="text-blue-600 font-medium">로그인</Link>
        </p>
      </div>
    </div>
  );
}
