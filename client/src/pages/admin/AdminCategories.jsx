import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Edit, Trash2, Save, X, Upload, Gem, FolderOpen } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', image: null });
  const [saving, setSaving] = useState(false);

  const fetchCategories = () => {
    setLoading(true);
    api.get('/categories')
      .then(({ data }) => setCategories(data.data || []))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const startEdit = (cat) => {
    setEditing(cat ? cat._id : 'new');
    setForm(cat ? { name: cat.name, description: cat.description || '', image: cat.image || null } : { name: '', description: '', image: null });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append('image', file);
      fd.append('folder', 'vss/categories');
      const { data } = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm(f => ({ ...f, image: { url: data.data.url, publicId: data.data.publicId } }));
    } catch { toast.error('Upload failed'); }
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      if (editing === 'new') {
        await api.post('/categories', form);
        toast.success('Category created');
      } else {
        await api.put(`/categories/${editing}`, form);
        toast.success('Category updated');
      }
      setEditing(null);
      fetchCategories();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try { await api.delete(`/categories/${id}`); toast.success('Deleted'); fetchCategories(); }
    catch { toast.error('Failed'); }
  };

  return (
    <>
      <Helmet><title>Categories | Admin | VSS</title></Helmet>
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
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 7px;
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
        }
        .btn-primary:hover {
          background: linear-gradient(135deg, #D4AF37, #B8960C);
          box-shadow: 0 4px 16px rgba(212,175,55,0.3);
          transform: translateY(-1px);
        }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .btn-cancel {
          padding: 9px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid rgba(212,175,55,0.2);
          background: transparent;
          color: #7c5c5c;
          transition: all 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .btn-cancel:hover { background: rgba(212,175,55,0.06); }
        .form-card {
          background: linear-gradient(135deg, #fdfaf5, #fff9f0);
          border: 1px solid rgba(212,175,55,0.25);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 20px;
          box-shadow: 0 4px 20px rgba(212,175,55,0.08);
        }
        .cat-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          transition: background 0.2s;
          border-bottom: 1px solid rgba(212,175,55,0.07);
        }
        .cat-row:last-child { border-bottom: none; }
        .cat-row:hover { background: rgba(212,175,55,0.03); }
        .cat-img-wrap {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          overflow: hidden;
          flex-shrink: 0;
          background: linear-gradient(135deg, #f7f3ee, #f0ebe3);
          border: 1px solid rgba(212,175,55,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .action-btn {
          width: 32px; height: 32px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s;
          border: none; background: transparent;
          color: #b8a090;
        }
        .edit-btn:hover { background: rgba(59,130,246,0.1); color: #3b82f6; }
        .delete-btn:hover { background: rgba(239,68,68,0.1); color: #ef4444; }
        .upload-label {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          color: #B8960C;
          font-family: 'Inter', sans-serif;
          transition: color 0.2s;
        }
        .upload-label:hover { color: #5C0A0A; }
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
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .slide-down { animation: slideDown 0.25s ease; }
      `}</style>

      <AdminLayout title="Manage Categories">
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="cinzel text-lg font-semibold" style={{ color: '#5C0A0A' }}>Jewellery Categories</h2>
              <p className="lux-inter text-xs mt-0.5" style={{ color: '#b8a090' }}>{categories.length} categories configured</p>
            </div>
            <button onClick={() => startEdit(null)} className="btn-primary">
              <Plus size={15} /> Add Category
            </button>
          </div>

          {/* Edit/Create Form */}
          {editing && (
            <div className="form-card slide-down">
              <h4 className="cinzel text-sm font-semibold mb-5" style={{ color: '#5C0A0A' }}>
                {editing === 'new' ? '✦ New Category' : '✦ Edit Category'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-style">Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="gold-input" placeholder="e.g. Bridal Necklaces" />
                </div>
                <div>
                  <label className="label-style">Description</label>
                  <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    className="gold-input" placeholder="Optional description" />
                </div>
                <div>
                  <label className="label-style">Category Image</label>
                  <div className="flex items-center gap-3 mt-1">
                    {form.image?.url && (
                      <div style={{ width: '48px', height: '48px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(212,175,55,0.2)' }}>
                        <img src={form.image.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <label className="upload-label">
                      <Upload size={14} />
                      {form.image?.url ? 'Change Image' : 'Upload Image'}
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setEditing(null)} className="btn-cancel">
                  <X size={13} style={{ display: 'inline', marginRight: '4px' }} />Cancel
                </button>
                <button onClick={handleSave} disabled={saving} className="btn-primary">
                  <Save size={14} /> {saving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </div>
          )}

          {/* Category List */}
          <div className="luxury-card overflow-hidden">
            {loading ? (
              <div style={{ padding: '24px' }}>
                {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: '60px', marginBottom: '12px' }} />)}
              </div>
            ) : categories.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(212,175,55,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <FolderOpen size={24} style={{ color: '#D4AF37' }} />
                </div>
                <p className="cinzel" style={{ color: '#5C0A0A', fontWeight: 600 }}>No categories yet</p>
                <p className="lux-inter text-xs mt-1" style={{ color: '#b8a090' }}>Add categories to organise your jewellery collection</p>
              </div>
            ) : (
              categories.map(cat => (
                <div key={cat._id} className="cat-row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div className="cat-img-wrap">
                      {cat.image?.url
                        ? <img src={cat.image.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <Gem size={16} style={{ color: '#D4AF37', opacity: 0.6 }} />
                      }
                    </div>
                    <div>
                      <p className="lux-inter font-semibold text-sm" style={{ color: '#3d0707' }}>{cat.name}</p>
                      {cat.description && <p className="lux-inter text-xs mt-0.5 line-clamp-1" style={{ color: '#b8a090', maxWidth: '300px' }}>{cat.description}</p>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => startEdit(cat)} className="action-btn edit-btn"><Edit size={15} /></button>
                    <button onClick={() => handleDelete(cat._id, cat.name)} className="action-btn delete-btn"><Trash2 size={15} /></button>
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