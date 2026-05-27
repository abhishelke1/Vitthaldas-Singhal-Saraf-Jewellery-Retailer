import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, EyeOff, Gem, SlidersHorizontal } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';
import { formatPrice } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const fetchProducts = (p = 1) => {
    setLoading(true);
    const params = new URLSearchParams({ page: p, limit: 15 });
    if (search) params.set('search', search);
    api.get(`/products/admin/all?${params}`)
      .then(({ data }) => { setProducts(data.data || []); setPagination(data.pagination || {}); })
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(page); }, [page]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchProducts(1); };

  const toggleActive = async (id, currentActive) => {
    try {
      await api.put(`/products/${id}`, { isActive: !currentActive });
      toast.success(currentActive ? 'Product hidden' : 'Product visible');
      fetchProducts(page);
    } catch { toast.error('Failed to update'); }
  };

  const deleteProduct = async (id, name) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts(page);
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <>
      <Helmet><title>Products | Admin | VSS</title></Helmet>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:wght@400;600&family=Inter:wght@300;400;500;600&display=swap');
        .cinzel { font-family: 'Cinzel', serif; }
        .cormorant { font-family: 'Cormorant Garamond', serif; }
        .lux-inter { font-family: 'Inter', sans-serif; }
        .luxury-card {
          background: #fff;
          border: 1px solid rgba(212,175,55,0.15);
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(92,10,10,0.06);
        }
        .gold-input {
          width: 100%;
          border: 1px solid rgba(212,175,55,0.25);
          border-radius: 10px;
          padding: 10px 16px;
          font-size: 13px;
          outline: none;
          transition: all 0.2s;
          background: #fdfaf5;
          font-family: 'Inter', sans-serif;
        }
        .gold-input:focus {
          border-color: #D4AF37;
          box-shadow: 0 0 0 3px rgba(212,175,55,0.12);
          background: #fff;
        }
        .gold-btn-primary {
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #5C0A0A, #8B1A1A);
          color: white;
          border: none;
          border-radius: 10px;
          padding: 10px 20px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s;
          font-family: 'Inter', sans-serif;
          text-decoration: none;
        }
        .gold-btn-primary:hover {
          background: linear-gradient(135deg, #D4AF37, #B8960C);
          box-shadow: 0 4px 16px rgba(212,175,55,0.3);
          transform: translateY(-1px);
        }
        .product-row {
          transition: all 0.2s;
          border-bottom: 1px solid rgba(212,175,55,0.07);
        }
        .product-row:hover {
          background: linear-gradient(to right, rgba(212,175,55,0.03), rgba(212,175,55,0.06), rgba(212,175,55,0.03));
        }
        .action-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          background: transparent;
        }
        .action-btn:hover { transform: scale(1.1); }
        .edit-btn:hover { background: rgba(59,130,246,0.1); color: #3b82f6; }
        .toggle-btn:hover { background: rgba(212,175,55,0.1); color: #B8960C; }
        .delete-btn:hover { background: rgba(239,68,68,0.1); color: #ef4444; }
        .status-badge {
          display: inline-flex;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .active-badge { background: rgba(16,185,129,0.1); color: #059669; border: 1px solid rgba(16,185,129,0.2); }
        .hidden-badge { background: rgba(156,163,175,0.1); color: #6b7280; border: 1px solid rgba(156,163,175,0.2); }
        .page-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .page-btn-active {
          background: linear-gradient(135deg, #5C0A0A, #8B1A1A);
          color: white;
          border-color: transparent;
        }
        .page-btn-inactive {
          background: #fafaf7;
          color: #6b7280;
          border-color: rgba(212,175,55,0.2);
        }
        .page-btn-inactive:hover { background: rgba(212,175,55,0.08); color: #5C0A0A; border-color: rgba(212,175,55,0.4); }
        .gold-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(212,175,55,0.3), transparent);
        }
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
      `}</style>

      <AdminLayout title="Manage Products">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#D4AF37' }} />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search jewellery products..."
                className="gold-input" style={{ paddingLeft: '36px' }} />
            </div>
            <button type="submit" className="px-4 py-2.5 rounded-lg text-sm font-medium transition-all lux-inter"
              style={{ background: 'rgba(212,175,55,0.1)', color: '#B8960C', border: '1px solid rgba(212,175,55,0.25)' }}>
              Search
            </button>
          </form>
          <Link to="/admin/products/new" className="gold-btn-primary">
            <Plus size={16} /> Add Product
          </Link>
        </div>

        <div className="luxury-card overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-4">
              {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16" />)}
            </div>
          ) : products.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(212,175,55,0.08)' }}>
                <Gem size={28} style={{ color: '#D4AF37' }} />
              </div>
              <p className="cinzel font-medium text-lg" style={{ color: '#5C0A0A' }}>No products found</p>
              <Link to="/admin/products/new" className="lux-inter text-sm font-medium mt-3 inline-flex items-center gap-1.5 gold-btn-primary mx-auto" style={{ marginTop: '12px' }}>
                <Plus size={14} /> Add your first product
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full lux-inter text-sm">
                <thead>
                  <tr style={{ background: 'linear-gradient(to right, rgba(92,10,10,0.03), rgba(212,175,55,0.02))' }}>
                    <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#9b7b7b' }}>Product</th>
                    <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#9b7b7b' }}>SKU</th>
                    <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#9b7b7b' }}>Metal</th>
                    <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#9b7b7b' }}>Weight</th>
                    <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#9b7b7b' }}>Price</th>
                    <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#9b7b7b' }}>Status</th>
                    <th className="px-6 py-4 text-right text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#9b7b7b' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id} className="product-row">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-13 rounded-lg overflow-hidden flex-shrink-0" style={{ width: '44px', height: '52px', background: 'linear-gradient(135deg, #f7f3ee, #f0ebe3)', border: '1px solid rgba(212,175,55,0.15)' }}>
                            {p.images?.[0]?.url
                              ? <img src={p.images[0].url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Gem size={16} style={{ color: '#D4AF37', opacity: 0.5 }} /></div>
                            }
                          </div>
                          <div>
                            <p className="font-semibold line-clamp-1" style={{ color: '#3d0707', maxWidth: '180px' }}>{p.name}</p>
                            <p className="text-xs mt-0.5" style={{ color: '#b8a090' }}>{p.category?.name || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs" style={{ color: '#9b7b7b' }}>{p.sku || '—'}</td>
                      <td className="px-6 py-4 capitalize text-sm" style={{ color: '#5d4037' }}>{p.metalType} {p.purity}</td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#5d4037' }}>{p.netWeight}g</td>
                      <td className="px-6 py-4">
                        <span className="font-semibold" style={{ color: '#5C0A0A' }}>{formatPrice(p.pricing?.totalBeforeTax)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`status-badge ${p.isActive ? 'active-badge' : 'hidden-badge'}`}>
                          {p.isActive ? 'Active' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link to={`/admin/products/edit/${p._id}`} className="action-btn edit-btn" style={{ color: '#9ca3af' }}><Edit size={15} /></Link>
                          <button onClick={() => toggleActive(p._id, p.isActive)} className="action-btn toggle-btn" style={{ color: '#9ca3af' }}>
                            {p.isActive ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                          <button onClick={() => deleteProduct(p._id, p.name)} className="action-btn delete-btn" style={{ color: '#9ca3af' }}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {pagination.pages > 1 && (
            <div className="px-6 py-4 flex items-center justify-between" style={{ borderTop: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="lux-inter text-sm" style={{ color: '#b8a090' }}>
                Showing <span className="font-semibold" style={{ color: '#5C0A0A' }}>{products.length}</span> of {pagination.total} products
              </p>
              <div className="flex gap-1.5">
                {[...Array(pagination.pages)].map((_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)}
                    className={`page-btn ${pagination.page === i + 1 ? 'page-btn-active' : 'page-btn-inactive'}`}>
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