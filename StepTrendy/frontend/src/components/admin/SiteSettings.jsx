'use client';
import { useState, useEffect } from 'react';
import { HiSave, HiRefresh } from 'react-icons/hi';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'steptrendy_site_settings';

export default function SiteSettings() {
  const [settings, setSettings] = useState({
    siteName: 'StepTrendy',
    tagline: 'Premium AI-Powered Fashion Marketplace',
    primaryColor: '#3b82f6',
    secondaryColor: '#00d4ff',
    currency: 'INR',
    currencySymbol: '\u20b9',
    locale: 'en',
    taxRate: 18,
    freeShippingThreshold: 999,
    shippingCost: 99,
    supportEmail: 'hello@steptrendy.com',
    supportPhone: '+91 1800-STEPTRENDY',
    socialInstagram: '#',
    socialFacebook: '#',
    socialTwitter: '#',
    socialYoutube: '#',
    metaTitle: 'StepTrendy - Premium AI-Powered Fashion Marketplace',
    metaDescription: 'Discover the future of fashion at StepTrendy.',
    metaKeywords: 'fashion, ecommerce, sneakers, streetwear',
    maintenanceMode: false,
    enableReviews: true,
    enableWishlist: true,
    enableAiRecommendations: true,
    theme: 'dark',
    googleAnalyticsId: '',
    facebookPixelId: '',
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setSettings(prev => ({ ...prev, ...JSON.parse(saved) }));
    } catch {}
  }, []);

  const saveSettings = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    toast.success('Settings saved');
    window.dispatchEvent(new CustomEvent('settings-update', { detail: settings }));
  };

  const update = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div><h3 className="text-xl font-bold">Site Settings</h3><p className="text-sm text-gray-500">Configure your website</p></div>
        <button onClick={saveSettings} className="btn-primary text-sm flex items-center gap-2"><HiSave size={16} /> Save Settings</button>
      </div>

      <div className="bg-white dark:bg-luxury-dark rounded-2xl border border-white/10 p-6 space-y-6">
        <h4 className="font-semibold text-lg">General</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="label">Site Name</label><input value={settings.siteName} onChange={e => update('siteName', e.target.value)} className="input-field-dark" /></div>
          <div><label className="label">Tagline</label><input value={settings.tagline} onChange={e => update('tagline', e.target.value)} className="input-field-dark" /></div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="label">Currency</label><select value={settings.currency} onChange={e => update('currency', e.target.value)} className="input-field-dark">
            <option value="INR">INR (₹)</option><option value="USD">USD ($)</option><option value="NPR">NPR (रू)</option><option value="EUR">EUR (€)</option>
          </select></div>
          <div><label className="label">Locale</label><select value={settings.locale} onChange={e => update('locale', e.target.value)} className="input-field-dark">
            <option value="en">English</option><option value="ne">Nepali (नेपाली)</option><option value="hi">Hindi (हिन्दी)</option>
          </select></div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="label">Primary Color</label><input type="color" value={settings.primaryColor} onChange={e => update('primaryColor', e.target.value)} className="w-full h-10 rounded-xl cursor-pointer" /></div>
          <div><label className="label">Secondary Color</label><input type="color" value={settings.secondaryColor} onChange={e => update('secondaryColor', e.target.value)} className="w-full h-10 rounded-xl cursor-pointer" /></div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div><label className="label">Tax Rate (%)</label><input type="number" value={settings.taxRate} onChange={e => update('taxRate', Number(e.target.value))} className="input-field-dark" /></div>
          <div><label className="label">Free Shipping Above (₹)</label><input type="number" value={settings.freeShippingThreshold} onChange={e => update('freeShippingThreshold', Number(e.target.value))} className="input-field-dark" /></div>
          <div><label className="label">Shipping Cost (₹)</label><input type="number" value={settings.shippingCost} onChange={e => update('shippingCost', Number(e.target.value))} className="input-field-dark" /></div>
        </div>
      </div>

      <div className="bg-white dark:bg-luxury-dark rounded-2xl border border-white/10 p-6 space-y-6">
        <h4 className="font-semibold text-lg">Contact & Social</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="label">Support Email</label><input value={settings.supportEmail} onChange={e => update('supportEmail', e.target.value)} className="input-field-dark" /></div>
          <div><label className="label">Support Phone</label><input value={settings.supportPhone} onChange={e => update('supportPhone', e.target.value)} className="input-field-dark" /></div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="label">Instagram URL</label><input value={settings.socialInstagram} onChange={e => update('socialInstagram', e.target.value)} className="input-field-dark" /></div>
          <div><label className="label">Facebook URL</label><input value={settings.socialFacebook} onChange={e => update('socialFacebook', e.target.value)} className="input-field-dark" /></div>
        </div>
      </div>

      <div className="bg-white dark:bg-luxury-dark rounded-2xl border border-white/10 p-6 space-y-6">
        <h4 className="font-semibold text-lg">SEO & Analytics</h4>
        <div><label className="label">Meta Title</label><input value={settings.metaTitle} onChange={e => update('metaTitle', e.target.value)} className="input-field-dark" /></div>
        <div><label className="label">Meta Description</label><textarea rows={2} value={settings.metaDescription} onChange={e => update('metaDescription', e.target.value)} className="input-field-dark" /></div>
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="label">Google Analytics ID</label><input value={settings.googleAnalyticsId} onChange={e => update('googleAnalyticsId', e.target.value)} className="input-field-dark" /></div>
          <div><label className="label">Facebook Pixel ID</label><input value={settings.facebookPixelId} onChange={e => update('facebookPixelId', e.target.value)} className="input-field-dark" /></div>
        </div>
      </div>

      <div className="bg-white dark:bg-luxury-dark rounded-2xl border border-white/10 p-6 space-y-6">
        <h4 className="font-semibold text-lg">Features</h4>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { key: 'maintenanceMode', label: 'Maintenance Mode' },
            { key: 'enableReviews', label: 'Enable Reviews' },
            { key: 'enableWishlist', label: 'Enable Wishlist' },
            { key: 'enableAiRecommendations', label: 'AI Recommendations' },
          ].map(f => (
            <label key={f.key} className="flex items-center gap-3 cursor-pointer p-3 bg-white/5 rounded-xl">
              <input type="checkbox" checked={settings[f.key]} onChange={e => update(f.key, e.target.checked)} className="rounded" />
              <span className="text-sm">{f.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
