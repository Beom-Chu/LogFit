import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#F5F7F8] max-w-lg mx-auto relative">
      <main className="pb-20">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
