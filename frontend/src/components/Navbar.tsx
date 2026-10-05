// JARVIS App — Navbar v2.1.0
// Shows company logo/name, nav links, and user info.
// Admin links visible only to admin role.
// v2.1.0: GENERIC — removed title_company links (Calculators / My Sheets / admin routes)
//         so the universal navbar no longer leaks into other gigs. Gig-specific navbars
//         (e.g. Navbar_food_truck) override this component with their own links.
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useBrand } from '@/contexts/BrandContext';
import { BRAND } from '@/config/brand';

// SECTION-AWARE-NAV (FMPB v2.8.0): two-tier IA from src/nav_manifest.json
type NavItem = { to: string; label: string };
type NavSection = { id: string; label: string; primary: boolean; route: string; items: NavItem[] };
const NAV_SECTIONS: NavSection[] = [
  {
    "id": "management",
    "label": "Management",
    "primary": true,
    "route": "/",
    "items": [
      {
        "to": "/alerts",
        "label": "Alerts"
      },
      {
        "to": "/analytics",
        "label": "Analytics"
      },
      {
        "to": "/daily-reports",
        "label": "Daily Reports"
      },
      {
        "to": "/inventories",
        "label": "Inventories"
      },
      {
        "to": "/landowner-payouts",
        "label": "Landowner Payouts"
      },
      {
        "to": "/landowners",
        "label": "Landowners"
      },
      {
        "to": "/locations",
        "label": "Locations"
      },
      {
        "to": "/machines",
        "label": "Machines"
      },
      {
        "to": "/operators",
        "label": "Operators"
      },
      {
        "to": "/products",
        "label": "Products"
      },
      {
        "to": "/revenue-share-agreements",
        "label": "Revenue Share Agreements"
      },
      {
        "to": "/routes",
        "label": "Routes"
      },
      {
        "to": "/service-visits",
        "label": "Service Visits"
      },
      {
        "to": "/standing-orders",
        "label": "Standing Orders"
      },
      {
        "to": "/transactions",
        "label": "Transactions"
      },
      {
        "to": "/users",
        "label": "Users"
      },
      {
        "to": "/wholesale-accounts",
        "label": "Wholesale Accounts"
      },
      {
        "to": "/wholesale-orders",
        "label": "Wholesale Orders"
      }
    ]
  },
  {
    "id": "marketing",
    "label": "Marketing",
    "primary": false,
    "route": "/marketing",
    "items": [
      {
        "to": "/email-send-logs",
        "label": "Email Send Logs"
      },
      {
        "to": "/email-sequences",
        "label": "Email Sequences"
      },
      {
        "to": "/leads",
        "label": "Leads"
      },
      {
        "to": "/marketing-templates",
        "label": "Marketing Templates"
      },
      {
        "to": "/operator-websites",
        "label": "Operator Websites"
      },
      {
        "to": "/proposals",
        "label": "Proposals"
      }
    ]
  }
];
const DEFAULT_SECTION = "management";
function resolveActiveSection(pathname: string): string {
  for (const s of NAV_SECTIONS) {
    if (s.items.some((it) => pathname === it.to || pathname.startsWith(it.to + '/'))) return s.id;
  }
  for (const s of NAV_SECTIONS) {
    if (s.route !== '/' && (pathname === s.route || pathname.startsWith(s.route + '/'))) return s.id;
  }
  return DEFAULT_SECTION;
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { company } = useBrand();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const activeSectionId = resolveActiveSection(pathname);
  const activeSection = NAV_SECTIONS.find((s) => s.id === activeSectionId) ?? NAV_SECTIONS[0];

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
                {company?.company_name || BRAND.name}
              </span>
            )}
          </Link>

          {/* SECTION-AWARE-NAV — two-tier IA (FIX-NAV-COHERENCE) */}
          <div className="hidden md:flex flex-col justify-center">
            <div className="flex items-center gap-1">
              {NAV_SECTIONS.map((s) => (
                <Link
                  key={s.id}
                  to={s.route}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                    s.id === activeSectionId
                      ? 'bg-[var(--color-brand)] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {s.primary ? <LayoutDashboard size={16} /> : null}
                  {s.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-1 overflow-x-auto mt-0.5">
              {activeSection.items.map((it) => (
                <NavLink key={it.to} to={it.to} className={navLinkClass}>
                  {it.label}
                </NavLink>
              ))}
            </div>
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
