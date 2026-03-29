import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createExerciseType,
  createWorkoutRecord,
  deleteWorkoutRecord,
  ExerciseType,
  getExerciseTypes,
  getWorkoutRecords,
  updateWorkoutRecord,
  WorkoutRecordResponse,
} from '../services/api';

function getTodayDateKey() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function toDateKey(dateTime: string) {
  const date = new Date(dateTime);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function WorkoutEntryForm() {
  const navigate = useNavigate();
  const { date: paramDate } = useParams<{ date?: string }>();
  const [exerciseTypes, setExerciseTypes] = useState<ExerciseType[]>([]);
  const [allRecords, setAllRecords] = useState<WorkoutRecordResponse[]>([]);
  const [selectedExerciseTypeId, setSelectedExerciseTypeId] = useState<number | ''>('');
  const [selectedDate, setSelectedDate] = useState(paramDate || getTodayDateKey());
  const [weightKg, setWeightKg] = useState('');
  const [reps, setReps] = useState('');
  const [newExerciseName, setNewExerciseName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [creatingExercise, setCreatingExercise] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editingRecordId, setEditingRecordId] = useState<number | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [exerciseResponse, recordsResponse] = await Promise.all([
        getExerciseTypes(),
        getWorkoutRecords(),
      ]);

      setExerciseTypes(exerciseResponse.data);
      setAllRecords(recordsResponse.data);

      if (exerciseResponse.data.length > 0) {
        setSelectedExerciseTypeId(exerciseResponse.data[0].id);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '운동 데이터 조회에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const selectedExercise = useMemo(
    () => exerciseTypes.find((exercise) => exercise.id === selectedExerciseTypeId),
    [exerciseTypes, selectedExerciseTypeId]
  );

  const selectedExerciseSets = useMemo(() => {
    if (!selectedExerciseTypeId) {
      return [] as WorkoutRecordResponse[];
    }

    return allRecords
      .filter((record) => {
        return (
          record.exerciseTypeId === Number(selectedExerciseTypeId) &&
          toDateKey(record.performedAt) === selectedDate
        );
      })
      .sort((a, b) => a.setCount - b.setCount);
  }, [allRecords, selectedExerciseTypeId, selectedDate]);

  const groupedSetsByDate = useMemo(() => {
    const grouped = new Map<string, WorkoutRecordResponse[]>();

    allRecords
      .filter((record) => toDateKey(record.performedAt) === selectedDate)
      .slice()
      .sort((a, b) => a.setCount - b.setCount)
      .forEach((record) => {
        const current = grouped.get(record.exerciseName) || [];
        current.push(record);
        grouped.set(record.exerciseName, current);
      });

    return Array.from(grouped.entries());
  }, [allRecords, selectedDate]);

  const nextSetCount = selectedExerciseSets.length + 1;

  const editingRecord = useMemo(() => {
    if (editingRecordId == null) {
      return null;
    }
    return selectedExerciseSets.find((record) => record.id === editingRecordId) || null;
  }, [editingRecordId, selectedExerciseSets]);

  useEffect(() => {
    setEditingRecordId(null);
  }, [selectedExerciseTypeId, selectedDate]);

  useEffect(() => {
    // 수정 모드면 선택한 세트 값 사용, 아니면 마지막 세트값 자동 채움
    if (editingRecord) {
      setWeightKg(String(editingRecord.weightKg));
      setReps(String(editingRecord.reps));
      return;
    }

    const lastSet = selectedExerciseSets[selectedExerciseSets.length - 1];
    if (lastSet) {
      setWeightKg(String(lastSet.weightKg));
      setReps(String(lastSet.reps));
      return;
    }

    setWeightKg('');
    setReps('');
  }, [selectedExerciseSets, editingRecord]);

  const handleCreateExerciseType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExerciseName.trim()) {
      return;
    }

    try {
      setCreatingExercise(true);
      setError('');
      const response = await createExerciseType(newExerciseName.trim());
      const created = response.data;
      setExerciseTypes((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
      setSelectedExerciseTypeId(created.id);
      setNewExerciseName('');
      setSuccessMessage('내 운동 종류가 추가되었습니다.');
    } catch (err: any) {
      setError(err.response?.data?.message || '운동 종류 추가에 실패했습니다.');
    } finally {
      setCreatingExercise(false);
    }
  };

  const handleSelectSetForEdit = (recordId: number) => {
    setEditingRecordId(recordId);
    setError('');
    setSuccessMessage('');
  };

  const handleMoveSet = async (index: number, direction: 'up' | 'down') => {
    const sets = selectedExerciseSets;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sets.length) return;

    const setA = sets[index];
    const setB = sets[targetIndex];

    try {
      setSaving(true);
      setError('');
      const [responseA, responseB] = await Promise.all([
        updateWorkoutRecord(setA.id, {
          exerciseTypeId: setA.exerciseTypeId,
          weightKg: setA.weightKg,
          reps: setA.reps,
          setCount: setB.setCount,
          performedAt: setA.performedAt,
        }),
        updateWorkoutRecord(setB.id, {
          exerciseTypeId: setB.exerciseTypeId,
          weightKg: setB.weightKg,
          reps: setB.reps,
          setCount: setA.setCount,
          performedAt: setB.performedAt,
        }),
      ]);
      setAllRecords((prev) =>
        prev.map((r) => {
          if (r.id === responseA.data.id) return responseA.data;
          if (r.id === responseB.data.id) return responseB.data;
          return r;
        })
      );
    } catch (err: any) {
      setError(err.response?.data?.message || '세트 순서 변경에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSet = async (recordId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('이 세트를 삭제하시겠습니까?')) return;
    try {
      setError('');
      setSuccessMessage('');
      await deleteWorkoutRecord(recordId);
      setAllRecords((prev) => prev.filter((r) => r.id !== recordId));
      if (editingRecordId === recordId) setEditingRecordId(null);
      setSuccessMessage('세트가 삭제되었습니다.');
    } catch (err: any) {
      setError(err.response?.data?.message || '세트 삭제에 실패했습니다.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedExerciseTypeId) {
      setError('운동 종류를 선택해주세요.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccessMessage('');

      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      const performedAt = `${selectedDate}T${hh}:${mm}:${ss}`;

      const payload = {
        exerciseTypeId: Number(selectedExerciseTypeId),
        weightKg: Number(weightKg),
        reps: Number(reps),
        setCount: editingRecord?.setCount ?? nextSetCount,
        performedAt: editingRecord?.performedAt ?? performedAt,
      };

      if (editingRecord) {
        const response = await updateWorkoutRecord(editingRecord.id, payload);
        setAllRecords((prev) => prev.map((record) => (record.id === response.data.id ? response.data : record)));
        setSuccessMessage(`${selectedExercise?.name || '선택 운동'} ${editingRecord.setCount}세트를 수정했습니다.`);
        setEditingRecordId(null);
      } else {
        const response = await createWorkoutRecord(payload);
        setAllRecords((prev) => [...prev, response.data]);
        setSuccessMessage(`${selectedExercise?.name || '선택 운동'} ${nextSetCount}세트가 등록되었습니다.`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '운동 기록 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <p className="text-white text-lg">운동 입력 화면 준비 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">운동 기록</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition"
          >
            대시보드로
          </button>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800">운동 종류 선택</h2>

          <form onSubmit={handleCreateExerciseType} className="mt-4 flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newExerciseName}
              onChange={(e) => setNewExerciseName(e.target.value)}
              placeholder="내 운동 종류 추가 (예: 케이블 크로스오버)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={creatingExercise}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition disabled:bg-gray-400"
            >
              {creatingExercise ? '추가 중...' : '운동 종류 추가'}
            </button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">운동 종류</label>
              <select
                value={selectedExerciseTypeId}
                onChange={(e) => setSelectedExerciseTypeId(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                {exerciseTypes.map((exercise) => (
                  <option key={exercise.id} value={exercise.id}>
                    {exercise.name} {exercise.isDefault ? '(기본)' : '(내 운동)'}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">기록 날짜</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800">기존 세트 목록</h2>
          <p className="text-sm text-gray-500 mt-1">
            세트를 클릭하면 수정할 수 있고, ▲▼ 버튼으로 순서를 변경할 수 있습니다.
          </p>

          {selectedExerciseSets.length === 0 ? (
            <p className="text-gray-600 mt-4">선택한 날짜에 등록된 세트가 없습니다.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {selectedExerciseSets.map((record, index) => {
                const isEditing = editingRecordId === record.id;
                return (
                  <li
                    key={record.id}
                    onClick={() => handleSelectSetForEdit(record.id)}
                    className={`border rounded-lg p-3 cursor-pointer transition ${
                      isEditing
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1 mr-2">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleMoveSet(index, 'up'); }}
                          disabled={index === 0 || saving}
                          className="text-gray-400 hover:text-gray-700 disabled:opacity-30 leading-none text-xs px-1"
                          title="위로 이동"
                        >▲</button>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleMoveSet(index, 'down'); }}
                          disabled={index === selectedExerciseSets.length - 1 || saving}
                          className="text-gray-400 hover:text-gray-700 disabled:opacity-30 leading-none text-xs px-1"
                          title="아래로 이동"
                        >▼</button>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          {selectedExercise?.name || record.exerciseName} {record.setCount}세트
                        </p>
                        <p className="text-sm text-gray-600">{record.weightKg}kg × {record.reps}회</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(record.performedAt).toLocaleString('ko-KR')}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteSet(record.id, e)}
                        className="ml-3 text-red-400 hover:text-red-600 transition text-sm px-2 py-1 rounded hover:bg-red-50"
                        title="세트 삭제"
                      >
                        삭제
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800">세트 입력</h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-blue-800 text-sm">
              {editingRecord
                ? `현재 ${editingRecord.setCount}세트 수정 중입니다.`
                : `이번 입력은 자동으로 ${nextSetCount}세트로 등록됩니다.`}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">중량 (kg)</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="예: 60"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">횟수 (reps)</label>
              <input
                type="number"
                min="1"
                step="1"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                placeholder="예: 10"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                {saving ? '저장 중...' : editingRecord ? '세트 수정 저장' : '운동 기록 저장'}
              </button>
              {editingRecord && (
                <button
                  type="button"
                  onClick={() => setEditingRecordId(null)}
                  className="flex-1 bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  수정 취소
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800">{selectedDate} 운동 종류별 세트 기록</h2>
          {groupedSetsByDate.length === 0 ? (
            <p className="text-gray-600 mt-3">선택한 날짜에는 기록된 운동이 없습니다.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {groupedSetsByDate.map(([exerciseName, records]) => (
                <div key={exerciseName} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-800">{exerciseName}</h3>
                  <ul className="mt-3 space-y-2">
                    {records.map((record, index) => (
                      <li key={record.id} className="text-sm text-gray-700">
                        {index + 1}세트 - {record.weightKg}kg x {record.reps}회
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

