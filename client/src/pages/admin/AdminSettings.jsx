import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Save, Loader2, MapPin, Phone, Mail, Globe, Settings, Truck, Info } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState(null);
  const [businessForm, setBusinessForm] = useState({
    phone: '', whatsapp: '', email: '', address: '', mapEmbedUrl: '',
  });
  const [taxForm, setTaxForm] = useState({ gstRate: 3, freeShippingThreshold: 50000, shippingCharges: 500 });

  useEffect(() => {
    api.get('/settings')
      .then(({ data }) => {
        const s = data.data;
        setSettings(s);
        setBusinessForm({
          phone: s.businessInfo?.phone || '',
          whatsapp: s.businessInfo?.whatsapp || '',
          email: s.businessInfo?.email || '',
          address: s.businessInfo?.address || '',
          mapEmbedUrl: s.businessInfo?.mapEmbedUrl || '',
        });
        setTaxForm({
          gstRate: s.gstRate || 3,
          freeShippingThreshold: s.freeShippingThreshold || 50000,
          shippingCharges: s.shippingCharges || 500,
        });
      })
      .catch(() => toast.error('Failed to load settings'))
      .finally(() => setLoading(false));
  }, []);

  const saveBusiness = async () => {
    setSaving(true);
    try {
      await api.put('/settings/business', businessForm);
      toast.success('Business info updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Helmet><title>Settings | Admin | VSS</title></Helmet>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:wght@400;600&family=Inter:wght@300;400;500;600&display=swap');
        .cinzel { font-family: 'Cinzel', serif; }
        .lux-inter { font-family: 'Inter', sans-serif; }
        .settings-card {
          background: #fff;
          border: 1px solid rgba(212,175,55,0.15);
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(92,10,10,0.05);
          overflow: hidden;
          margin-bottom: 24px;
        }
        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 28px;
          border-bottom: 1px solid rgba(212,175,55,0.1);
          background: linear-gradient(to right, rgba(92,10,10,0.025), transparent);
        }
        .card-header-icon {
          width: 36px; height: 36px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(212,175,55,0.1);
          flex-shrink: 0;
        }
        .card-body { padding: 24px 28px; }
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
          color: #3d0707;
        }
        .gold-input:focus {
          border-color: #D4AF37;
          box-shadow: 0 0 0 3px rgba(212,175,55,0.12);
          background: #fff;
        }
        .gold-textarea {
          width: 100%;
          border: 1px solid rgba(212,175,55,0.25);
          border-radius: 10px;
          padding: 10px 16px;
          font-size: 13px;
          outline: none;
          transition: all 0.2s;
          background: #fdfaf5;
          font-family: 'Inter', sans-serif;
          color: #3d0707;
          resize: vertical;
        }
        .gold-textarea:focus {
          border-color: #D4AF37;
          box-shadow: 0 0 0 3px rgba(212,175,55,0.12);
          background: #fff;
        }
        .label-style {
          display: block;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #9b7b7b;
          margin-bottom: 6px;
          font-family: 'Inter', sans-serif;
        }
        .icon-input-wrap {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #D4AF37;
          pointer-events: none;
        }
        .icon-gold-input {
          width: 100%;
          border: 1px solid rgba(212,175,55,0.25);
          border-radius: 10px;
          padding: 10px 16px 10px 38px;
          font-size: 13px;
          outline: none;
          transition: all 0.2s;
          background: #fdfaf5;
          font-family: 'Inter', sans-serif;
          color: #3d0707;
        }
        .icon-gold-input:focus {
          border-color: #D4AF37;
          box-shadow: 0 0 0 3px rgba(212,175,55,0.12);
          background: #fff;
        }
        .btn-save {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #5C0A0A, #8B1A1A);
          color: white;
          border: none;
          border-radius: 10px;
          padding: 12px 28px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s;
          font-family: 'Inter', sans-serif;
        }
        .btn-save:hover {
          background: linear-gradient(135deg, #D4AF37, #B8960C);
          box-shadow: 0 4px 16px rgba(212,175,55,0.3);
          transform: translateY(-1px);
        }
        .btn-save:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .number-input-wrap {
          position: relative;
        }
        .prefix {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 13px;
          font-weight: 600;
          color: #9b7b7b;
          pointer-events: none;
          font-family: 'Inter', sans-serif;
        }
        .number-gold-input {
          width: 100%;
          border: 1px solid rgba(212,175,55,0.25);
          border-radius: 10px;
          padding: 10px 16px 10px 28px;
          font-size: 13px;
          outline: none;
          transition: all 0.2s;
          background: #fdfaf5;
          font-family: 'Inter', sans-serif;
          color: #3d0707;
          -moz-appearance: textfield;
        }
        .number-gold-input::-webkit-outer-spin-button,
        .number-gold-input::-webkit-inner-spin-button { -webkit-appearance: none; }
        .number-gold-input:focus {
          border-color: #D4AF37;
          box-shadow: 0 0 0 3px rgba(212,175,55,0.12);
          background: #fff;
        }
        .info-note {
          background: linear-gradient(135deg, rgba(212,175,55,0.06), rgba(212,175,55,0.03));
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 14px;
          padding: 20px 24px;
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
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeIn 0.4s ease; }
      `}</style>

      <AdminLayout title="Store Settings">
        {loading ? (
          <div style={{ maxWidth: '780px', margin: '0 auto' }}>
            {[...Array(2)].map((_, i) => <div key={i} className="skeleton" style={{ height: '280px', marginBottom: '24px' }} />)}
          </div>
        ) : (
          <div style={{ maxWidth: '780px', margin: '0 auto' }} className="fade-in">

            {/* Business Info Card */}
            <div className="settings-card">
              <div className="card-header">
                <div className="card-header-icon">
                  <MapPin size={16} style={{ color: '#D4AF37' }} />
                </div>
                <div>
                  <h3 className="cinzel text-sm font-semibold" style={{ color: '#5C0A0A' }}>Business Information</h3>
                  <p className="lux-inter text-xs mt-0.5" style={{ color: '#b8a090' }}>Displayed on the website footer and contact page</p>
                </div>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="label-style">Phone Number</label>
                    <div className="icon-input-wrap">
                      <Phone size={13} className="input-icon" />
                      <input value={businessForm.phone}
                        onChange={e => setBusinessForm(f => ({ ...f, phone: e.target.value }))}
                        className="icon-gold-input" placeholder="+91 751 234 5678" />
                    </div>
                  </div>
                  <div>
                    <label className="label-style">WhatsApp Number</label>
                    <div className="icon-input-wrap">
                      <Phone size={13} className="input-icon" />
                      <input value={businessForm.whatsapp}
                        onChange={e => setBusinessForm(f => ({ ...f, whatsapp: e.target.value }))}
                        className="icon-gold-input" placeholder="+91 751 234 5678" />
                    </div>
                  </div>
                  <div>
                    <label className="label-style">Email Address</label>
                    <div className="icon-input-wrap">
                      <Mail size={13} className="input-icon" />
                      <input type="email" value={businessForm.email}
                        onChange={e => setBusinessForm(f => ({ ...f, email: e.target.value }))}
                        className="icon-gold-input" placeholder="info@vssaraf.com" />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="label-style">Store Address</label>
                    <textarea value={businessForm.address}
                      onChange={e => setBusinessForm(f => ({ ...f, address: e.target.value }))}
                      rows={2} className="gold-textarea"
                      placeholder="Sarafa Bazar, Lashkar, Gwalior..." />
                  </div>
                  <div className="md:col-span-2">
                    <label className="label-style">Google Maps Embed URL</label>
                    <div className="icon-input-wrap">
                      <Globe size={13} className="input-icon" />
                      <input value={businessForm.mapEmbedUrl}
                        onChange={e => setBusinessForm(f => ({ ...f, mapEmbedUrl: e.target.value }))}
                        className="icon-gold-input" placeholder="https://maps.google.com/embed?..." />
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                  <button onClick={saveBusiness} disabled={saving} className="btn-save">
                    {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                    {saving ? 'Saving...' : 'Save Business Info'}
                  </button>
                </div>
              </div>
            </div>

            {/* Tax & Shipping Card */}
            <div className="settings-card">
              <div className="card-header">
                <div className="card-header-icon">
                  <Truck size={16} style={{ color: '#D4AF37' }} />
                </div>
                <div>
                  <h3 className="cinzel text-sm font-semibold" style={{ color: '#5C0A0A' }}>Tax & Shipping Configuration</h3>
                  <p className="lux-inter text-xs mt-0.5" style={{ color: '#b8a090' }}>These values affect order totals across the platform</p>
                </div>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="label-style">GST Rate</label>
                    <div className="number-input-wrap">
                      <input type="number" step="0.5" min="0" max="100"
                        value={taxForm.gstRate}
                        onChange={e => setTaxForm(f => ({ ...f, gstRate: Number(e.target.value) }))}
                        className="number-gold-input" style={{ paddingLeft: '12px', paddingRight: '32px' }} />
                      <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9b7b7b', fontWeight: 600, fontSize: '13px', fontFamily: 'Inter' }}>%</span>
                    </div>
                    <p className="lux-inter text-xs mt-1.5" style={{ color: '#b8a090' }}>Typically 3% on gold jewellery</p>
                  </div>
                  <div>
                    <label className="label-style">Free Shipping Above</label>
                    <div className="number-input-wrap">
                      <span className="prefix">₹</span>
                      <input type="number" step="1000"
                        value={taxForm.freeShippingThreshold}
                        onChange={e => setTaxForm(f => ({ ...f, freeShippingThreshold: Number(e.target.value) }))}
                        className="number-gold-input" />
                    </div>
                  </div>
                  <div>
                    <label className="label-style">Standard Shipping Charge</label>
                    <div className="number-input-wrap">
                      <span className="prefix">₹</span>
                      <input type="number" step="50"
                        value={taxForm.shippingCharges}
                        onChange={e => setTaxForm(f => ({ ...f, shippingCharges: Number(e.target.value) }))}
                        className="number-gold-input" />
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                  <button
                    onClick={async () => {
                      setSaving(true);
                      try {
                        await api.put('/settings/rates', taxForm);
                        toast.success('Tax & shipping settings saved');
                      } catch (err) {
                        toast.error(err.response?.data?.message || 'Failed to save');
                      } finally {
                        setSaving(false);
                      }
                    }}
                    disabled={saving}
                    className="btn-save"
                  >
                    {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                    {saving ? 'Saving...' : 'Save Tax & Shipping'}
                  </button>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="info-note">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Info size={14} style={{ color: '#D4AF37' }} />
                <h4 className="cinzel text-xs font-semibold" style={{ color: '#5C0A0A' }}>Store Information Notes</h4>
              </div>
              <ul className="lux-inter text-xs space-y-1.5 list-disc" style={{ paddingLeft: '18px', color: '#7c5c5c', lineHeight: '1.7' }}>
                <li>Business info is displayed in the website footer and contact page.</li>
                <li>GST is charged on top of the product subtotal at checkout.</li>
                <li>Free shipping is automatically applied when order total exceeds the threshold.</li>
                <li>Metal rates are managed separately under <strong>Metal Rates</strong>.</li>
              </ul>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
}