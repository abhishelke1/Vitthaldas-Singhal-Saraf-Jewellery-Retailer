import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Save, Upload, X, Plus, Trash2, AlertCircle, Loader2,
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';
import { formatPrice } from '../../utils/helpers';
import toast from 'react-hot-toast';

/* ─── empty state ─── */
const emptyForm = {
  name: '', description: '', category: '', metalType: 'gold', purity: '22K',
  grossWeight: '', netWeight: '', pricingType: 'dynamic', fixedPrice: '',
  makingCharges: '', makingChargeType: 'per_gram', stoneCharges: '',
  occasion: [], gender: 'women', isFeatured: false, isActive: true,
  tags: '', variants: [], images: [],
};

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm]                     = useState(emptyForm);
  const [categories, setCategories]         = useState([]);
  const [catLoading, setCatLoading]         = useState(true);
  const [catError, setCatError]             = useState(false);
  const [saving, setSaving]                 = useState(false);
  const [uploading, setUploading]           = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [errors, setErrors]                 = useState({});

  /* ── fetch categories ── */
  useEffect(() => {
    setCatLoading(true); setCatError(false);
    api.get('/categories')
      .then(({ data }) => {
        setCategories(data.data || []);
        if (!data.data?.length) setCatError(true);
      })
      .catch(() => { setCatError(true); setCategories([]); })
      .finally(() => setCatLoading(false));
  }, []);

  /* ── fetch product for edit ── */
  useEffect(() => {
    if (!isEdit) return;
    setLoadingProduct(true);
    api.get(`/products/admin/${id}`)
      .then(({ data }) => {
        const p = data.data;
        if (p) setForm({
          name: p.name || '', description: p.description || '',
          category: p.category?._id || p.category || '',
          metalType: p.metalType || 'gold', purity: p.purity || '22K',
          grossWeight: p.grossWeight || '', netWeight: p.netWeight || '',
          pricingType: p.pricingType || 'dynamic', fixedPrice: p.fixedPrice || '',
          makingCharges: p.makingCharges || '', makingChargeType: p.makingChargeType || 'per_gram',
          stoneCharges: p.stoneCharges || '', occasion: p.occasion || [],
          gender: p.gender || 'women', isFeatured: p.isFeatured || false,
          isActive: p.isActive !== false,
          tags: (p.tags || []).join(', '),
          variants: p.variants || [], images: p.images || [],
        });
      })
      .catch(() => toast.error('Failed to load product'))
      .finally(() => setLoadingProduct(false));
  }, [id, isEdit]);

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Product name is required';
    if (!form.category)    errs.category = 'Please select a category';
    if (form.pricingType === 'dynamic' && !form.netWeight && form.variants.length === 0)
      errs.netWeight = 'Net weight required for dynamic pricing';
    if (form.pricingType === 'fixed' && !form.fixedPrice)
      errs.fixedPrice = 'Fixed price is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append('image', file);
        fd.append('folder', 'vss/products');
        const { data } = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        setForm(f => ({
          ...f,
          images: [...f.images, { url: data.data.url, publicId: data.data.publicId, alt: f.name }],
        }));
      }
      toast.success('Images uploaded');
    } catch { toast.error('Upload failed — check Cloudinary config'); }
    finally { setUploading(false); }
  };

  const removeImage   = (idx) => setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  const addVariant    = () => setForm(f => ({ ...f, variants: [...f.variants, { size: '', grossWeight: '', netWeight: '', sku: '', stock: 1 }] }));
  const updateVariant = (idx, key, val) => setForm(f => ({ ...f, variants: f.variants.map((v, i) => i === idx ? { ...v, [key]: val } : v) }));
  const removeVariant = (idx) => setForm(f => ({ ...f, variants: f.variants.filter((_, i) => i !== idx) }));

  const estimatedPrice = (() => {
    if (form.pricingType === 'fixed') return Number(form.fixedPrice) || 0;
    const weight = Number(form.netWeight) || 0;
    if (!weight) return 0;
    const rates = { gold: { '24K': 72000, '22K': 66000, '18K': 54000 }, silver: { '999': 85000, '925': 78000 } };
    const rate = ((rates[form.metalType] || {})[form.purity] || 0) / 10;
    const metalVal = weight * rate;
    let making = 0;
    if (form.makingChargeType === 'flat') making = Number(form.makingCharges) || 0;
    else if (form.makingChargeType === 'percentage') making = (metalVal * (Number(form.makingCharges) || 0)) / 100;
    else making = (Number(form.makingCharges) || 0) * weight;
    return Math.round(metalVal + making + (Number(form.stoneCharges) || 0));
  })();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) { toast.error('Please fix the errors below'); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        grossWeight:   Number(form.grossWeight)   || 0,
        netWeight:     Number(form.netWeight)     || 0,
        makingCharges: Number(form.makingCharges) || 0,
        stoneCharges:  Number(form.stoneCharges)  || 0,
        fixedPrice:    Number(form.fixedPrice)    || 0,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        variants: form.variants.map(v => ({
          ...v,
          grossWeight: Number(v.grossWeight) || 0,
          netWeight:   Number(v.netWeight)   || 0,
          stock:       Number(v.stock)       || 1,
        })),
      };
      if (isEdit) { await api.put(`/products/${id}`, payload); toast.success('Product updated!'); }
      else         { await api.post('/products', payload);      toast.success('Product created!'); }
      navigate('/admin/products');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save product'); }
    finally { setSaving(false); }
  };

  /* ════════════ micro-components ════════════ */
  const Label = ({ children, required }) => (
    <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#6B5B4E', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6 }}>
      {children}{required && <span style={{ color:'#C0392B', marginLeft:2 }}>*</span>}
    </label>
  );

  const inp = (hasErr) => ({
    width:'100%', boxSizing:'border-box',
    border:`1px solid ${hasErr ? '#e57373' : '#E2D9D0'}`,
    borderRadius:8, padding:'9px 12px',
    fontSize:13, color:'#2C1810',
    background: hasErr ? '#fff8f8' : '#fff',
    outline:'none', fontFamily:'inherit',
    transition:'border-color .15s, box-shadow .15s',
  });

  const ErrMsg = ({ msg }) => msg
    ? <p style={{ color:'#C0392B', fontSize:11, marginTop:4, display:'flex', alignItems:'center', gap:3, margin:'4px 0 0' }}>
        <AlertCircle size={11}/>{msg}
      </p>
    : null;

  const Card = ({ title, children, action }) => (
    <div style={{ background:'#fff', border:'1px solid #EDE5DC', borderRadius:12, marginBottom:20, overflow:'hidden' }}>
      <div style={{ padding:'13px 20px', borderBottom:'1px solid #EDE5DC', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ fontSize:12, fontWeight:700, color:'#5C0A0A', textTransform:'uppercase', letterSpacing:'.1em' }}>{title}</span>
        {action}
      </div>
      <div style={{ padding:20 }}>{children}</div>
    </div>
  );

  const Toggle = ({ checked, onChange }) => (
    <div
      onClick={onChange}
      style={{ width:36, height:20, borderRadius:10, background: checked ? '#B8960C' : '#E2D9D0', cursor:'pointer', transition:'background .2s', position:'relative', flexShrink:0 }}
    >
      <div style={{ position:'absolute', top:3, left: checked ? 18 : 3, width:14, height:14, borderRadius:'50%', background:'#fff', transition:'left .2s', boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }}/>
    </div>
  );

  if (loadingProduct) return (
    <>
      <Helmet><title>Loading... | Admin</title></Helmet>
      <AdminLayout title="Loading Product...">
        {[...Array(3)].map((_, i) => (
          <div key={i} style={{ height:160, borderRadius:12, marginBottom:20, background:'linear-gradient(90deg,#f7f3ef 25%,#ede8e2 50%,#f7f3ef 75%)', backgroundSize:'1000px 100%', animation:'shimmer 2s infinite' }}/>
        ))}
      </AdminLayout>
    </>
  );

  return (
    <>
      <Helmet><title>{isEdit ? 'Edit' : 'New'} Product | Admin</title></Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Lato:wght@400;500;600;700&display=swap');
        @keyframes shimmer { 0%{background-position:-1000px 0}100%{background-position:1000px 0} }
        @keyframes spin    { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }
        *{box-sizing:border-box;}
        .pf-inp:focus   { border-color:#B8960C!important; box-shadow:0 0 0 3px rgba(184,150,12,.1)!important; outline:none; }
        .pf-inp.err:focus { border-color:#e57373!important; box-shadow:0 0 0 3px rgba(229,115,115,.12)!important; }
        .pf-sel         { appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B5B4E' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 12px center; padding-right:34px!important; cursor:pointer; }
        .pf-sel:focus   { border-color:#B8960C!important; box-shadow:0 0 0 3px rgba(184,150,12,.1)!important; outline:none; }
        .occ-pill       { border:1px solid #E2D9D0; background:#fff; color:#6B5B4E; border-radius:20px; padding:5px 13px; font-size:12px; font-weight:500; cursor:pointer; transition:all .15s; text-transform:capitalize; font-family:inherit; }
        .occ-pill:hover { border-color:#B8960C; color:#8B6914; background:rgba(184,150,12,.04); }
        .occ-pill.on    { background:rgba(184,150,12,.1); border-color:#B8960C; color:#7a5c10; font-weight:600; }
        .img-t          { position:relative; width:72px; height:80px; border-radius:8px; overflow:hidden; border:1px solid #E2D9D0; flex-shrink:0; }
        .img-t .rmv     { position:absolute; top:3px; right:3px; width:18px; height:18px; border-radius:50%; background:rgba(192,57,43,.85); border:none; color:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; opacity:0; transition:opacity .15s; padding:0; }
        .img-t:hover .rmv { opacity:1; }
        .upz            { border:1.5px dashed #C9B48C; border-radius:10px; padding:24px 16px; text-align:center; cursor:pointer; transition:background .15s,border-color .15s; background:#FDFAF5; display:block; }
        .upz:hover      { background:rgba(184,150,12,.04); border-color:#B8960C; }
        .var-row        { display:grid; grid-template-columns:1fr 1fr 1fr 74px 34px; gap:10px; align-items:end; background:#FAFAF7; border:1px solid #EDE5DC; border-radius:8px; padding:12px 14px; }
        .btn-add-var    { background:rgba(184,150,12,.08); border:1px solid rgba(184,150,12,.3); color:#8B6914; border-radius:7px; padding:6px 13px; font-size:12px; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:5px; font-family:inherit; transition:background .15s; }
        .btn-add-var:hover { background:rgba(184,150,12,.15); }
        .btn-del-var    { width:32px; height:32px; border-radius:7px; background:rgba(192,57,43,.07); border:none; color:#C0392B; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .15s; align-self:flex-end; padding:0; }
        .btn-del-var:hover { background:rgba(192,57,43,.15); }
        .act-btn        { display:inline-flex; align-items:center; gap:7px; border-radius:8px; padding:9px 20px; font-size:13px; font-weight:600; cursor:pointer; border:none; font-family:inherit; transition:all .15s; letter-spacing:.03em; }
        .btn-cancel     { background:#fff; border:1px solid #E2D9D0!important; color:#6B5B4E; }
        .btn-cancel:hover { background:#F7F2EC; }
        .btn-save       { background:linear-gradient(135deg,#5C0A0A 0%,#7A1212 100%); color:#fff; box-shadow:0 2px 10px rgba(92,10,10,.22); border:none!important; }
        .btn-save:hover:not(:disabled) { filter:brightness(1.1); box-shadow:0 4px 16px rgba(92,10,10,.3); transform:translateY(-1px); }
        .btn-save:disabled { opacity:.5; cursor:not-allowed; }
      `}</style>

      <AdminLayout title={isEdit ? 'Edit Product' : 'New Product'}>
        <form onSubmit={handleSubmit} style={{ fontFamily:"'Lato',sans-serif" }}>

          {/* ─── page header ─── */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24 }}>
            <div>
              <h1 style={{ margin:0, fontSize:22, fontWeight:700, fontFamily:"'Cinzel',serif", color:'#2C1810' }}>
                {isEdit ? 'Edit Product' : 'Add New Product'}
              </h1>
              <p style={{ margin:'5px 0 0', fontSize:13, color:'#9B8070' }}>
                {isEdit ? 'Update product details, pricing and images' : 'Fill in the details to list a new jewellery product'}
              </p>
            </div>
            <div style={{ display:'flex', gap:10, flexShrink:0 }}>
              <button type="button" onClick={() => navigate('/admin/products')} className="act-btn btn-cancel">Cancel</button>
              <button type="submit" disabled={saving} className="act-btn btn-save">
                {saving ? <Loader2 size={14} style={{ animation:'spin 1s linear infinite' }}/> : <Save size={14}/>}
                {saving ? 'Saving…' : isEdit ? 'Update Product' : '+ Add Product'}
              </button>
            </div>
          </div>

          {/* ─── two-column grid ─── */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 296px', gap:20, alignItems:'start' }}>

            {/* ══ LEFT COLUMN ══ */}
            <div>

              {/* Basic Info */}
              <Card title="Basic Information">
                <div style={{ display:'grid', gap:16 }}>
                  <div>
                    <Label required>Product Name</Label>
                    <input value={form.name} onChange={e=>set('name',e.target.value)}
                      placeholder="e.g. Traditional Gold Necklace"
                      className={`pf-inp${errors.name?' err':''}`} style={inp(errors.name)}/>
                    <ErrMsg msg={errors.name}/>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <textarea value={form.description} onChange={e=>set('description',e.target.value)}
                      rows={3} placeholder="Describe the product — materials, craftsmanship, occasions…"
                      className="pf-inp" style={{ ...inp(false), resize:'vertical', minHeight:88, lineHeight:1.55 }}/>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                    <div>
                      <Label required>Category</Label>
                      {catLoading ? (
                        <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:'#9B8070', padding:'9px 0' }}>
                          <Loader2 size={13} style={{ animation:'spin 1s linear infinite' }}/> Loading categories…
                        </div>
                      ) : catError && !categories.length ? (
                        <div style={{ background:'#FFFBEB', border:'1px solid #FCD34D', borderRadius:8, padding:'10px 12px', fontSize:12, color:'#92400E' }}>
                          No categories. <a href="/admin/categories" style={{ textDecoration:'underline', fontWeight:600 }}>Create one →</a>
                        </div>
                      ) : (
                        <>
                          <select value={form.category} onChange={e=>set('category',e.target.value)}
                            className={`pf-inp pf-sel${errors.category?' err':''}`} style={inp(errors.category)}>
                            <option value="">Select category</option>
                            {categories.map(c=><option key={c._id} value={c._id}>{c.name}</option>)}
                          </select>
                          <ErrMsg msg={errors.category}/>
                        </>
                      )}
                    </div>
                    <div>
                      <Label>Gender</Label>
                      <select value={form.gender} onChange={e=>set('gender',e.target.value)} className="pf-inp pf-sel" style={inp(false)}>
                        <option value="women">Women</option>
                        <option value="men">Men</option>
                        <option value="unisex">Unisex</option>
                        <option value="kids">Kids</option>
                      </select>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Metal & Weight */}
              <Card title="Metal & Weight">
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:14 }}>
                  <div>
                    <Label>Metal Type</Label>
                    <select value={form.metalType} onChange={e=>set('metalType',e.target.value)} className="pf-inp pf-sel" style={inp(false)}>
                      <option value="gold">Gold</option>
                      <option value="silver">Silver</option>
                      <option value="platinum">Platinum</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <Label>Purity</Label>
                    <select value={form.purity} onChange={e=>set('purity',e.target.value)} className="pf-inp pf-sel" style={inp(false)}>
                      {form.metalType==='gold'     && <><option value="24K">24K</option><option value="22K">22K</option><option value="18K">18K</option><option value="14K">14K</option><option value="916">916</option></>}
                      {form.metalType==='silver'   && <><option value="999">999</option><option value="925">925</option></>}
                      {form.metalType==='platinum' && <option value="other">Platinum</option>}
                      {form.metalType==='other'    && <option value="other">Other</option>}
                    </select>
                  </div>
                  <div>
                    <Label>Gross Weight (g)</Label>
                    <input type="number" step="0.01" value={form.grossWeight} onChange={e=>set('grossWeight',e.target.value)}
                      placeholder="0.00" className="pf-inp" style={inp(false)}/>
                  </div>
                  <div>
                    <Label required>Net Weight (g)</Label>
                    <input type="number" step="0.01" value={form.netWeight} onChange={e=>set('netWeight',e.target.value)}
                      placeholder="0.00" className={`pf-inp${errors.netWeight?' err':''}`} style={inp(errors.netWeight)}/>
                    <ErrMsg msg={errors.netWeight}/>
                  </div>
                </div>
              </Card>

              {/* Pricing */}
              <Card title="Pricing">
                <div style={{ display:'grid', gridTemplateColumns:`repeat(${form.pricingType==='fixed'?4:3},1fr)`, gap:14 }}>
                  <div>
                    <Label>Pricing Type</Label>
                    <select value={form.pricingType} onChange={e=>set('pricingType',e.target.value)} className="pf-inp pf-sel" style={inp(false)}>
                      <option value="dynamic">Dynamic (Weight × Rate)</option>
                      <option value="fixed">Fixed Price</option>
                    </select>
                  </div>
                  {form.pricingType==='fixed' && (
                    <div>
                      <Label required>Fixed Price (₹)</Label>
                      <input type="number" value={form.fixedPrice} onChange={e=>set('fixedPrice',e.target.value)}
                        placeholder="0" className={`pf-inp${errors.fixedPrice?' err':''}`} style={inp(errors.fixedPrice)}/>
                      <ErrMsg msg={errors.fixedPrice}/>
                    </div>
                  )}
                  <div>
                    <Label>Making Charges</Label>
                    <input type="number" step="0.01" value={form.makingCharges} onChange={e=>set('makingCharges',e.target.value)}
                      placeholder="0" className="pf-inp" style={inp(false)}/>
                  </div>
                  <div>
                    <Label>Making Charge Type</Label>
                    <select value={form.makingChargeType} onChange={e=>set('makingChargeType',e.target.value)} className="pf-inp pf-sel" style={inp(false)}>
                      <option value="per_gram">Per Gram (₹/g)</option>
                      <option value="flat">Flat (₹)</option>
                      <option value="percentage">Percentage (%)</option>
                    </select>
                  </div>
                  <div>
                    <Label>Stone Charges (₹)</Label>
                    <input type="number" value={form.stoneCharges} onChange={e=>set('stoneCharges',e.target.value)}
                      placeholder="0" className="pf-inp" style={inp(false)}/>
                  </div>
                </div>
                {form.pricingType==='dynamic' && (
                  <div style={{ marginTop:14, background:'rgba(59,130,246,.05)', border:'1px solid rgba(59,130,246,.15)', borderRadius:8, padding:'10px 14px', fontSize:12, color:'#1d4ed8' }}>
                    <strong>Formula:</strong> (Net Weight × Metal Rate per gram) + Making Charges + Stone Charges
                  </div>
                )}
              </Card>

              {/* Variants */}
              <Card
                title="Variants / Sizes"
                action={
                  <button type="button" onClick={addVariant} className="btn-add-var">
                    <Plus size={13}/> Add Variant
                  </button>
                }
              >
                {form.variants.length===0 ? (
                  <p style={{ fontSize:13, color:'#9B8070', textAlign:'center', padding:'12px 0', margin:0 }}>
                    No variants yet. Add size variants for rings, bangles, etc.
                  </p>
                ) : (
                  <>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 74px 34px', gap:10, padding:'0 14px 8px', fontSize:10, fontWeight:700, color:'#9B8070', textTransform:'uppercase', letterSpacing:'.08em' }}>
                      <span>Size</span><span>Gross Wt (g)</span><span>Net Wt (g)</span><span>Stock</span><span/>
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                      {form.variants.map((v,i) => (
                        <div key={i} className="var-row">
                          <input value={v.size} onChange={e=>updateVariant(i,'size',e.target.value)} placeholder="e.g. 12" className="pf-inp" style={inp(false)}/>
                          <input type="number" step="0.01" value={v.grossWeight} onChange={e=>updateVariant(i,'grossWeight',e.target.value)} className="pf-inp" style={inp(false)}/>
                          <input type="number" step="0.01" value={v.netWeight}   onChange={e=>updateVariant(i,'netWeight',  e.target.value)} className="pf-inp" style={inp(false)}/>
                          <input type="number"             value={v.stock}       onChange={e=>updateVariant(i,'stock',      e.target.value)} className="pf-inp" style={inp(false)}/>
                          <button type="button" onClick={()=>removeVariant(i)} className="btn-del-var"><Trash2 size={13}/></button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </Card>

              {/* Additional */}
              <Card title="Additional Details">
                <div style={{ display:'grid', gap:18 }}>
                  <div>
                    <Label>Occasions</Label>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:4 }}>
                      {['wedding','daily-wear','festive','engagement','gift','office'].map(o => (
                        <button key={o} type="button"
                          className={`occ-pill${form.occasion.includes(o)?' on':''}`}
                          onClick={()=>set('occasion', form.occasion.includes(o) ? form.occasion.filter(x=>x!==o) : [...form.occasion,o])}>
                          {o.replace('-',' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Tags</Label>
                    <input value={form.tags} onChange={e=>set('tags',e.target.value)}
                      placeholder="necklace, bridal, kundan  (comma separated)"
                      className="pf-inp" style={inp(false)}/>
                  </div>
                </div>
              </Card>

            </div>

            {/* ══ RIGHT SIDEBAR ══ */}
            <div style={{ position:'sticky', top:24, display:'flex', flexDirection:'column', gap:16 }}>

              {/* Estimated Price card */}
              <div style={{ background:'linear-gradient(135deg,#5C0A0A 0%,#7A1212 100%)', borderRadius:12, padding:'20px 20px 18px', color:'#fff', overflow:'hidden', position:'relative' }}>
                <div style={{ position:'absolute', top:-24, right:-24, width:90, height:90, borderRadius:'50%', background:'rgba(255,255,255,0.04)' }}/>
                <div style={{ position:'absolute', bottom:-28, left:-10, width:70, height:70, borderRadius:'50%', background:'rgba(184,150,12,0.12)' }}/>
                <p style={{ margin:'0 0 3px', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'rgba(255,255,255,.55)' }}>Estimated Price</p>
                <p style={{ margin:'0 0 5px', fontSize:32, fontWeight:700, fontFamily:"'Cinzel',serif", color: estimatedPrice>0 ? '#F5D978' : 'rgba(255,255,255,.3)', lineHeight:1.15 }}>
                  ₹{estimatedPrice>0 ? estimatedPrice.toLocaleString('en-IN') : '0'}
                </p>
                <p style={{ margin:0, fontSize:11, color:'rgba(255,255,255,.4)', lineHeight:1.5 }}>
                  Based on current weight &amp; metal rates
                </p>
              </div>

              {/* Images card */}
              <div style={{ background:'#fff', border:'1px solid #EDE5DC', borderRadius:12, overflow:'hidden' }}>
                <div style={{ padding:'13px 16px', borderBottom:'1px solid #EDE5DC' }}>
                  <span style={{ fontSize:12, fontWeight:700, color:'#5C0A0A', textTransform:'uppercase', letterSpacing:'.1em' }}>Product Images</span>
                </div>
                <div style={{ padding:16 }}>

                  {form.images.length>0 && (
                    <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:14 }}>
                      {form.images.map((img,i) => (
                        <div key={i} className="img-t">
                          <img src={img.url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                          <button type="button" className="rmv" onClick={()=>removeImage(i)}><X size={9}/></button>
                          {i===0 && (
                            <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'linear-gradient(90deg,#B8960C,#D4AF37)', fontSize:7, textAlign:'center', padding:'2px 0', fontWeight:700, color:'#fff', letterSpacing:'.08em', textTransform:'uppercase' }}>Primary</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <label className="upz" style={{ opacity: uploading ? .6 : 1, cursor: uploading ? 'not-allowed' : 'pointer' }}>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
                      {uploading
                        ? <Loader2 size={22} color="#B8960C" style={{ animation:'spin 1s linear infinite' }}/>
                        : <Upload size={22} color="#B8960C"/>}
                      <span style={{ fontSize:13, fontWeight:600, color:'#5C0A0A' }}>
                        {uploading ? 'Uploading…' : 'Click to upload or drag & drop'}
                      </span>
                      <span style={{ fontSize:11, color:'#9B8070' }}>PNG, JPG, WEBP up to 5MB</span>
                    </div>
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display:'none' }} disabled={uploading}/>
                  </label>

                  <div style={{ marginTop:12, display:'flex', flexDirection:'column', gap:5 }}>
                    {['Upload high quality images of your product.','First image will be the featured image.'].map((tip,i) => (
                      <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:6, fontSize:11, color:'#9B8070' }}>
                        <div style={{ width:5, height:5, borderRadius:'50%', background:'#B8960C', marginTop:4, flexShrink:0 }}/>
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status toggles */}
              <div style={{ background:'#fff', border:'1px solid #EDE5DC', borderRadius:12, overflow:'hidden' }}>
                <div style={{ padding:'13px 16px', borderBottom:'1px solid #EDE5DC' }}>
                  <span style={{ fontSize:12, fontWeight:700, color:'#5C0A0A', textTransform:'uppercase', letterSpacing:'.1em' }}>Visibility</span>
                </div>
                <div style={{ padding:'14px 16px', display:'flex', flexDirection:'column', gap:14 }}>
                  {[
                    { label:'Featured Product', key:'isFeatured', color:'#B8960C' },
                    { label:'Active (Visible on store)', key:'isActive', color:'#16a34a' },
                  ].map(({ label, key, color }) => (
                    <div key={key} style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <span style={{ fontSize:13, color:'#2C1810', fontWeight:500 }}>{label}</span>
                      <div
                        onClick={() => set(key, !form[key])}
                        style={{ width:36, height:20, borderRadius:10, background: form[key] ? color : '#E2D9D0', cursor:'pointer', transition:'background .2s', position:'relative', flexShrink:0 }}
                      >
                        <div style={{ position:'absolute', top:3, left: form[key] ? 18 : 3, width:14, height:14, borderRadius:'50%', background:'#fff', transition:'left .2s', boxShadow:'0 1px 3px rgba(0,0,0,.2)' }}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* bottom bar */}
          <div style={{ display:'flex', justifyContent:'flex-end', gap:10, marginTop:8, paddingBottom:40 }}>
            <button type="button" onClick={()=>navigate('/admin/products')} className="act-btn btn-cancel">Cancel</button>
            <button type="submit" disabled={saving} className="act-btn btn-save">
              {saving ? <Loader2 size={14} style={{ animation:'spin 1s linear infinite' }}/> : <Save size={14}/>}
              {saving ? 'Saving…' : isEdit ? 'Update Product' : '+ Add Product'}
            </button>
          </div>

        </form>
      </AdminLayout>
    </>
  );
}