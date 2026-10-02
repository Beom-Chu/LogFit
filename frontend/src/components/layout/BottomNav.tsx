import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: '홈', icon: '🏠' },
  { to: '/calendar', label: '캘린더', icon: '📅' },
  { to: '/body', label: '신체', icon: '⚖️' },
  { to: '/statistics', label: '통계', icon: '📊' },
  { to: '/profile', label: '프로필', icon: '👤' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 safe-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-colors text-xs
              ${isActive ? 'text-blue-600 font-medium' : 'text-gray-400'}`
            }
          >
            <span className="text-xl">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
