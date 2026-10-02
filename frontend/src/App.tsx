import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import DashboardPage from './pages/DashboardPage';
import CalendarPage from './pages/CalendarPage';
import CalendarDayPage from './pages/CalendarDayPage';
import BodyPage from './pages/body/BodyPage';
import BodyWeightFormPage from './pages/body/BodyWeightFormPage';
import BodyCompositionFormPage from './pages/body/BodyCompositionFormPage';
import StatisticsPage from './pages/statistics/StatisticsPage';
import ProfilePage from './pages/ProfilePage';
import WorkoutNewPage from './pages/workout/WorkoutNewPage';
import WorkoutSessionPage from './pages/workout/WorkoutSessionPage';
import WorkoutCompletePage from './pages/workout/WorkoutCompletePage';
import ExerciseSelectPage from './pages/workout/ExerciseSelectPage';
import ExerciseCreatePage from './pages/workout/ExerciseCreatePage';
import HistoryPage from './pages/HistoryPage';
import HistoryDetailPage from './pages/HistoryDetailPage';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected */}
        <Route element={<RequireAuth><AppLayout /></RequireAuth>}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/calendar/:date" element={<CalendarDayPage />} />
          <Route path="/body" element={<BodyPage />} />
          <Route path="/body/weight/new" element={<BodyWeightFormPage />} />
          <Route path="/body/composition/new" element={<BodyCompositionFormPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/workout/new" element={<WorkoutNewPage />} />
          <Route path="/workout/:sessionId" element={<WorkoutSessionPage />} />
          <Route path="/workout/:sessionId/complete" element={<WorkoutCompletePage />} />
          <Route path="/exercises/select" element={<ExerciseSelectPage />} />
          <Route path="/exercises/new" element={<ExerciseCreatePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/history/:sessionId" element={<HistoryDetailPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
