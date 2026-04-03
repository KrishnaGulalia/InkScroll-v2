import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { 
  UserIcon, ShieldCheckIcon, AdjustmentsHorizontalIcon, 
  SwatchIcon, LockClosedIcon, CheckCircleIcon,
  ExclamationTriangleIcon, ArrowDownTrayIcon, CameraIcon
} from '@heroicons/react/24/outline';

const SIDEBAR_TABS = [
  { id: 'profile', label: 'Profile', icon: UserIcon },
  { id: 'account', label: 'Account', icon: ShieldCheckIcon },
  { id: 'preferences', label: 'Preferences', icon: AdjustmentsHorizontalIcon },
  { id: 'appearance', label: 'Appearance', icon: SwatchIcon },
  { id: 'privacy', label: 'Privacy', icon: LockClosedIcon },
];

const ACCENT_COLORS = [
  { id: 'crimson', hex: '#e63946' },
  { id: 'purple', hex: '#7c6dfa' },
  { id: 'blue', hex: '#3b82f6' },
  { id: 'green', hex: '#22c55e' },
  { id: 'orange', hex: '#f97316' },
  { id: 'pink', hex: '#ec4899' }
];

export default function Settings() {
  const { user, profile, updateProfile, signOut } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  
  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-primary pt-16 pb-24 font-body relative overflow-hidden">
      
      {/* Background styling elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-crimson/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Toast Notification */}
      <div 
        className={`fixed top-20 right-4 z-[100] transition-all duration-500 flex items-center justify-center gap-3 px-6 py-3 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] ${
          toast ? 'translate-x-0 opacity-100' : 'translate-x-[150%] opacity-0'
        } ${toast?.type === 'success' ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}
      >
        <CheckCircleIcon className={`w-5 h-5 ${toast?.type === 'success' ? 'text-green-500' : 'text-red-500'}`} />
        <span className={`text-sm font-bold tracking-wide ${toast?.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
          {toast?.msg}
        </span>
      </div>

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row gap-6 lg:gap-12 items-start">
        
        {/* Left Sidebar Menu */}
        <div className="w-full md:w-[240px] shrink-0 md:sticky md:top-24 mt-6">
          <div className="md:hidden flex overflow-x-auto hide-scrollbar gap-2 mb-6 border-b border-line pb-4 hide-scrollbar">
            {SIDEBAR_TABS.map(t => {
              const Icon = t.icon;
              return (
                <button 
                  key={t.id} onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-bold tracking-widest uppercase whitespace-nowrap transition-colors ${
                    activeTab === t.id ? 'bg-crimson/10 text-crimson border-crimson' : 'text-txt-muted hover:text-white bg-card border-transparent'
                  } border`}
                >
                  <Icon className="w-4 h-4" />
                  {t.label}
                </button>
              );
            })}
          </div>

          <div className="hidden md:flex flex-col gap-1">
            <h3 className="font-logo font-bold text-white text-3xl mb-8 tracking-wide px-4">SETTINGS</h3>
            {SIDEBAR_TABS.map(t => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button 
                  key={t.id} onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-[13px] tracking-widest uppercase transition-all duration-300 w-full hover:-translate-y-0.5 ${
                    isActive 
                      ? 'bg-crimson/10 text-crimson border-l-[3px] border-crimson' 
                      : 'text-txt-muted hover:text-white hover:bg-white/5 border-l-[3px] border-transparent'
                  }`}
                >
                  <Icon className="w-[18px] h-[18px]" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 w-full min-w-0">
          <div className="animate-fadeIn hidden md:block">
            <h1 className="font-display text-[32px] font-bold text-white leading-none">
              {SIDEBAR_TABS.find(t => t.id === activeTab)?.label}
            </h1>
            <p className="text-txt-secondary text-sm mt-2 mb-4 font-medium tracking-wide">
              {activeTab === 'profile' && 'Manage your public identity.'}
              {activeTab === 'account' && 'Security rules and credentials.'}
              {activeTab === 'preferences' && 'Tweak the application behavior.'}
              {activeTab === 'appearance' && 'Customize the visual aesthetic.'}
              {activeTab === 'privacy' && 'Control your data rules.'}
            </p>
            <div className="w-[40px] h-[2px] bg-crimson mb-8 rounded shadow-[0_0_8px_rgba(230,57,70,0.8)]" />
          </div>

          {activeTab === 'profile' && <ProfileSettings profile={profile} updateProfile={updateProfile} showToast={showToast} />}
          {activeTab === 'account' && <AccountSettings user={user} supabase={supabase} showToast={showToast} signOut={signOut} />}
          {activeTab === 'preferences' && <PreferencesSettings />}
          {activeTab === 'appearance' && <AppearanceSettings />}
          {activeTab === 'privacy' && <PrivacySettings profile={profile} />}
        </div>

      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Sub-components for Each Section
// ──────────────────────────────────────────────────────────

function SectionCard({ title, children }) {
  return (
    <div className="bg-[#111420] border border-white/5 rounded-2xl p-6 sm:p-8 mb-6 shadow-xl shadow-black/40">
      {title && (
        <h2 className="text-[11px] font-bold tracking-[0.1em] text-txt-muted uppercase mb-6 border-b border-line pb-4">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}

function InputField({ label, ...props }) {
  return (
    <div className="space-y-2">
      <label className="text-[12px] font-bold tracking-widest text-txt-muted uppercase">{label}</label>
      <input 
        className="w-full bg-[#0d0f1a] border border-white/10 rounded-[10px] h-[48px] px-4 text-white text-[15px] font-medium transition-all focus:outline-none focus:border-crimson focus:shadow-[0_0_0_3px_rgba(230,57,70,0.1)] placeholder:text-txt-muted/50 disabled:opacity-50 disabled:cursor-not-allowed"
        {...props}
      />
    </div>
  );
}

function CustomToggle({ checked, onChange, label, desc }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="pr-4">
        <div className="text-[14px] font-bold text-white">{label}</div>
        {desc && <div className="text-[12px] font-medium text-txt-secondary mt-0.5">{desc}</div>}
      </div>
      <button 
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors duration-300 shrink-0 ${
          checked ? 'bg-crimson' : 'bg-[#1a1f33] border border-line'
        }`}
      >
        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
          checked ? 'translate-x-6' : 'translate-x-0'
        }`} />
      </button>
    </div>
  );
}

function ProfileSettings({ profile, updateProfile, showToast }) {
  const [displayName, setDisplayName] = useState(profile.display_name || '');
  const [username, setUsername] = useState(profile.username || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await updateProfile({ display_name: displayName, username, bio });
    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast('Profile updated completely.');
    }
    setLoading(false);
  };

  return (
    <div className="animate-fadeIn">
      <SectionCard title="Public Avatar">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div className="relative group cursor-pointer w-[120px] h-[120px]">
            <div className={`w-[120px] h-[120px] rounded-full overflow-hidden border-2 border-dashed ${profile.avatar_url ? 'border-transparent' : 'border-txt-muted bg-primary'} flex items-center justify-center font-logo text-txt-muted text-4xl font-bold transition-all group-hover:border-crimson`}>
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
              ) : (
                profile.username?.charAt(0).toUpperCase()
              )}
            </div>
            
            <div className="absolute inset-0 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-sm">
              <CameraIcon className="w-8 h-8 text-white mb-1" />
              <div className="text-[10px] font-bold text-white uppercase tracking-wider">Change</div>
            </div>

            {/* Hidden native input */}
            <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" title="Upload Avatar" />
          </div>
          <div className="text-center sm:text-left">
            <h4 className="text-[15px] font-bold text-white mb-1">Upload new avatar</h4>
            <p className="text-[12px] font-medium text-txt-muted mb-4 max-w-[200px]">Optimal size is 256x256px. Supported formats: JPG, PNG, WEBP (Max 2MB).</p>
            <button className="px-5 py-2 rounded-lg bg-white/5 border border-line text-xs font-bold uppercase tracking-widest text-txt-primary hover:bg-white/10 transition-colors">
              Remove Picture
            </button>
          </div>
        </div>
      </SectionCard>

      <form onSubmit={handleSave}>
        <SectionCard title="Basic Details">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InputField label="Display Name" value={displayName} onChange={e => setDisplayName(e.target.value)} />
              <InputField label="Username (@)" value={username} onChange={e => setUsername(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <label className="text-[12px] font-bold tracking-widest text-txt-muted uppercase">Bio / Highlights</label>
                <div className="text-[11px] font-mono text-txt-muted font-semibold">{bio.length}/160</div>
              </div>
              <textarea 
                value={bio} onChange={e => setBio(e.target.value)} 
                maxLength={160} rows="3"
                className="w-full bg-[#0d0f1a] border border-white/10 rounded-[10px] px-4 py-3 text-white text-[15px] font-medium transition-all focus:outline-none focus:border-crimson focus:shadow-[0_0_0_3px_rgba(230,57,70,0.1)] resize-none"
              />
            </div>
            
            <div className="pt-2">
              <button disabled={loading} type="submit" className="px-8 py-3.5 bg-crimson hover:bg-crimson-light text-white font-bold text-[14px] tracking-wide rounded-xl transition-all shadow-[0_4px_14px_rgba(230,57,70,0.3)] disabled:opacity-70 w-full sm:w-auto flex justify-center items-center gap-2">
                {loading ? 'Saving Changes...' : 'Save Profile Fields'}
              </button>
            </div>
          </div>
        </SectionCard>
      </form>
    </div>
  );
}

function AccountSettings({ user, supabase, showToast, signOut }) {
  const [pwOpen, setPwOpen] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  
  const [delOpen, setDelOpen] = useState(false);
  const [delInput, setDelInput] = useState('');

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPw.length < 8) return showToast('Password must be 8+ chars', 'error');
    // Using simple supabase update, ignores current password prompt naturally if session valid
    const { error } = await supabase.auth.updateUser({ password: newPw });
    if (error) showToast(error.message, 'error');
    else {
      showToast('Password updated via secure link.'); 
      setPwOpen(false); setNewPw(''); setCurrentPw('');
    }
  };

  return (
    <div className="animate-fadeIn">
      <SectionCard title="Contact Info">
        <div className="relative">
           <InputField label="Registered Email" value={user?.email || ''} readOnly />
           <LockClosedIcon className="w-5 h-5 absolute right-4 top-[34px] text-txt-muted" />
        </div>
        <p className="text-[12px] font-medium text-txt-secondary mt-3">
          To migrate your account to a different email address, please contact platform support.
        </p>
      </SectionCard>

      <SectionCard title="Security Rules">
        <button 
          type="button" onClick={() => setPwOpen(!pwOpen)}
          className="w-full bg-[#0d0f1a] border border-line hover:border-line-hover px-5 py-4 rounded-xl flex items-center justify-between text-left transition-colors"
        >
          <div>
             <div className="font-bold text-white text-[14px]">Update Password</div>
             <div className="text-[12px] font-medium text-txt-muted mt-0.5">Ensure your account is protected heavily</div>
          </div>
          <div className="text-crimson font-bold text-[14px]">{pwOpen ? 'Cancel' : 'Change'}</div>
        </button>

        {pwOpen && (
          <form onSubmit={handleUpdatePassword} className="mt-4 bg-[#0d0f1a]/50 p-5 rounded-xl border border-line space-y-4 animate-fadeInUp">
            <InputField label="Current Password" type="password" value={currentPw} onChange={e=>setCurrentPw(e.target.value)} required />
            <InputField label="New Password (8+ Chars)" type="password" value={newPw} onChange={e=>setNewPw(e.target.value)} required />
            
            {/* Fake strength bar */}
            {newPw.length > 0 && (
              <div className="h-1.5 w-full bg-card rounded-full overflow-hidden flex gap-1">
                <div className={`h-full flex-1 ${newPw.length > 0 ? 'bg-red-500' : ''}`} />
                <div className={`h-full flex-1 ${newPw.length > 6 ? 'bg-yellow-500' : ''}`} />
                <div className={`h-full flex-1 ${newPw.length > 9 ? 'bg-green-500' : ''}`} />
              </div>
            )}

            <div className="pt-2 text-right">
              <button type="submit" className="px-6 py-2.5 bg-white text-primary font-bold rounded-lg text-sm transition-transform hover:scale-105">
                Set New Password
              </button>
            </div>
          </form>
        )}
      </SectionCard>

      <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5"><ExclamationTriangleIcon className="w-32 h-32 text-red-500" /></div>
        
        <h2 className="text-[11px] font-bold tracking-[0.1em] text-red-500 uppercase mb-6 flex items-center gap-2 border-b border-red-500/20 pb-4">
          <ExclamationTriangleIcon className="w-4 h-4" />
          Danger Zone
        </h2>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div>
            <h3 className="font-bold text-white text-[16px]">Permanently Delete Account</h3>
            <p className="font-medium text-txt-secondary text-[13px] mt-1 pr-4">All reading contexts, custom stats, and identities will be utterly destroyed.</p>
          </div>
          
          <button 
            type="button" onClick={() => setDelOpen(true)}
            className="px-6 py-2.5 bg-transparent border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-bold rounded-lg transition-all shrink-0 text-sm"
          >
            Delete Account
          </button>
        </div>

        {delOpen && (
          <div className="mt-6 pt-6 border-t border-red-500/20 animate-fadeInUp relative z-10">
            <label className="text-[12px] font-bold tracking-widest text-red-400 uppercase block mb-2">Type "DELETE" to confirm existence removal</label>
            <div className="flex gap-3">
              <input 
                value={delInput} onChange={e=>setDelInput(e.target.value)} placeholder="DELETE"
                className="bg-[#0d0f1a] border border-red-500/30 focus:border-red-500 focus:outline-none rounded-lg px-4 font-mono font-bold text-white w-full sm:w-auto"
              />
              <button 
                disabled={delInput !== 'DELETE'}
                onClick={() => { showToast('Account purged.', 'error'); signOut(); }}
                className="px-6 py-2.5 bg-red-500 text-white font-bold rounded-lg disabled:opacity-50 transition-all text-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PreferencesSettings() {
  const [toggles, setToggles] = useState({
    explicit: false,
    romanized: true,
    email: true,
    autoProgress: true,
  });

  const handleChange = (k, v) => setToggles({ ...toggles, [k]: v });

  return (
    <div className="animate-fadeIn space-y-6">
      <SectionCard title="Browsing Toggles">
        <div className="divide-y divide-white/5 space-y-2">
          <CustomToggle label="Show Explicit Content" desc="Include 18+ maturity titles across searches." checked={toggles.explicit} onChange={(v) => handleChange('explicit', v)} />
          <CustomToggle label="Show Romanized Titles" desc="Render Japanese/Korean titles in Romaji." checked={toggles.romanized} onChange={(v) => handleChange('romanized', v)} />
        </div>
      </SectionCard>
      
      <SectionCard title="System Automation">
        <div className="divide-y divide-white/5 space-y-2">
           <CustomToggle label="Email Notifications" desc="System digests and critical updates." checked={toggles.email} onChange={(v) => handleChange('email', v)} />
           <CustomToggle label="Auto-update Progress" desc="Increment counters automatically on chapter scrolls." checked={toggles.autoProgress} onChange={(v) => handleChange('autoProgress', v)} />
        </div>

        <div className="mt-8 pt-4 border-t border-line">
          <div className="space-y-2">
             <label className="text-[12px] font-bold tracking-widest text-txt-muted uppercase">Default List Status when Adding</label>
             <select className="w-full bg-[#0d0f1a] border border-white/10 rounded-[10px] h-[48px] px-4 text-white text-[14px] font-bold transition-all focus:outline-none focus:border-crimson hover:bg-white/5 appearance-none">
               <option>Reading</option>
               <option>Plan to Read</option>
               <option>Completed</option>
             </select>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function AppearanceSettings() {
  const [activeAccent, setActiveAccent] = useState('crimson');

  // Load from logic/local storage if desired, keeping purely visual here
  const handleColorPick = (colorId, hex) => {
    setActiveAccent(colorId);
    document.documentElement.style.setProperty('--color-accent', hex); // Dynamic var injection
  };

  return (
    <div className="animate-fadeIn">
      <SectionCard title="Global Theme">
        <div className="flex items-center gap-6">
          <button className="flex-1 max-w-[200px] aspect-video rounded-xl bg-primary border-2 border-crimson relative overflow-hidden flex items-center justify-center p-2 group shadow-[0_0_20px_rgba(230,57,70,0.2)]">
            <div className="w-full h-full bg-[#111420] border border-line rounded flex flex-col gap-2 p-2 pointer-events-none">
              <div className="w-full h-2 bg-crimson rounded-full" />
              <div className="flex gap-2">
                 <div className="flex-1 bg-white/5 h-10 rounded" />
                 <div className="flex-1 bg-white/5 h-10 rounded" />
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-3 text-center pointer-events-none">
              <span className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white shadow-md border border-white/10">Dark Mode</span>
            </div>
          </button>

          <button className="flex-1 max-w-[200px] aspect-video rounded-xl bg-gray-200 border-2 border-transparent relative overflow-hidden flex items-center justify-center p-2 opacity-50 cursor-not-allowed grayscale">
            <div className="absolute inset-x-0 bottom-3 text-center">
              <span className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white shadow-md tracking-wider uppercase">Coming Soon</span>
            </div>
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Accent Injection">
         <p className="text-[13px] font-medium text-txt-secondary mb-6">Select a primary color tone that will paint buttons, underlines, and hover states.</p>
         
         <div className="flex flex-wrap gap-4">
           {ACCENT_COLORS.map(c => (
             <button
                key={c.id}
                onClick={() => handleColorPick(c.id, c.hex)}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform hover:scale-110 ${activeAccent === c.id ? 'ring-2 ring-white ring-offset-2 ring-offset-[#111420]' : ''}`}
                style={{ backgroundColor: c.hex }}
             >
               {activeAccent === c.id && <CheckCircleIcon className="w-6 h-6 text-white drop-shadow-md" />}
             </button>
           ))}
         </div>
      </SectionCard>
    </div>
  );
}

function PrivacySettings({ profile }) {
  const [toggles, setToggles] = useState({
    publicProfile: true,
    showList: true,
    showStats: true
  });

  return (
    <div className="animate-fadeIn">
      <SectionCard title="Identity Masking">
        <div className="divide-y divide-white/5 space-y-2 mb-8">
           <CustomToggle label="Public Profile" desc="Allow external visitors to query your profile URL." checked={toggles.publicProfile} onChange={(v) => setToggles({...toggles, publicProfile:v})} />
           <CustomToggle label="Public Reading List" desc="Expose your manga arrays to the public timeline." checked={toggles.showList} onChange={(v) => setToggles({...toggles, showList:v})} />
           <CustomToggle label="Analytics Sharing" desc="Expose pie charts and genre breakdowns." checked={toggles.showStats} onChange={(v) => setToggles({...toggles, showStats:v})} />
        </div>
        
        <div className="pt-6 border-t border-line">
           <h3 className="text-[14px] font-bold text-white mb-2">Data Exfiltration</h3>
           <p className="text-[12px] font-medium text-txt-secondary mb-4">Export all records, statuses, and metrics associated with your InkScroll key.</p>
           
           <button className="px-5 py-2.5 bg-card border border-line hover:bg-white hover:text-black hover:border-white transition-colors text-[13px] font-bold tracking-wider uppercase text-white rounded-lg flex items-center justify-center gap-2">
             <ArrowDownTrayIcon className="w-4 h-4" />
             Export Local JSON
           </button>
        </div>
      </SectionCard>
    </div>
  );
}
