import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Trash2, Upload, GripVertical, Eye, EyeOff, ImageIcon } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newBanner, setNewBanner] = useState({ title: '', subtitle: '', link: '/shop', image: null });

  const fetchBanners = () => {
    setLoading(true);
    api.get('/settings')
      .then(({ data }) => setBanners(data.data.banners || []))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBanners(); }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      fd.append('folder', 'vss/banners');
      const { data } = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setNewBanner(f => ({ ...f, image: { url: data.data.url, publicId: data.data.publicId } }));
      toast.success('Image uploaded');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const addBanner = async () => {
    if (!newBanner.title || !newBanner.image) { toast.error('Title and image are required'); return; }
    try {
      await api.post('/settings/banners', newBanner);
      toast.success('Banner added');
      setNewBanner({ title: '', subtitle: '', link: '/shop', image: null });
      fetchBanners();
    } catch { toast.error('Failed'); }
  };

  const deleteBanner = async (bannerId) => {
    if (!confirm('Delete this banner?')) return;
    try {
      await api.delete(`/settings/banners/${bannerId}`);
      toast.success('Banner deleted');
      fetchBanners();
    } catch { toast.error('Failed'); }
  };

  const toggleBanner = async (bannerId, currentActive) => {
    try {
      const updated = banners.map(b => b._id === bannerId ? { ...b, isActive: !currentActive } : b);
      await api.put('/settings/banners', { banners: updated });
      toast.success(currentActive ? 'Banner hidden' : 'Banner visible');
      fetchBanners();
    } catch { toast.error('Failed'); }
  };

  return (
    <>
      <Helmet><title>Banners | Admin | VSS</title></Helmet>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap');
        .cinzel { font-family: 'Cinzel', serif; }
        .cormorant { font-family: 'Cormorant Garamond', serif; }
        .lux-inter { font-family: 'Inter', sans-serif; }
        .luxury-card {
          background: #fff;
          border: 1px solid rgba(212,175,55,0.15);
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(92,10,10,0.06);
        }
        .form-section {
          background: linear-gradient(135deg, #fdfaf5, #fff9f0);
          border: 1px solid rgba(212,175,55,0.25);
          border-radius: 16px;
          padding: 28px;
          margin-bottom: 24px;
          box-shadow: 0 4px 20px rgba(212,175,55,0.08);
        }
        .gold-input {
          width: 100%;
          border: 1px solid rgba(212,175,55,0.25);
          border-radius: 10px;
          padding: 10px 16px;
          font-size: 13px;
          outline: none;
          transition: all 0.2s;
          background: #fff;
          font-family: 'Inter', sans-serif;
          color: #3d0707;
        }
        .gold-input:focus {
          border-color: #D4AF37;
          box-shadow: 0 0 0 3px rgba(212,175,55,0.12);
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
        .upload-zone {
          border: 2px dashed rgba(212,175,55,0.35);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          background: rgba(212,175,55,0.03);
          position: relative;
        }
        .upload-zone:hover {
          border-color: #D4AF37;
          background: rgba(212,175,55,0.07);
        }
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: linear-gradient(135deg, #5C0A0A, #8B1A1A);
          color: white;
          border: none;
          border-radius: 10px;
          padding: 10px 22px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s;
          font-family: 'Inter', sans-serif;
        }
        .btn-primary:hover {
          background: linear-gradient(135deg, #D4AF37, #B8960C);
          box-shadow: 0 4px 16px rgba(212,175,55,0.3);
          transform: translateY(-1px);
        }
        .banner-row {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(212,175,55,0.07);
          transition: background 0.2s;
        }
        .banner-row:last-child { border-bottom: none; }
        .banner-row:hover { background: rgba(212,175,55,0.03); }
        .banner-preview {
          width: 100px;
          height: 60px;
          border-radius: 10px;
          overflow: hidden;
          flex-shrink: 0;
          border: 1px solid rgba(212,175,55,0.15);
          background: linear-gradient(135deg, #f7f3ee, #f0ebe3);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .active-badge {
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          display: inline-flex;
          background: rgba(16,185,129,0.1);
          color: #047857;
          border: 1px solid rgba(16,185,129,0.2);
        }
        .hidden-badge {
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          display: inline-flex;
          background: rgba(156,163,175,0.1);
          color: #6b7280;
          border: 1px solid rgba(156,163,175,0.2);
        }
        .action-btn {
          width: 32px; height: 32px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s;
          border: none; background: transparent; color: #b8a090;
        }
        .toggle-btn:hover { background: rgba(212,175,55,0.1); color: #B8960C; }
        .delete-btn:hover { background: rgba(239,68,68,0.1); color: #ef4444; }
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

      <AdminLayout title="Manage Banners">
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>

          {/* Add New Banner */}
          <div className="form-section">
            <h3 className="cinzel text-sm font-semibold mb-1" style={{ color: '#5C0A0A' }}>✦ Add New Banner</h3>
            <p className="lux-inter text-xs mb-6" style={{ color: '#b8a090' }}>Upload a banner image and set its title, subtitle, and link.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="label-style">Title *</label>
                <input value={newBanner.title} onChange={e => setNewBanner(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Summer Bridal Collection" className="gold-input" />
              </div>
              <div>
                <label className="label-style">Subtitle</label>
                <input value={newBanner.subtitle} onChange={e => setNewBanner(f => ({ ...f, subtitle: e.target.value }))}
                  placeholder="Optional tagline" className="gold-input" />
              </div>
              <div>
                <label className="label-style">Link</label>
                <input value={newBanner.link} onChange={e => setNewBanner(f => ({ ...f, link: e.target.value }))}
                  className="gold-input" />
              </div>
              <div>
                <label className="label-style">Banner Image *</label>
                {newBanner.image?.url ? (
                  <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', height: '80px', border: '1px solid rgba(212,175,55,0.2)' }}>
                    <img src={newBanner.image.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <label className="lux-inter" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', color: '#D4AF37', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                      <Upload size={14} style={{ marginRight: '6px' }} /> Change
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                    </label>
                  </div>
                ) : (
                  <label className="upload-zone">
                    <Upload size={20} style={{ color: uploading ? '#D4AF37' : '#c9a96e', margin: '0 auto 6px' }} />
                    <p className="lux-inter text-xs font-medium" style={{ color: uploading ? '#D4AF37' : '#9b7b7b' }}>
                      {uploading ? 'Uploading...' : 'Click to upload banner image'}
                    </p>
                    <p className="lux-inter text-xs mt-1" style={{ color: '#c9a96e' }}>Recommended: 1920×600px</p>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                  </label>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button onClick={addBanner} className="btn-primary">
                <Plus size={15} /> Add Banner
              </button>
            </div>
          </div>

          {/* Banner List */}
          <div className="luxury-card overflow-hidden">
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(212,175,55,0.12)' }}>
              <h3 className="cinzel text-sm font-semibold" style={{ color: '#5C0A0A' }}>
                Current Banners
                <span className="lux-inter font-normal text-xs ml-2" style={{ color: '#b8a090' }}>({banners.length} total)</span>
              </h3>
            </div>

            {loading ? (
              <div style={{ padding: '24px' }}>
                {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: '80px', marginBottom: '12px' }} />)}
              </div>
            ) : banners.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(212,175,55,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <ImageIcon size={24} style={{ color: '#D4AF37' }} />
                </div>
                <p className="cinzel" style={{ color: '#5C0A0A', fontWeight: 600 }}>No banners yet</p>
                <p className="lux-inter text-xs mt-1" style={{ color: '#b8a090' }}>Add your first banner above</p>
              </div>
            ) : (
              banners.map((banner) => (
                <div key={banner._id} className="banner-row">
                  <GripVertical size={16} style={{ color: '#D4AF37', opacity: 0.5, cursor: 'grab', flexShrink: 0 }} />
                  <div className="banner-preview">
                    {banner.image?.url
                      ? <img src={banner.image.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <ImageIcon size={20} style={{ color: '#D4AF37', opacity: 0.4 }} />
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="lux-inter font-semibold text-sm" style={{ color: '#3d0707' }}>{banner.title}</p>
                    {banner.subtitle && <p className="lux-inter text-xs mt-0.5 line-clamp-1" style={{ color: '#b8a090' }}>{banner.subtitle}</p>}
                    <p className="lux-inter text-xs mt-0.5 font-mono" style={{ color: '#c9a96e' }}>{banner.link}</p>
                  </div>
                  <span className={banner.isActive ? 'active-badge' : 'hidden-badge'}>
                    {banner.isActive ? 'Live' : 'Hidden'}
                  </span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => toggleBanner(banner._id, banner.isActive)} className="action-btn toggle-btn">
                      {banner.isActive ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    <button onClick={() => deleteBanner(banner._id)} className="action-btn delete-btn">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </AdminLayout>
    </>
  );
}