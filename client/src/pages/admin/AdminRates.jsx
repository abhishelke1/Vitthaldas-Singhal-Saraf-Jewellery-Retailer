import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Save, RefreshCw, TrendingUp, Zap } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminRates() {
  const [rates, setRates] = useState({ gold24K: 72000, gold22K: 66000, gold18K: 54000, silver999: 85000, silver925: 78000, platinum: 95000 });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchRates(); }, []);

  const fetchRates = () => {
    setLoading(true);
    api.get('/settings').then(({ data }) => {
      const r = data.data.metalRates;
      setRates({ gold24K: r.gold24K, gold22K: r.gold22K, gold18K: r.gold18K, silver999: r.silver999, silver925: r.silver925, platinum: r.platinum });
    }).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
  };

  const handleSave = async () => {
    setSaving(true);
    try { await api.put('/settings/rates', rates); toast.success('Rates updated!'); }
    catch { toast.error('Failed'); }
    finally { setSaving(false); }
  };

  const metalFields = [
    {
      group: 'Gold',
      icon: '✦',
      color: '#D4AF37',
      bgGradient: 'linear-gradient(135deg, #5C0A0A, #8B1A1A)',
      items: [
        { key: 'gold24K', label: '24 Karat', purity: '99.9%', desc: 'Per 10g' },
        { key: 'gold22K', label: '22 Karat', purity: '91.6%', desc: 'Per 10g' },
        { key: 'gold18K', label: '18 Karat', purity: '75.0%', desc: 'Per 10g' },
      ]
    },
    {
      group: 'Silver',
      icon: '◈',
      color: '#9ca3af',
      bgGradient: 'linear-gradient(135deg, #1a1a2e, #2a2a4e)',
      items: [
        { key: 'silver999', label: 'Silver 999', purity: '99.9%', desc: 'Per 1kg' },
        { key: 'silver925', label: 'Silver 925', purity: '92.5%', desc: 'Per 1kg' },
      ]
    },
    {
      group: 'Platinum',
      icon: '◉',
      color: '#a5b4fc',
      bgGradient: 'linear-gradient(135deg, #1e1b4b, #312e81)',
      items: [
        { key: 'platinum', label: 'Platinum', purity: '95.0%', desc: 'Per 10g' },
      ]
    }
  ];

  return (
    <>
      <Helmet><title>Metal Rates | Admin | VSS</title></Helmet>
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
        .rate-card {
          border-radius: 14px;
          padding: 20px;
          border: 1px solid rgba(255,255,255,0.08);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .rate-card::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -30%;
          width: 120px;
          height: 120px;
          background: rgba(255,255,255,0.04);
          border-radius: 50%;
        }
        .rate-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.2);
        }
        .rate-input {
          width: 100%;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 10px;
          padding: 10px 14px 10px 32px;
          font-size: 20px;
          font-weight: 700;
          color: white;
          outline: none;
          transition: all 0.2s;
          font-family: 'Inter', sans-serif;
          -moz-appearance: textfield;
        }
        .rate-input::-webkit-outer-spin-button,
        .rate-input::-webkit-inner-spin-button { -webkit-appearance: none; }
        .rate-input:focus {
          background: rgba(255,255,255,0.15);
          border-color: rgba(212,175,55,0.6);
          box-shadow: 0 0 0 3px rgba(212,175,55,0.15);
        }
        .rate-input::placeholder { color: rgba(255,255,255,0.4); }
        .group-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(212,175,55,0.15);
        }
        .btn-save {
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #5C0A0A, #8B1A1A);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 14px 32px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s;
          font-family: 'Inter', sans-serif;
          letter-spacing: 0.03em;
        }
        .btn-save:hover {
          background: linear-gradient(135deg, #D4AF37, #B8960C);
          box-shadow: 0 6px 24px rgba(212,175,55,0.35);
          transform: translateY(-2px);
        }
        .btn-save:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .refresh-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(212,175,55,0.1);
          border: 1px solid rgba(212,175,55,0.2);
          color: #B8960C;
          border-radius: 10px;
          padding: 8px 16px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .refresh-btn:hover { background: rgba(212,175,55,0.18); }
        .info-card {
          background: linear-gradient(135deg, rgba(212,175,55,0.06), rgba(212,175,55,0.03));
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 14px;
          padding: 20px 24px;
          margin-top: 24px;
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
      `}</style>

      <AdminLayout title="Manage Metal Rates">
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
            <div>
              <h2 className="cinzel text-xl font-semibold" style={{ color: '#5C0A0A' }}>Live Market Rates</h2>
              <p className="lux-inter text-sm mt-1" style={{ color: '#b8a090' }}>Changes reflect instantly across all product pricing</p>
            </div>
            <button onClick={fetchRates} className="refresh-btn">
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh Rates
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: '140px' }} />)}
            </div>
          ) : (
            <div className="luxury-card" style={{ padding: '28px' }}>
              {metalFields.map(({ group, icon, color, bgGradient, items }) => (
                <div key={group} style={{ marginBottom: '32px' }}>
                  <div className="group-header">
                    <span style={{ fontSize: '18px', color }}>{icon}</span>
                    <h3 className="cinzel font-semibold text-base" style={{ color: '#5C0A0A' }}>{group} Rates</h3>
                    <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, rgba(212,175,55,0.3), transparent)', marginLeft: '8px' }} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {items.map(({ key, label, purity, desc }) => (
                      <div key={key} className="rate-card" style={{ background: bgGradient }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                          <div>
                            <p className="cinzel text-sm font-semibold text-white">{label}</p>
                            <p className="lux-inter text-xs" style={{ color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>{purity} purity · {desc}</p>
                          </div>
                          <TrendingUp size={16} style={{ color: 'rgba(212,175,55,0.4)' }} />
                        </div>
                        <div style={{ position: 'relative' }}>
                          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(212,175,55,0.7)', fontWeight: 700, fontSize: '14px', fontFamily: 'Inter' }}>₹</span>
                          <input type="number" value={rates[key]}
                            onChange={e => setRates({ ...rates, [key]: Number(e.target.value) })}
                            className="rate-input" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Save Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '8px', borderTop: '1px solid rgba(212,175,55,0.12)' }}>
                <button onClick={handleSave} disabled={saving || loading} className="btn-save">
                  {saving
                    ? <><RefreshCw size={16} className="animate-spin" /> Saving...</>
                    : <><Save size={16} /> Publish Rates</>
                  }
                </button>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="info-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Zap size={15} style={{ color: '#D4AF37' }} />
              <h4 className="cinzel text-sm font-semibold" style={{ color: '#5C0A0A' }}>Dynamic Pricing Formula</h4>
            </div>
            <div className="lux-inter text-sm" style={{ color: '#7c5c5c', lineHeight: '1.8' }}>
              <p>• <strong>Base Price</strong> = Net Weight × (Metal Rate ÷ 10)</p>
              <p>• Making charges added based on product settings (flat, % or per gram)</p>
              <p>• Rate changes apply <strong>instantly</strong> to all dynamically-priced products</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}