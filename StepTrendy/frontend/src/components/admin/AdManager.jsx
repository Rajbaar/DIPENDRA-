'use client';
import { useState, useEffect } from 'react';
import { HiPlus, HiTrash, HiEye, HiEyeOff, HiChartBar } from 'react-icons/hi';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'steptrendy_ads';

const POSITIONS = [
  { id: 'homepage_banner', label: 'Homepage Banner' },
  { id: 'homepage_popup', label: 'Homepage Popup' },
  { id: 'sidebar', label: 'Sidebar' },
  { id: 'floating_bottom', label: 'Floating Bottom Bar' },
  { id: 'product_page', label: 'Product Page' },
  { id: 'checkout_page', label: 'Checkout Page' },
];

export default function AdManager() {
  const [ads, setAds] = useState([]);
  const [activePosition, setActivePosition] = useState('homepage_banner');
  const [stats, setStats] = useState({ clicks: 0, impressions: 0 });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setAds(JSON.parse(saved));
    } catch {}
    const s = localStorage.getItem('steptrendy_ad_stats');
    if (s) setStats(JSON.parse(s));
  }, []);

  const saveAds = (newAds) => {
    setAds(newAds);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newAds));
    window.dispatchEvent(new CustomEvent('ads-update', { detail: newAds }));
    toast.success('Ads updated');
  };

  const addAd = () => {
    saveAds([...ads, {
      id: Date.now().toString(),
      title: 'New Ad',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
      link: '#',
      position: activePosition,
      isActive: true,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date(Date.now() + 30*86400000).toISOString().slice(0, 10),
      type: 'banner',
      createdAt: new Date().toISOString(),
    }]);
  };

  const toggleAd = (id) => {
    saveAds(ads.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
  };

  const deleteAd = (id) => {
    if (!confirm('Delete this ad?')) return;
    saveAds(ads.filter(a => a.id !== id));
  };

  const updateAd = (id, data) => {
    saveAds(ads.map(a => a.id === id ? { ...a, ...data } : a));
  };

  const filteredAds = ads.filter(a => a.position === activePosition);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h3 className="text-xl font-bold">Advertisement Manager</h3><p className="text-sm text-gray-500">Manage site-wide advertisements</p></div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-500">Impressions: <strong className="text-white">{stats.impressions.toLocaleString()}</strong></span>
          <span className="text-gray-500">Clicks: <strong className="text-white">{stats.clicks.toLocaleString()}</strong></span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {POSITIONS.map(p => (
          <button key={p.id} onClick={() => setActivePosition(p.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activePosition === p.id ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'bg-white/5 text-gray-500 hover:text-white border border-white/10'}`}
          >{p.label} <span className="ml-1 text-xs opacity-60">({ads.filter(a => a.position === p.id).length})</span></button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{filteredAds.length} ad(s) in this position</p>
        <button onClick={addAd} className="btn-primary text-sm flex items-center gap-2"><HiPlus size={16} /> Add Ad</button>
      </div>

      <div className="grid gap-4">
        {filteredAds.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white/5 rounded-2xl border border-white/10">
            <HiChartBar size={48} className="mx-auto mb-4 opacity-30" />
            <p>No ads in this position. Click "Add Ad" to create one.</p>
          </div>
        ) : filteredAds.map((ad) => (
          <div key={ad.id} className="bg-white dark:bg-luxury-dark rounded-2xl border border-white/10 p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/10">
                  <img src={ad.image || 'https://via.placeholder.com/100'} alt={ad.title} className="w-full h-full object-cover" />
                </div>
                <div><h5 className="font-medium">{ad.title}</h5><p className="text-xs text-gray-500">{ad.type} · {ad.position}</p></div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggleAd(ad.id)} className={`p-2 rounded-lg ${ad.isActive ? 'text-green-400 bg-green-500/10' : 'text-gray-600 bg-white/5'}`}>
                  {ad.isActive ? <HiEye size={16} /> : <HiEyeOff size={16} />}
                </button>
                <button onClick={() => deleteAd(ad.id)} className="p-2 rounded-lg text-red-400 bg-red-500/10"><HiTrash size={16} /></button>
              </div>
            </div>
            <div className="grid md:grid-cols-4 gap-3">
              <div><label className="label">Title</label><input value={ad.title} onChange={e => updateAd(ad.id, { title: e.target.value })} className="input-field-dark" /></div>
              <div><label className="label">Type</label><select value={ad.type} onChange={e => updateAd(ad.id, { type: e.target.value })} className="input-field-dark">
                <option value="banner">Banner</option><option value="popup">Popup</option><option value="sidebar">Sidebar</option><option value="floating">Floating</option><option value="video">Video</option>
              </select></div>
              <div><label className="label">Image URL</label><input value={ad.image} onChange={e => updateAd(ad.id, { image: e.target.value })} className="input-field-dark" /></div>
              <div><label className="label">Link</label><input value={ad.link} onChange={e => updateAd(ad.id, { link: e.target.value })} className="input-field-dark" /></div>
            </div>
            <div className="grid md:grid-cols-2 gap-3 mt-3">
              <div><label className="label">Start Date</label><input type="date" value={ad.startDate || ''} onChange={e => updateAd(ad.id, { startDate: e.target.value })} className="input-field-dark" /></div>
              <div><label className="label">End Date</label><input type="date" value={ad.endDate || ''} onChange={e => updateAd(ad.id, { endDate: e.target.value })} className="input-field-dark" /></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
