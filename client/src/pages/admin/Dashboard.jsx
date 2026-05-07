import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
<<<<<<< Updated upstream
import { Package, ShoppingCart, Users, IndianRupee, TrendingUp, ArrowUpRight, Clock } from 'lucide-react';
=======
import { Package, ShoppingCart, Users, IndianRupee, TrendingUp, ArrowUpRight, Gem, Crown } from 'lucide-react';
>>>>>>> Stashed changes
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';
import { formatPrice, formatDate, getStatusColor } from '../../utils/helpers';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/admin/stats')
      .then(({ data }) => setStats(data.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
<<<<<<< Updated upstream
    { label: 'Total Revenue', value: formatPrice(stats.totalRevenue), icon: IndianRupee, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: Package, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    { label: 'Total Customers', value: stats.totalUsers, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
=======
    {
      label: 'Total Revenue',
      value: formatPrice(stats.totalRevenue),
      icon: IndianRupee,
      gradient: 'from-[#5C0A0A] to-[#8B1A1A]',
      accent: '#D4AF37',
      sub: 'Lifetime earnings',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      gradient: 'from-[#1a1a2e] to-[#16213e]',
      accent: '#D4AF37',
      sub: 'All time orders',
    },
    {
      label: 'Pending Orders',
      value: stats.pendingOrders,
      icon: Package,
      gradient: 'from-[#2d1b00] to-[#4a3200]',
      accent: '#D4AF37',
      sub: 'Awaiting processing',
    },
    {
      label: 'Total Customers',
      value: stats.totalUsers,
      icon: Users,
      gradient: 'from-[#0a2e1a] to-[#1a4a2e]',
      accent: '#D4AF37',
      sub: 'Registered users',
    },
>>>>>>> Stashed changes
  ] : [];

  const statusStyle = {
    pending: 'bg-amber-50 text-amber-700 border border-amber-200',
    confirmed: 'bg-blue-50 text-blue-700 border border-blue-200',
    processing: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    shipped: 'bg-purple-50 text-purple-700 border border-purple-200',
    delivered: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    cancelled: 'bg-red-50 text-red-700 border border-red-200',
  };

  return (
    <>
      <Helmet><title>Admin Dashboard | VSS</title></Helmet>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap');

        .luxury-card {
          background: #fff;
          border: 1px solid rgba(212,175,55,0.15);
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(92,10,10,0.06), 0 1px 2px rgba(0,0,0,0.04);
          transition: all 0.3s ease;
        }
        .luxury-card:hover {
          box-shadow: 0 8px 40px rgba(92,10,10,0.1), 0 2px 8px rgba(212,175,55,0.08);
          transform: translateY(-2px);
        }
        .stat-card {
          border-radius: 16px;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .stat-card::before {
          content: '';
          position: absolute;
          top: -40%;
          right: -20%;
          width: 180px;
          height: 180px;
          background: rgba(255,255,255,0.05);
          border-radius: 50%;
        }
        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.25);
        }
        .gold-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(212,175,55,0.5), transparent);
        }
        .welcome-banner {
          background: linear-gradient(135deg, #5C0A0A 0%, #8B1A1A 50%, #3d0707 100%);
          border-radius: 20px;
          padding: 2rem 2.5rem;
          position: relative;
          overflow: hidden;
        }
        .welcome-banner::after {
          content: '';
          position: absolute;
          top: 0; right: 0; bottom: 0;
          width: 40%;
          background: url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M100 10 L110 45 L145 45 L118 65 L128 100 L100 80 L72 100 L82 65 L55 45 L90 45 Z' fill='rgba(212,175,55,0.08)'/%3E%3C/svg%3E") no-repeat center;
          background-size: 300px;
          opacity: 0.6;
        }
        .cinzel { font-family: 'Cinzel', serif; }
        .cormorant { font-family: 'Cormorant Garamond', serif; }
        .lux-inter { font-family: 'Inter', sans-serif; }
        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .table-row-hover:hover {
          background: linear-gradient(to right, rgba(212,175,55,0.03), rgba(212,175,55,0.06));
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .skeleton {
          background: linear-gradient(90deg, #f7f3ee 25%, #f0ebe3 50%, #f7f3ee 75%);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
          border-radius: 12px;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeInUp 0.5s ease forwards; }
        .fade-in-1 { animation-delay: 0.1s; opacity: 0; }
        .fade-in-2 { animation-delay: 0.2s; opacity: 0; }
        .fade-in-3 { animation-delay: 0.3s; opacity: 0; }
        .fade-in-4 { animation-delay: 0.4s; opacity: 0; }
        .fade-in-5 { animation-delay: 0.5s; opacity: 0; }
      `}</style>

      <AdminLayout title="Dashboard Overview">
        {loading ? (
<<<<<<< Updated upstream
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-36 bg-white rounded-xl border border-gray-100 animate-pulse">
                <div className="p-6 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100" />
                  <div className="h-7 w-24 bg-gray-100 rounded" />
                  <div className="h-4 w-16 bg-gray-50 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : !stats ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-gray-200">
            <Package size={48} className="text-gray-200 mb-4" />
            <p className="text-gray-500 font-medium">Could not load dashboard data.</p>
            <p className="text-sm text-gray-400 mt-1">Make sure the database is connected.</p>
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {statCards.map((card) => (
                <div key={card.label} className={`bg-white rounded-xl border ${card.border} p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg group`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.bg} transition-transform duration-300 group-hover:scale-110`}>
                      <card.icon size={20} className={card.color} />
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                      <TrendingUp size={12} className="text-emerald-400" />
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-brand-dark mb-0.5 tracking-tight">{card.value}</p>
                    <p className="text-[12px] font-medium text-gray-400 uppercase tracking-wider">{card.label}</p>
=======
          <div>
            <div className="skeleton h-28 mb-6 rounded-2xl" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-36 rounded-2xl" />)}
            </div>
            <div className="skeleton h-80 rounded-2xl" />
          </div>
        ) : !stats ? (
          <div className="luxury-card flex flex-col items-center justify-center h-64">
            <Gem size={40} className="text-[#D4AF37] mb-3" />
            <p className="cinzel font-semibold text-[#5C0A0A] text-lg">Dashboard Unavailable</p>
            <p className="lux-inter text-sm text-gray-400 mt-1">Could not load dashboard data. Check database connection.</p>
          </div>
        ) : (
          <>
            {/* Welcome Banner */}
            <div className="welcome-banner mb-8 fade-in fade-in-1">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Crown size={14} style={{ color: '#D4AF37' }} />
                  <span className="lux-inter text-xs font-medium tracking-widest uppercase" style={{ color: '#D4AF37', opacity: 0.9 }}>VSS Jewellers Admin</span>
                </div>
                <h1 className="cinzel text-2xl md:text-3xl font-semibold text-white mb-1">Welcome Back</h1>
                <p className="cormorant text-lg italic" style={{ color: 'rgba(212,175,55,0.8)' }}>Your luxury jewellery store at a glance</p>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {statCards.map((card, idx) => (
                <div key={card.label} className={`stat-card bg-gradient-to-br ${card.gradient} fade-in fade-in-${idx + 2}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.15)' }}>
                      <card.icon size={22} style={{ color: '#D4AF37' }} />
                    </div>
                    <ArrowUpRight size={16} style={{ color: 'rgba(212,175,55,0.5)' }} />
>>>>>>> Stashed changes
                  </div>
                  <p className="cinzel text-2xl font-bold text-white mb-0.5">{card.value}</p>
                  <p className="lux-inter text-xs font-medium text-white/70 mb-0.5">{card.label}</p>
                  <p className="lux-inter text-[10px]" style={{ color: 'rgba(212,175,55,0.6)' }}>{card.sub}</p>
                </div>
              ))}
            </div>

<<<<<<< Updated upstream
            {/* Recent Orders Table */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h2 className="text-base font-semibold text-brand-dark">Recent Orders</h2>
                  <p className="text-[11px] text-gray-400 mt-0.5">Latest customer transactions</p>
                </div>
                <Link to="/admin/orders" className="flex items-center gap-1.5 text-[12px] text-brand-gold font-semibold hover:text-brand-gold-dark transition-colors group">
                  View All <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
=======
            {/* Recent Orders */}
            <div className="luxury-card overflow-hidden fade-in fade-in-5">
              <div className="px-6 py-5 flex justify-between items-center">
                <div>
                  <h2 className="cinzel text-base font-semibold" style={{ color: '#5C0A0A' }}>Recent Orders</h2>
                  <p className="lux-inter text-xs text-gray-400 mt-0.5">Latest transactions from your store</p>
                </div>
                <Link to="/admin/orders" className="lux-inter flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-all"
                  style={{ background: 'rgba(212,175,55,0.1)', color: '#B8960C' }}>
                  View All <ArrowUpRight size={13} />
>>>>>>> Stashed changes
                </Link>
              </div>
              <div className="gold-divider mx-6" />
              {stats.recentOrders?.length > 0 ? (
                <div className="overflow-x-auto">
<<<<<<< Updated upstream
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="bg-gray-50/80 border-b border-gray-100">
                        <th className="px-6 py-3.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-3.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {stats.recentOrders.map((order) => (
                        <tr key={order._id} className="hover:bg-brand-cream/30 transition-colors group cursor-pointer">
                          <td className="px-6 py-4">
                            <span className="font-medium text-brand-dark text-[13px]">{order.orderNumber}</span>
                          </td>
                          <td className="px-6 py-4 text-gray-600 text-[13px]">{order.user?.name || 'Guest'}</td>
                          <td className="px-6 py-4">
                            <span className="font-semibold text-brand-dark text-[13px]">{formatPrice(order.totalAmount)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${getStatusColor(order.status)}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                order.status === 'delivered' ? 'bg-green-500' :
                                order.status === 'pending' ? 'bg-yellow-500' :
                                order.status === 'cancelled' ? 'bg-red-500' : 'bg-blue-500'
                              }`} />
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-gray-400 text-[12px] flex items-center gap-1.5">
                              <Clock size={11} />
                              {formatDate(order.createdAt)}
                            </span>
                          </td>
=======
                  <table className="w-full lux-inter text-sm">
                    <thead>
                      <tr style={{ background: 'linear-gradient(to right, rgba(92,10,10,0.03), rgba(92,10,10,0.015))' }}>
                        <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#9b7b7b' }}>Order ID</th>
                        <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#9b7b7b' }}>Customer</th>
                        <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#9b7b7b' }}>Amount</th>
                        <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#9b7b7b' }}>Status</th>
                        <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#9b7b7b' }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentOrders.map((order, idx) => (
                        <tr key={order._id} className="table-row-hover border-t" style={{ borderColor: 'rgba(212,175,55,0.08)' }}>
                          <td className="px-6 py-4">
                            <span className="cinzel text-xs font-semibold" style={{ color: '#5C0A0A' }}>{order.orderNumber}</span>
                          </td>
                          <td className="px-6 py-4 text-gray-700 text-sm">{order.user?.name || 'Guest'}</td>
                          <td className="px-6 py-4">
                            <span className="font-semibold" style={{ color: '#5C0A0A' }}>{formatPrice(order.totalAmount)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`status-badge ${statusStyle[order.status] || 'bg-gray-100 text-gray-600'}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-400 text-xs">{formatDate(order.createdAt)}</td>
>>>>>>> Stashed changes
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
<<<<<<< Updated upstream
                <div className="p-12 text-center">
                  <Package size={40} className="mx-auto text-gray-200 mb-3" />
                  <p className="text-gray-500 font-medium text-sm">No recent orders found</p>
                  <p className="text-[12px] text-gray-400 mt-1">Orders will appear here once customers start ordering</p>
=======
                <div className="p-16 text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(212,175,55,0.08)' }}>
                    <Package size={28} style={{ color: '#D4AF37' }} />
                  </div>
                  <p className="cinzel font-medium" style={{ color: '#5C0A0A' }}>No recent orders</p>
                  <p className="lux-inter text-xs text-gray-400 mt-1">Orders will appear here once customers start purchasing</p>
>>>>>>> Stashed changes
                </div>
              )}
            </div>
          </>
        )}
      </AdminLayout>
    </>
  );
}