<<<<<<< Updated upstream
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Tags, TrendingUp, Image, Settings, LogOut, Eye, Menu, X, ChevronRight, Gem } from 'lucide-react';
=======
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Tags,
  TrendingUp, Image, Settings, LogOut, Eye,
} from 'lucide-react';
>>>>>>> Stashed changes
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { label: 'Dashboard',   path: '/admin',            icon: LayoutDashboard },
  { label: 'Products',    path: '/admin/products',   icon: Package },
  { label: 'Orders',      path: '/admin/orders',     icon: ShoppingCart },
  { label: 'Categories',  path: '/admin/categories', icon: Tags },
  { label: 'Metal Rates', path: '/admin/rates',      icon: TrendingUp },
  { label: 'Banners',     path: '/admin/banners',    icon: Image },
  { label: 'Settings',    path: '/admin/settings',   icon: Settings },
];

export default function AdminLayout({ title, children }) {
<<<<<<< Updated upstream
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location]);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const SidebarContent = () => (
    <>
      {/* Brand */}
      <div className="p-6 border-b border-gray-100">
        <Link to="/admin" className="block">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-brand-dark flex items-center justify-center">
              <Gem size={16} className="text-brand-gold" />
            </div>
            <div>
              <h1 className="text-base font-heading font-bold text-brand-dark leading-tight">VSS Admin</h1>
              <p className="text-[9px] uppercase tracking-[0.2em] text-brand-gold font-medium">Management Panel</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 py-2 text-[9px] uppercase tracking-[0.2em] text-gray-400 font-semibold">Menu</p>
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link key={item.path} to={item.path}
              className={`group flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium rounded-lg transition-all duration-200 ${
                active
                  ? 'bg-brand-dark text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-brand-dark'
              }`}>
              <item.icon size={17} className={`transition-colors ${active ? 'text-brand-gold' : 'text-gray-400 group-hover:text-brand-gold-dark'}`} />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight size={14} className="text-brand-gold/60" />}
            </Link>
          );
        })}
      </nav>

      {/* User info + logout */}
      <div className="p-3 border-t border-gray-100">
        {user && (
          <div className="px-3 py-2.5 mb-1">
            <p className="text-xs font-medium text-brand-dark truncate">{user.name}</p>
            <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
          </div>
        )}
        <Link to="/" className="flex items-center gap-3 w-full px-3 py-2.5 text-[13px] font-medium text-gray-500 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors mb-1">
          <Eye size={16} /> View Storefront
        </Link>
        <button onClick={() => { logout(); navigate('/'); }} className="flex items-center gap-3 w-full px-3 py-2.5 text-[13px] font-medium text-red-500 rounded-lg hover:bg-red-50 transition-colors">
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-[#F5F6F8]">
      {/* Desktop Sidebar */}
      <aside className="w-[260px] bg-white border-r border-gray-200/80 hidden md:flex flex-col sticky top-0 h-screen shadow-sm">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="fixed left-0 top-0 w-[280px] h-full bg-white z-50 md:hidden flex flex-col shadow-2xl animate-slide-in-right" style={{ animationDuration: '0.25s' }}>
            <div className="absolute top-4 right-4">
              <button onClick={() => setMobileOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                <X size={16} />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200/80 h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="md:hidden w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
              <Menu size={18} />
            </button>
            <div>
              <h2 className="text-base font-semibold text-brand-dark leading-tight">{title}</h2>
              <p className="text-[10px] text-gray-400 hidden sm:block">Vitthaldas Singhal Saraf · Admin Panel</p>
            </div>
          </div>
          <Link to="/" className="hidden sm:flex text-[12px] font-medium text-gray-500 hover:text-brand-dark items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200/80 hover:border-gray-300 transition-all">
            <Eye size={14} /> View Store
          </Link>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
=======
  const { logout } = useAuth();
  const location   = useLocation();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Lato:wght@300;400;500;600;700&display=swap');

        .adm-shell          { min-height:100vh; display:flex; background:#F4EFE8; font-family:'Lato',sans-serif; }

        /* ── sidebar ── */
        .adm-sidebar        { width:224px; flex-shrink:0; background:linear-gradient(180deg,#3B0000 0%,#5C0A0A 45%,#6B1010 100%); display:flex; flex-direction:column; position:sticky; top:0; height:100vh; overflow:hidden; }
        .adm-sidebar::after { content:''; position:absolute; inset:0; background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); pointer-events:none; z-index:0; }

        .adm-logo-wrap      { position:relative; z-index:1; padding:22px 20px 18px; border-bottom:1px solid rgba(255,255,255,0.07); }
        .adm-logo-inner     { display:flex; align-items:center; gap:12px; }
        .adm-logo-badge     { width:40px; height:40px; border-radius:10px; background:linear-gradient(135deg,rgba(212,175,55,.25),rgba(212,175,55,.08)); border:1px solid rgba(212,175,55,.35); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .adm-logo-v         { font-family:'Cinzel',serif; font-size:20px; font-weight:700; color:#D4AF37; line-height:1; }
        .adm-logo-text h1   { margin:0; font-family:'Cinzel',serif; font-size:15px; font-weight:700; color:#fff; letter-spacing:.03em; line-height:1.15; }
        .adm-logo-text p    { margin:3px 0 0; font-size:9px; font-weight:600; text-transform:uppercase; letter-spacing:.16em; color:rgba(212,175,55,.7); }

        .adm-nav            { position:relative; z-index:1; flex:1; padding:16px 12px; overflow-y:auto; display:flex; flex-direction:column; gap:2px; }
        .adm-nav::-webkit-scrollbar { width:3px; }
        .adm-nav::-webkit-scrollbar-thumb { background:rgba(255,255,255,.12); border-radius:2px; }

        .adm-nav-item       { display:flex; align-items:center; gap:11px; padding:10px 12px; border-radius:9px; text-decoration:none; font-size:13px; font-weight:500; color:rgba(255,255,255,.55); transition:all .18s; border:1px solid transparent; letter-spacing:.01em; }
        .adm-nav-item:hover { background:rgba(255,255,255,.06); color:rgba(255,255,255,.85); }
        .adm-nav-item.active{ background:rgba(212,175,55,.14); border-color:rgba(212,175,55,.28); color:#F5D978; font-weight:600; box-shadow:0 2px 12px rgba(0,0,0,.15); }
        .adm-nav-item .nav-icon      { color:rgba(255,255,255,.3); flex-shrink:0; transition:color .18s; }
        .adm-nav-item:hover .nav-icon{ color:rgba(255,255,255,.6); }
        .adm-nav-item.active .nav-icon{ color:#D4AF37; }

        .adm-nav-section    { font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:.15em; color:rgba(255,255,255,.2); padding:12px 12px 6px; }

        .adm-sidebar-foot   { position:relative; z-index:1; padding:12px; border-top:1px solid rgba(255,255,255,.07); }
        .adm-logout-btn     { display:flex; align-items:center; gap:11px; width:100%; padding:10px 12px; border-radius:9px; background:transparent; border:1px solid transparent; color:rgba(255,150,150,.65); font-size:13px; font-weight:500; cursor:pointer; transition:all .18s; font-family:'Lato',sans-serif; letter-spacing:.01em; }
        .adm-logout-btn:hover { background:rgba(220,50,50,.1); border-color:rgba(220,50,50,.18); color:#f87171; }

        /* ── main ── */
        .adm-main           { flex:1; display:flex; flex-direction:column; min-height:100vh; overflow:hidden; }

        .adm-topbar         { background:#fff; border-bottom:1px solid #EDE5DC; height:58px; display:flex; align-items:center; justify-content:space-between; padding:0 28px; position:sticky; top:0; z-index:50; flex-shrink:0; }
        .adm-topbar-left    { display:flex; align-items:center; gap:10px; }
        .adm-topbar-title   { font-family:'Cinzel',serif; font-size:16px; font-weight:600; color:#2C1810; letter-spacing:.02em; }
        .adm-topbar-sep     { width:1px; height:18px; background:#EDE5DC; }
        .adm-breadcrumb     { font-size:12px; color:#B8A090; font-weight:400; }

        .adm-view-btn       { display:flex; align-items:center; gap:7px; font-size:12px; font-weight:600; color:#8B6914; background:rgba(184,150,12,.08); border:1px solid rgba(184,150,12,.28); border-radius:8px; padding:7px 14px; text-decoration:none; transition:all .18s; letter-spacing:.03em; font-family:'Lato',sans-serif; }
        .adm-view-btn:hover { background:rgba(184,150,12,.15); color:#6B4E0A; }

        .adm-content        { flex:1; overflow:auto; padding:28px 28px 48px; }
        .adm-content::-webkit-scrollbar       { width:5px; }
        .adm-content::-webkit-scrollbar-thumb { background:rgba(92,10,10,.15); border-radius:3px; }

        @media (max-width:768px) {
          .adm-sidebar { display:none; }
        }
      `}</style>

      <div className="adm-shell">

        {/* ══ SIDEBAR ══ */}
        <aside className="adm-sidebar">

          {/* Logo */}
          <div className="adm-logo-wrap">
            <Link to="/admin" style={{ textDecoration:'none' }}>
              <div className="adm-logo-inner">
                <div className="adm-logo-badge">
                  <span className="adm-logo-v">V</span>
                </div>
                <div className="adm-logo-text">
                  <h1>VSS Admin</h1>
                  <p>Management Panel</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Nav */}
          <nav className="adm-nav">
            <div className="adm-nav-section">Navigation</div>
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path !== '/admin' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`adm-nav-item${isActive ? ' active' : ''}`}
                >
                  <item.icon size={16} className="nav-icon" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="adm-sidebar-foot">
            <button onClick={logout} className="adm-logout-btn">
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </aside>

        {/* ══ MAIN ══ */}
        <main className="adm-main">

          {/* Topbar */}
          <header className="adm-topbar">
            <div className="adm-topbar-left">
              <span className="adm-topbar-title">{title}</span>
            </div>
            <Link to="/" className="adm-view-btn">
              <Eye size={13} />
              View Storefront
            </Link>
          </header>

          {/* Content */}
          <div className="adm-content">
            {children}
          </div>

        </main>
      </div>
    </>
>>>>>>> Stashed changes
  );
}