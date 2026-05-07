import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Tags,
  TrendingUp, Image, Settings, LogOut, Eye,
} from 'lucide-react';
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
  );
}