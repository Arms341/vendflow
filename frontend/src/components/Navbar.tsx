// VendFlow — Navbar v3.0.0 (vending walk nav for the Chancey demo).
// Adds the demo walk links: Dashboard → Fleet → Route Optimization → Alerts.
// Keeps universal logo/brand + user/logout. Gig-specific override of the
// universal Navbar for the vending_machine build.
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Map, Navigation, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useBrand } from '@/contexts/BrandContext';

const LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/machine-map', label: 'Fleet', icon: Map },
  { to: '/route-planner', label: 'Routes', icon: Navigation },
  { to: '/alerts', label: 'Alerts', icon: Bell },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { company } = useBrand();
  const navigate = useNavigate();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-[var(--color-brand)] text-white'
        : 'text-gray-600 hover:bg-gray-100'
    }`;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo / Brand */}
          <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
            {company?.logo_url ? (
              <img src={company.logo_url} alt={company.company_name} className="h-8 w-auto" />
            ) : (
              <span className="text-lg font-bold text-[var(--color-brand)]">
                {company?.company_name || 'VendFlow'}
              </span>
            )}
          </Link>

          {/* Walk links */}
          <div className="hidden md:flex items-center gap-1">
            {LINKS.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={navLinkClass}>
                <Icon size={16} /> {label}
              </NavLink>
            ))}
          </div>

          {/* User info + logout */}
          <div className="flex items-center gap-3">
            {user && (
              <span className="hidden sm:block text-sm text-gray-600">
                {user.full_name || user.email}
              </span>
            )}
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
