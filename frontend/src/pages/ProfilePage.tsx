import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import type { UserProfile } from '../types';
import { useAuthStore } from '../store/authStore';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function ProfilePage() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const res = await authApi.getProfile();
      setProfile(res.data.data);
      setNickname(res.data.data.nickname);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!nickname.trim()) return;
    setSaving(true);
    try {
      const res = await authApi.updateProfile({ nickname });
      setProfile(res.data.data);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return <LoadingSpinner className="h-64" />;

  return (
    <div className="px-4 py-6 space-y-4">
      <h1 className="text-xl font-bold text-gray-900">프로필</h1>

      <Card>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
            👤
          </div>
          <div>
            <p className="font-bold text-gray-900">{profile?.nickname}</p>
            <p className="text-sm text-gray-400">{profile?.email}</p>
          </div>
        </div>

        {editing ? (
          <div className="space-y-3">
            <Input label="닉네임" value={nickname} onChange={(e) => setNickname(e.target.value)} />
            <div className="flex gap-2">
              <Button variant="secondary" fullWidth onClick={() => setEditing(false)}>취소</Button>
              <Button fullWidth onClick={handleSave} loading={saving}>저장</Button>
            </div>
          </div>
        ) : (
          <Button variant="secondary" fullWidth onClick={() => setEditing(true)}>프로필 수정</Button>
        )}
      </Card>

      <Card>
        <p className="text-xs text-gray-400 mb-1">가입일</p>
        <p className="text-sm text-gray-700">{profile?.createdAt?.slice(0, 10)}</p>
      </Card>

      <Button variant="danger" fullWidth onClick={handleLogout}>로그아웃</Button>
    </div>
  );
}
