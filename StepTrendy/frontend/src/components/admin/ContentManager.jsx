'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiSave, HiEye, HiPhotograph, HiColorSwatch, HiTrash, HiPlus, HiRefresh, HiDesktopComputer, HiDeviceMobile } from 'react-icons/hi';
import toast from 'react-hot-toast';

const SECTIONS = [
  { id: 'hero', label: 'Hero Section', icon: HiEye },
  { id: 'banners', label: 'Banners', icon: HiPhotograph },
  { id: 'categories_showcase', label: 'Categories Showcase', icon: HiColorSwatch },
  { id: 'flash_sale', label: 'Flash Sale', icon: HiColorSwatch },
  { id: 'features', label: 'Features Bar', icon: HiColorSwatch },
  { id: 'brands', label: 'Brand Partners', icon: HiColorSwatch },
  { id: 'testimonials', label: 'Testimonials', icon: HiColorSwatch },
  { id: 'newsletter', label: 'Newsletter', icon: HiColorSwatch },
  { id: 'footer', label: 'Footer', icon: HiColorSwatch },
];

const DEFAULT_CONTENT = {
  hero: {
    title: 'Step Into Luxury Fashion',
    subtitle: 'Discover premium fashion curated by AI. From luxury streetwear to designer sneakers.',
    ctaText: 'Shop Now',
    ctaLink: '/products',
    secondaryCtaText: 'Explore Collection',
    secondaryCtaLink: '/products?category=sneakers',
    badge: 'AI-Powered Fashion Recommendations',
    backgroundImage: '',
    backgroundVideo: '',
    overlayColor: 'from-blue-600/30 to-cyan-500/30',
    textColor: '#ffffff',
    badgeColor: 'yellow',
    isActive: true,
    animationType: 'float',
  },
  banners: [
    { id: 1, title: 'Summer Sale', subtitle: 'Up to 50% off', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200', link: '/products?sale=true', isActive: true },
    { id: 2, title: 'New Arrivals', subtitle: 'Check out the latest', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=1200', link: '/products?sort=newest', isActive: true },
  ],
  flash_sale: {
    title: 'Limited Time Offers',
    subtitle: 'Hurry up! Deals end soon',
    backgroundColor: 'from-gray-900 via-luxury-dark to-gray-900',
    isActive: true,
    timerHours: 23,
    timerMinutes: 59,
    timerSeconds: 59,
  },
  features: [
    { icon: 'truck', title: 'Free Shipping', desc: 'On orders above ₹999', isActive: true },
    { icon: 'shield', title: 'Secure Payment', desc: '100% secure checkout', isActive: true },
    { icon: 'refresh', title: 'Easy Returns', desc: '30-day return policy', isActive: true },
    { icon: 'support', title: '24/7 Support', desc: 'Premium support', isActive: true },
  ],
  brands: ['Nike', 'Adidas', 'Gucci', 'Prada', 'Louis Vuitton', 'Balenciaga', 'Versace', 'Bape'],
  testimonials: [
    { name: 'Priya S.', text: 'Absolutely love the quality! The AI recommendations were spot on.', rating: 5, role: 'Fashion Blogger' },
    { name: 'Rahul M.', text: 'Fast delivery and premium packaging. Feels like unboxing luxury!', rating: 5, role: 'Verified Buyer' },
  ],
  newsletter: {
    title: 'Stay in Style',
    subtitle: 'Subscribe for exclusive drops, early access, and 10% off your first order',
    buttonText: 'Subscribe',
    isActive: true,
  },
  footer: {
    companyName: 'StepTrendy',
    tagline: 'Premium AI-Powered Fashion Marketplace',
    email: 'hello@steptrendy.com',
    phone: '+91 1800-STEPTRENDY',
    socialLinks: { instagram: '#', facebook: '#', twitter: '#', youtube: '#' },
    isActive: true,
  },
};

const STORAGE_KEY = 'steptrendy_cms_content';

export default function ContentManager() {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [activeSection, setActiveSection] = useState('hero');
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setContent(prev => ({ ...prev, ...JSON.parse(saved) }));
    } catch {}
  }, []);

  const updateContent = (section, data) => {
    setContent(prev => ({ ...prev, [section]: { ...prev[section], ...data } }));
    setIsDirty(true);
  };

  const saveContent = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
      setIsDirty(false);
      toast.success('Content saved and published!');
      window.dispatchEvent(new CustomEvent('cms-update', { detail: content }));
    } catch {
      toast.error('Failed to save content');
    }
  };

  const resetSection = () => {
    updateContent(activeSection, DEFAULT_CONTENT[activeSection] || {});
    toast.success('Section reset to default');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold">Website Content Manager</h3>
          <p className="text-sm text-gray-500">Edit every section of your public website in real time</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white/5 rounded-lg p-1">
            <button onClick={() => setPreviewMode('desktop')} className={`p-2 rounded ${previewMode === 'desktop' ? 'bg-blue-600' : ''}`}><HiDesktopComputer size={18} /></button>
            <button onClick={() => setPreviewMode('mobile')} className={`p-2 rounded ${previewMode === 'mobile' ? 'bg-blue-600' : ''}`}><HiDeviceMobile size={18} /></button>
          </div>
          <button onClick={saveContent} className={`btn-primary text-sm flex items-center gap-2 ${isDirty ? 'animate-pulse' : ''}`}>
            <HiSave size={16} /> {isDirty ? 'Save Changes' : 'Saved'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-1">
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeSection === s.id ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'}`}
            ><s.icon size={18} /> {s.label}</button>
          ))}
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-luxury-dark rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-semibold text-lg capitalize">{activeSection.replace('_', ' ')} Editor</h4>
              <button onClick={resetSection} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"><HiRefresh size={14} /> Reset</button>
            </div>

            {/* Hero Editor */}
            {activeSection === 'hero' && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div><label className="label">Hero Title</label><input value={content.hero.title || ''} onChange={e => updateContent('hero', { title: e.target.value })} className="input-field-dark" /></div>
                  <div><label className="label">Subtitle</label><input value={content.hero.subtitle || ''} onChange={e => updateContent('hero', { subtitle: e.target.value })} className="input-field-dark" /></div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><label className="label">Badge Text</label><input value={content.hero.badge || ''} onChange={e => updateContent('hero', { badge: e.target.value })} className="input-field-dark" /></div>
                  <div><label className="label">Badge Color</label><select value={content.hero.badgeColor || 'yellow'} onChange={e => updateContent('hero', { badgeColor: e.target.value })} className="input-field-dark"><option value="yellow">Yellow</option><option value="blue">Blue</option><option value="green">Green</option><option value="red">Red</option></select></div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><label className="label">CTA Button Text</label><input value={content.hero.ctaText || ''} onChange={e => updateContent('hero', { ctaText: e.target.value })} className="input-field-dark" /></div>
                  <div><label className="label">CTA Link</label><input value={content.hero.ctaLink || ''} onChange={e => updateContent('hero', { ctaLink: e.target.value })} className="input-field-dark" /></div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><label className="label">Secondary Button Text</label><input value={content.hero.secondaryCtaText || ''} onChange={e => updateContent('hero', { secondaryCtaText: e.target.value })} className="input-field-dark" /></div>
                  <div><label className="label">Secondary Button Link</label><input value={content.hero.secondaryCtaLink || ''} onChange={e => updateContent('hero', { secondaryCtaLink: e.target.value })} className="input-field-dark" /></div>
                </div>
                <div><label className="label">Background Image URL</label><input value={content.hero.backgroundImage || ''} onChange={e => updateContent('hero', { backgroundImage: e.target.value })} className="input-field-dark" placeholder="Leave empty for gradient background" /></div>
                <div><label className="label">Overlay Gradient</label><select value={content.hero.overlayColor || 'from-blue-600/30 to-cyan-500/30'} onChange={e => updateContent('hero', { overlayColor: e.target.value })} className="input-field-dark"><option value="from-blue-600/30 to-cyan-500/30">Blue-Cyan</option><option value="from-purple-600/30 to-pink-500/30">Purple-Pink</option><option value="from-yellow-600/30 to-red-500/30">Yellow-Red</option><option value="from-green-600/30 to-emerald-500/30">Green</option></select></div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={content.hero.isActive} onChange={e => updateContent('hero', { isActive: e.target.checked })} className="rounded" /> <span className="label mb-0">Active</span></label>
                </div>
                <div className="mt-6 p-4 bg-luxury-black rounded-xl border border-white/10">
                  <p className="text-xs text-gray-500 mb-2">Live Preview</p>
                  <div className={`bg-gradient-to-r ${content.hero.overlayColor || 'from-blue-600/30 to-cyan-500/30'} rounded-lg p-6 min-h-[120px] flex flex-col justify-center`}>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs mb-2 ${content.hero.badgeColor === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' : content.hero.badgeColor === 'blue' ? 'bg-blue-500/20 text-blue-400' : content.hero.badgeColor === 'green' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{content.hero.badge || 'Badge'}</span>
                    <h3 className="text-xl font-bold text-white">{content.hero.title || 'Hero Title'}</h3>
                    <p className="text-sm text-gray-300 mt-1">{content.hero.subtitle || 'Subtitle'}</p>
                    <div className="flex gap-2 mt-3">
                      <span className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs rounded-full">{content.hero.ctaText || 'Shop Now'}</span>
                      <span className="px-4 py-2 border border-white/30 text-white text-xs rounded-full">{content.hero.secondaryCtaText || 'Explore'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Banners Editor */}
            {activeSection === 'banners' && (
              <div className="space-y-4">
                {(content.banners || []).map((banner, i) => (
                  <div key={banner.id || i} className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center justify-between mb-3"><h5 className="font-medium">Banner {i + 1}</h5>
                      <button onClick={() => { const b = [...(content.banners || [])]; b.splice(i, 1); updateContent('banners', b); }} className="text-red-400"><HiTrash size={16} /></button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div><label className="label">Title</label><input value={banner.title || ''} onChange={e => { const b = [...(content.banners || [])]; b[i] = { ...b[i], title: e.target.value }; updateContent('banners', b); }} className="input-field-dark" /></div>
                      <div><label className="label">Subtitle</label><input value={banner.subtitle || ''} onChange={e => { const b = [...(content.banners || [])]; b[i] = { ...b[i], subtitle: e.target.value }; updateContent('banners', b); }} className="input-field-dark" /></div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3 mt-3">
                      <div><label className="label">Image URL</label><input value={banner.image || ''} onChange={e => { const b = [...(content.banners || [])]; b[i] = { ...b[i], image: e.target.value }; updateContent('banners', b); }} className="input-field-dark" /></div>
                      <div><label className="label">Link</label><input value={banner.link || ''} onChange={e => { const b = [...(content.banners || [])]; b[i] = { ...b[i], link: e.target.value }; updateContent('banners', b); }} className="input-field-dark" /></div>
                    </div>
                  </div>
                ))}
                <button onClick={() => updateContent('banners', [...(content.banners || []), { id: Date.now(), title: '', subtitle: '', image: '', link: '#', isActive: true }])}
                  className="btn-outline text-sm flex items-center gap-2 border-gray-600 text-gray-400"><HiPlus size={16} /> Add Banner</button>
              </div>
            )}

            {/* Flash Sale Editor */}
            {activeSection === 'flash_sale' && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div><label className="label">Title</label><input value={content.flash_sale?.title || ''} onChange={e => updateContent('flash_sale', { title: e.target.value })} className="input-field-dark" /></div>
                  <div><label className="label">Subtitle</label><input value={content.flash_sale?.subtitle || ''} onChange={e => updateContent('flash_sale', { subtitle: e.target.value })} className="input-field-dark" /></div>
                </div>
                <div><label className="label">Background Gradient</label><select value={content.flash_sale?.backgroundColor || 'from-gray-900 via-luxury-dark to-gray-900'} onChange={e => updateContent('flash_sale', { backgroundColor: e.target.value })} className="input-field-dark">
                  <option value="from-gray-900 via-luxury-dark to-gray-900">Dark</option>
                  <option value="from-blue-900 via-blue-800 to-cyan-900">Blue</option>
                  <option value="from-purple-900 via-pink-800 to-red-900">Purple-Red</option>
                </select></div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div><label className="label">Timer Hours</label><input type="number" value={content.flash_sale?.timerHours || 23} onChange={e => updateContent('flash_sale', { timerHours: Number(e.target.value) })} className="input-field-dark" /></div>
                  <div><label className="label">Timer Minutes</label><input type="number" value={content.flash_sale?.timerMinutes || 59} onChange={e => updateContent('flash_sale', { timerMinutes: Number(e.target.value) })} className="input-field-dark" /></div>
                  <div><label className="label">Timer Seconds</label><input type="number" value={content.flash_sale?.timerSeconds || 59} onChange={e => updateContent('flash_sale', { timerSeconds: Number(e.target.value) })} className="input-field-dark" /></div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={content.flash_sale?.isActive} onChange={e => updateContent('flash_sale', { isActive: e.target.checked })} className="rounded" /> <span className="label mb-0">Active</span></label>
              </div>
            )}

            {/* Features Bar Editor */}
            {activeSection === 'features' && (
              <div className="space-y-4">
                {(content.features || []).map((feat, i) => (
                  <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <h5 className="font-medium mb-3">Feature {i + 1}</h5>
                    <div className="grid md:grid-cols-3 gap-3">
                      <div><label className="label">Icon</label><select value={feat.icon || 'truck'} onChange={e => { const f = [...(content.features || [])]; f[i] = { ...f[i], icon: e.target.value }; updateContent('features', f); }} className="input-field-dark">
                        <option value="truck">Truck</option><option value="shield">Shield</option><option value="refresh">Refresh</option><option value="support">Support</option><option value="star">Star</option><option value="sparkles">Sparkles</option>
                      </select></div>
                      <div><label className="label">Title</label><input value={feat.title || ''} onChange={e => { const f = [...(content.features || [])]; f[i] = { ...f[i], title: e.target.value }; updateContent('features', f); }} className="input-field-dark" /></div>
                      <div><label className="label">Description</label><input value={feat.desc || ''} onChange={e => { const f = [...(content.features || [])]; f[i] = { ...f[i], desc: e.target.value }; updateContent('features', f); }} className="input-field-dark" /></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Brands Editor */}
            {activeSection === 'brands' && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {(content.brands || []).map((brand, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl border border-white/10">
                      <span>{brand}</span>
                      <button onClick={() => { const b = [...(content.brands || [])]; b.splice(i, 1); updateContent('brands', b); }} className="text-red-400"><HiTrash size={14} /></button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input id="newBrand" className="input-field-dark flex-1" placeholder="Add brand name..." onKeyDown={e => { if (e.key === 'Enter' && e.target.value) { updateContent('brands', [...(content.brands || []), e.target.value]); e.target.value = ''; } }} />
                  <button onClick={() => { const inp = document.getElementById('newBrand'); if (inp?.value) { updateContent('brands', [...(content.brands || []), inp.value]); inp.value = ''; } }} className="btn-primary text-sm">Add</button>
                </div>
              </div>
            )}

            {/* Testimonials Editor */}
            {activeSection === 'testimonials' && (
              <div className="space-y-4">
                {(content.testimonials || []).map((t, i) => (
                  <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center justify-between mb-3"><h5 className="font-medium">Testimonial {i + 1}</h5>
                      <button onClick={() => { const ts = [...(content.testimonials || [])]; ts.splice(i, 1); updateContent('testimonials', ts); }} className="text-red-400"><HiTrash size={16} /></button>
                    </div>
                    <div className="grid md:grid-cols-3 gap-3">
                      <div><label className="label">Name</label><input value={t.name || ''} onChange={e => { const ts = [...(content.testimonials || [])]; ts[i] = { ...ts[i], name: e.target.value }; updateContent('testimonials', ts); }} className="input-field-dark" /></div>
                      <div><label className="label">Role</label><input value={t.role || ''} onChange={e => { const ts = [...(content.testimonials || [])]; ts[i] = { ...ts[i], role: e.target.value }; updateContent('testimonials', ts); }} className="input-field-dark" /></div>
                      <div><label className="label">Rating (1-5)</label><input type="number" min="1" max="5" value={t.rating || 5} onChange={e => { const ts = [...(content.testimonials || [])]; ts[i] = { ...ts[i], rating: Number(e.target.value) }; updateContent('testimonials', ts); }} className="input-field-dark" /></div>
                    </div>
                    <div className="mt-3"><label className="label">Text</label><textarea rows={2} value={t.text || ''} onChange={e => { const ts = [...(content.testimonials || [])]; ts[i] = { ...ts[i], text: e.target.value }; updateContent('testimonials', ts); }} className="input-field-dark" /></div>
                  </div>
                ))}
                <button onClick={() => updateContent('testimonials', [...(content.testimonials || []), { name: '', role: '', text: '', rating: 5 }])}
                  className="btn-outline text-sm flex items-center gap-2 border-gray-600 text-gray-400"><HiPlus size={16} /> Add Testimonial</button>
              </div>
            )}

            {/* Newsletter Editor */}
            {activeSection === 'newsletter' && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div><label className="label">Title</label><input value={content.newsletter?.title || ''} onChange={e => updateContent('newsletter', { title: e.target.value })} className="input-field-dark" /></div>
                  <div><label className="label">Button Text</label><input value={content.newsletter?.buttonText || ''} onChange={e => updateContent('newsletter', { buttonText: e.target.value })} className="input-field-dark" /></div>
                </div>
                <div><label className="label">Subtitle</label><textarea rows={2} value={content.newsletter?.subtitle || ''} onChange={e => updateContent('newsletter', { subtitle: e.target.value })} className="input-field-dark" /></div>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={content.newsletter?.isActive} onChange={e => updateContent('newsletter', { isActive: e.target.checked })} className="rounded" /> <span className="label mb-0">Active</span></label>
              </div>
            )}

            {/* Footer Editor */}
            {activeSection === 'footer' && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div><label className="label">Company Name</label><input value={content.footer?.companyName || ''} onChange={e => updateContent('footer', { companyName: e.target.value })} className="input-field-dark" /></div>
                  <div><label className="label">Tagline</label><input value={content.footer?.tagline || ''} onChange={e => updateContent('footer', { tagline: e.target.value })} className="input-field-dark" /></div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><label className="label">Email</label><input value={content.footer?.email || ''} onChange={e => updateContent('footer', { email: e.target.value })} className="input-field-dark" /></div>
                  <div><label className="label">Phone</label><input value={content.footer?.phone || ''} onChange={e => updateContent('footer', { phone: e.target.value })} className="input-field-dark" /></div>
                </div>
              </div>
            )}

            {/* Categories Showcase */}
            {activeSection === 'categories_showcase' && (
              <div className="p-8 text-center text-gray-500">
                <HiColorSwatch size={48} className="mx-auto mb-4 opacity-30" />
                <p>Categories showcase is managed from the <button onClick={() => { const evt = new CustomEvent('switch-admin-tab', { detail: 'products' }); window.dispatchEvent(evt); }} className="text-blue-400 underline">Categories</button> section.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
