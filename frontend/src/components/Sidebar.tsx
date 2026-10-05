// VendFlow — Sidebar navigation  v2.0.0  (S191)
// v2.0.0: dark chrome, per-item icons, real section separation. The v1 sidebar
// grouped the links correctly but read as one flat list — the group headings
// were 10px grey text with nothing else to separate them, and 24 identical
// text rows give the eye nothing to land on. Colour separates chrome from
// content; icons make a row scannable without reading it.
// Builder home: Road 1 / B1.
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LogOut, LayoutDashboard, Megaphone, Snowflake,
  Box, Package, Bell, Wrench, Route as RouteIcon,
  CreditCard, FileText, BarChart3, Tag,
  Building2, MapPin, Users, Percent, Banknote,
  Briefcase, ShoppingCart, Repeat, Shield,
  UserPlus, Mail, Send, LayoutTemplate, Globe,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useBrand } from '@/contexts/BrandContext';
import { BRAND } from '@/config/brand';
import { NAV_GROUPS, UNGROUPED_LABEL } from '@/config/nav_groups';

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

// One icon per route. A row you can find by shape beats a row you must read.
const ICONS: Record<string, LucideIcon> = {
  '/machines': Box,
  '/inventories': Package,
  '/alerts': Bell,
  '/service-visits': Wrench,
  '/routes': RouteIcon,
  '/transactions': CreditCard,
  '/daily-reports': FileText,
  '/analytics': BarChart3,
  '/products': Tag,
  '/operators': Building2,
  '/locations': MapPin,
  '/landowners': Users,
  '/revenue-share-agreements': Percent,
  '/landowner-payouts': Banknote,
  '/wholesale-accounts': Briefcase,
  '/wholesale-orders': ShoppingCart,
  '/standing-orders': Repeat,
  '/users': Shield,
  '/leads': UserPlus,
  '/proposals': FileText,
  '/email-sequences': Mail,
  '/email-send-logs': Send,
  '/marketing-templates': LayoutTemplate,
  '/operator-websites': Globe,
};

type Group = { label: string; items: NavItem[] };

function groupItems(sectionId: string, items: NavItem[]): Group[] {
  const groups = NAV_GROUPS[sectionId] ?? [];
  const byRoute = new Map(items.map((i) => [i.to, i]));
  const out: Group[] = [];
  const claimed = new Set<string>();
  for (const g of groups) {
    const found = g.routes.map((r) => byRoute.get(r)).filter(Boolean) as NavItem[];
    found.forEach((i) => claimed.add(i.to));
    if (found.length) out.push({ label: g.label, items: found });
  }
  const leftovers = items.filter((i) => !claimed.has(i.to));
  if (leftovers.length) out.push({ label: UNGROUPED_LABEL, items: leftovers });
  return out;
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { company } = useBrand();
  const navigate = useNavigate();
  const location = useLocation();

  const activeSection =
    NAV_SECTIONS.find((s) => s.id !== 'management' && s.items.some((i) => location.pathname.startsWith(i.to)))
    ?? NAV_SECTIONS.find((s) => location.pathname.startsWith(s.route) && s.route !== '/')
    ?? NAV_SECTIONS[0];

  const groups = groupItems(activeSection.id, activeSection.items);

  return (
    <aside className="w-64 shrink-0 bg-slate-900 h-screen sticky top-0 flex flex-col">
      {/* Brand */}
      <Link to="/dashboard" className="flex items-center gap-2.5 px-4 h-16 shrink-0 border-b border-slate-800">
        {company?.logo_url ? (
          <img src={company.logo_url} alt={String(company.company_name)} className="h-8 w-auto" />
        ) : (
          <>
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: BRAND.primaryColor }}
            >
              <Snowflake size={17} className="text-white" />
            </div>
            <div className="min-w-0">
              <div className="text-[15px] font-semibold text-white leading-tight truncate">
                {company?.company_name || BRAND.name}
              </div>
              <div className="text-[10.5px] text-slate-500 leading-tight truncate">{BRAND.tagline}</div>
            </div>
          </>
        )}
      </Link>

      {/* Section switcher */}
      {NAV_SECTIONS.length > 1 && (
        <div className="flex gap-1 px-3 py-3 shrink-0">
          {NAV_SECTIONS.map((s) => {
            const on = s.id === activeSection.id;
            return (
              <Link
                key={s.id}
                to={s.route}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
                  on ? 'text-white shadow-sm' : 'text-slate-400 bg-slate-800/60 hover:bg-slate-800 hover:text-slate-200'
                }`}
                style={on ? { backgroundColor: BRAND.primaryColor } : undefined}
              >
                {s.primary ? <LayoutDashboard size={13} /> : <Megaphone size={13} />}
                {s.label}
              </Link>
            );
          })}
        </div>
      )}

      {/* Groups */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {groups.map((g, gi) => (
          <div key={g.label} className={gi === 0 ? '' : 'mt-1 pt-4 border-t border-slate-800/80'}>
            <div className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-500">
              {g.label}
            </div>
            <div className="space-y-0.5">
              {g.items.map((it) => {
                const Icon = ICONS[it.to];
                return (
                  <NavLink
                    key={it.to}
                    to={it.to}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] transition-colors ${
                        isActive
                          ? 'text-white font-medium'
                          : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-100'
                      }`
                    }
                    style={({ isActive }) =>
                      isActive ? { backgroundColor: BRAND.primaryColor } : undefined
                    }
                  >
                    {Icon ? <Icon size={15} className="shrink-0 opacity-90" /> : <span className="w-[15px]" />}
                    <span className="truncate">{it.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="border-t border-slate-800 p-3 shrink-0">
        {user && (
          <div className="px-2 pb-2 text-[11px] text-slate-500 truncate" title={user.email}>
            {user.full_name || user.email}
          </div>
        )}
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] text-slate-400 transition-colors hover:bg-slate-800 hover:text-red-400"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
