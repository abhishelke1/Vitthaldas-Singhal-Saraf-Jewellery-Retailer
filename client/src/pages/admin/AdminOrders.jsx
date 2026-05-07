import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Eye, ChevronDown, Package, MapPin, Tag } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';
import { formatPrice, formatDate, getStatusColor } from '../../utils/helpers';
import toast from 'react-hot-toast';

const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const statusConfig = {
  pending:    { bg: 'rgba(245,158,11,0.1)',  text: '#b45309', border: 'rgba(245,158,11,0.25)' },
  confirmed:  { bg: 'rgba(59,130,246,0.1)',  text: '#1d4ed8', border: 'rgba(59,130,246,0.25)' },
  processing: { bg: 'rgba(99,102,241,0.1)',  text: '#4338ca', border: 'rgba(99,102,241,0.25)' },
  shipped:    { bg: 'rgba(168,85,247,0.1)',  text: '#7c3aed', border: 'rgba(168,85,247,0.25)' },
  delivered:  { bg: 'rgba(16,185,129,0.1)', text: '#047857', border: 'rgba(16,185,129,0.25)' },
  cancelled:  { bg: 'rgba(239,68,68,0.1)',  text: '#b91c1c', border: 'rgba(239,68,68,0.25)' },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [expandedOrder, setExpandedOrder] = useState(null);

  const fetchOrders = (p = 1) => {
    setLoading(true);
    const params = new URLSearchParams({ page: p, limit: 15 });
    if (filterStatus) params.set('status', filterStatus);
    api.get(`/orders/admin/all?${params}`)
      .then(({ data }) => { setOrders(data.data || []); setPagination(data.pagination || {}); })
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(page); }, [page, filterStatus]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order ${newStatus}`);
      fetchOrders(page);
    } catch { toast.error('Failed to update'); }
  };

  const nextStatus = (current) => {
    const flow = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const idx = flow.indexOf(current);
    return idx >= 0 && idx < flow.length - 1 ? flow[idx + 1] : null;
  };

  const StatusBadge = ({ status }) => {
    const cfg = statusConfig[status] || { bg: 'rgba(156,163,175,0.1)', text: '#6b7280', border: 'rgba(156,163,175,0.2)' };
    return (
      <span style={{
        background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}`,
        padding: '3px 10px', borderRadius: '20px', fontSize: '10px',
        fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em',
        display: 'inline-flex', alignItems: 'center'
      }}>
        {status}
      </span>
    );
  };

  return (
    <>
      <Helmet><title>Orders | Admin | VSS</title></Helmet>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:wght@400;600&family=Inter:wght@300;400;500;600&display=swap');
        .cinzel { font-family: 'Cinzel', serif; }
        .lux-inter { font-family: 'Inter', sans-serif; }
        .luxury-card {
          background: #fff;
          border: 1px solid rgba(212,175,55,0.15);
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(92,10,10,0.06);
        }
        .filter-pill {
          padding: 7px 16px;
          border-radius: 50px;
          font-size: 12px;
          font-weight: 600;
          text-transform: capitalize;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .filter-active {
          background: linear-gradient(135deg, #5C0A0A, #8B1A1A);
          color: white;
          box-shadow: 0 4px 12px rgba(92,10,10,0.25);
        }
        .filter-inactive {
          background: rgba(212,175,55,0.06);
          color: #7c5c5c;
          border: 1px solid rgba(212,175,55,0.2);
        }
        .filter-inactive:hover {
          background: rgba(212,175,55,0.12);
          color: #5C0A0A;
        }
        .order-row {
          transition: background 0.2s;
          cursor: pointer;
        }
        .order-row:hover {
          background: linear-gradient(to right, rgba(212,175,55,0.03), rgba(212,175,55,0.05));
        }
        .expand-detail {
          background: linear-gradient(135deg, rgba(247,243,238,0.8), rgba(255,253,248,0.9));
          border-top: 1px solid rgba(212,175,55,0.1);
        }
        .advance-btn {
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
          text-transform: capitalize;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
          font-family: 'Inter', sans-serif;
          background: rgba(212,175,55,0.1);
          color: #B8960C;
        }
        .advance-btn:hover {
          background: rgba(212,175,55,0.2);
          transform: scale(1.02);
        }
        .detail-card {
          background: white;
          border: 1px solid rgba(212,175,55,0.12);
          border-radius: 12px;
          padding: 16px;
        }
        .page-btn {
          width: 32px; height: 32px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .page-active { background: linear-gradient(135deg, #5C0A0A, #8B1A1A); color: white; }
        .page-inactive { background: #fafaf7; color: #6b7280; border-color: rgba(212,175,55,0.2); }
        .page-inactive:hover { background: rgba(212,175,55,0.08); color: #5C0A0A; }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .skeleton {
          background: linear-gradient(90deg, #f7f3ee 25%, #f0ebe3 50%, #f7f3ee 75%);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
          border-radius: 10px;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .slide-down { animation: slideDown 0.2s ease; }
      `}</style>

      <AdminLayout title="Manage Orders">
        {/* Status Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => { setFilterStatus(''); setPage(1); }}
            className={`filter-pill ${!filterStatus ? 'filter-active' : 'filter-inactive'}`}>
            All Orders
          </button>
          {statuses.map(s => (
            <button key={s} onClick={() => { setFilterStatus(s); setPage(1); }}
              className={`filter-pill ${filterStatus === s ? 'filter-active' : 'filter-inactive'}`}>
              {s}
            </button>
          ))}
        </div>

        <div className="luxury-card overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-4">
              {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(212,175,55,0.08)' }}>
                <Package size={28} style={{ color: '#D4AF37' }} />
              </div>
              <p className="cinzel font-medium text-lg" style={{ color: '#5C0A0A' }}>No orders found</p>
            </div>
          ) : (
            <div>
              {orders.map((order) => (
                <div key={order._id} style={{ borderBottom: '1px solid rgba(212,175,55,0.08)' }}>
                  <div className="order-row px-6 py-4 flex items-center justify-between"
                    onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}>
                    <div className="flex items-center gap-6 flex-1 flex-wrap">
                      <div className="min-w-[130px]">
                        <p className="cinzel text-xs font-semibold" style={{ color: '#5C0A0A' }}>{order.orderNumber}</p>
                        <p className="lux-inter text-xs mt-0.5" style={{ color: '#b8a090' }}>{formatDate(order.createdAt)}</p>
                      </div>
                      <div className="min-w-[130px]">
                        <p className="lux-inter text-sm font-medium" style={{ color: '#3d0707' }}>{order.user?.name || 'Guest'}</p>
                        <p className="lux-inter text-xs" style={{ color: '#b8a090' }}>{order.user?.phone || order.user?.email || ''}</p>
                      </div>
                      <div className="min-w-[100px]">
                        <p className="lux-inter text-sm font-bold" style={{ color: '#5C0A0A' }}>{formatPrice(order.totalAmount)}</p>
                        <p className="lux-inter text-xs" style={{ color: '#b8a090' }}>{order.items?.length || 0} items</p>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {nextStatus(order.status) && (
                        <button onClick={(e) => { e.stopPropagation(); updateStatus(order._id, nextStatus(order.status)); }}
                          className="advance-btn">
                          → {nextStatus(order.status)}
                        </button>
                      )}
                      <ChevronDown size={16} style={{ color: '#D4AF37', transition: 'transform 0.2s', transform: expandedOrder === order._id ? 'rotate(180deg)' : 'none' }} />
                    </div>
                  </div>

                  {expandedOrder === order._id && (
                    <div className="expand-detail px-6 py-6 slide-down">
                      <div className="grid md:grid-cols-3 gap-6">
                        {/* Items */}
                        <div className="md:col-span-2">
                          <p className="lux-inter text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: '#b8a090' }}>Order Items</p>
                          <div className="space-y-2.5">
                            {order.items?.map((item, i) => (
                              <div key={i} className="detail-card flex items-center gap-3">
                                <div className="flex-shrink-0 rounded-lg overflow-hidden" style={{ width: '44px', height: '52px', background: 'linear-gradient(135deg, #f7f3ee, #f0ebe3)' }}>
                                  {item.image ? <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="lux-inter text-sm font-medium line-clamp-1" style={{ color: '#3d0707' }}>{item.name}</p>
                                  <p className="lux-inter text-xs mt-0.5" style={{ color: '#b8a090' }}>{item.metalType} · {item.weight}g · Qty: {item.quantity}</p>
                                </div>
                                <p className="lux-inter text-sm font-bold flex-shrink-0" style={{ color: '#5C0A0A' }}>{formatPrice(item.itemPrice)}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Right side */}
                        <div className="space-y-4">
                          {/* Summary */}
                          <div className="detail-card">
                            <p className="lux-inter text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: '#b8a090' }}>Summary</p>
                            <div className="space-y-2 lux-inter text-sm">
                              <div className="flex justify-between"><span style={{ color: '#9b7b7b' }}>Subtotal</span><span className="font-medium" style={{ color: '#3d0707' }}>{formatPrice(order.subtotal)}</span></div>
                              <div className="flex justify-between"><span style={{ color: '#9b7b7b' }}>GST ({order.taxRate}%)</span><span className="font-medium" style={{ color: '#3d0707' }}>{formatPrice(order.taxAmount)}</span></div>
                              <div className="flex justify-between"><span style={{ color: '#9b7b7b' }}>Shipping</span><span className="font-medium" style={{ color: '#3d0707' }}>{order.shippingCharges === 0 ? 'Free' : formatPrice(order.shippingCharges)}</span></div>
                              <div className="flex justify-between pt-2" style={{ borderTop: '1px solid rgba(212,175,55,0.15)' }}>
                                <span className="font-bold" style={{ color: '#5C0A0A' }}>Total</span>
                                <span className="font-bold" style={{ color: '#5C0A0A' }}>{formatPrice(order.totalAmount)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Shipping */}
                          {order.shippingAddress && (
                            <div className="detail-card">
                              <p className="lux-inter text-[11px] font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#b8a090' }}>
                                <MapPin size={11} /> Shipping Address
                              </p>
                              <div className="lux-inter text-xs leading-relaxed" style={{ color: '#7c5c5c' }}>
                                <p className="font-semibold mb-0.5" style={{ color: '#3d0707' }}>{order.shippingAddress.fullName}</p>
                                <p>{order.shippingAddress.addressLine1}</p>
                                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}</p>
                                <p className="mt-1" style={{ color: '#b8a090' }}>{order.shippingAddress.phone}</p>
                              </div>
                            </div>
                          )}

                          {/* Status Actions */}
                          <div className="detail-card">
                            <p className="lux-inter text-[11px] font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#b8a090' }}>
                              <Tag size={11} /> Update Status
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {statuses.filter(s => s !== order.status).map(s => (
                                <button key={s} onClick={() => updateStatus(order._id, s)}
                                  className="lux-inter text-[10px] px-3 py-1.5 rounded-lg font-semibold capitalize transition-all"
                                  style={{ background: 'rgba(212,175,55,0.07)', color: '#7c5c5c', border: '1px solid rgba(212,175,55,0.2)' }}
                                  onMouseEnter={e => { e.target.style.background = 'rgba(92,10,10,0.08)'; e.target.style.color = '#5C0A0A'; }}
                                  onMouseLeave={e => { e.target.style.background = 'rgba(212,175,55,0.07)'; e.target.style.color = '#7c5c5c'; }}>
                                  {s}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {pagination.pages > 1 && (
            <div className="px-6 py-4 flex items-center justify-between" style={{ borderTop: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="lux-inter text-sm" style={{ color: '#b8a090' }}>Page {pagination.page} of {pagination.pages}</p>
              <div className="flex gap-1.5">
                {[...Array(pagination.pages)].map((_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)}
                    className={`page-btn ${pagination.page === i + 1 ? 'page-active' : 'page-inactive'}`}>
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  );
}