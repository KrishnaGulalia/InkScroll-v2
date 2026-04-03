import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { user, profile, updateProfile, signOut } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '');
      setUsername(profile.username || '');
      setBio(profile.bio || '');
    }
  }, [profile]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    // If changing username, need to verify uniqueness. Supabase constraint will throw if duplicate.
    const updates = { display_name: displayName, username, bio };
    const { error: updErr } = await updateProfile(updates);

    if (updErr) {
      if (updErr.code === '23505') setError('Username is already taken.');
      else setError('Failed to update profile: ' + updErr.message);
    } else {
      setMessage('Profile updated successfully!');
    }
    setLoading(false);
  };

  const uploadAvatar = async (event) => {
    try {
      setAvatarLoading(true);
      if (!event.target.files || event.target.files.length === 0) return;
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);

      await updateProfile({ avatar_url: publicUrl });
      setMessage('Avatar updated!');
    } catch (err) {
      setError('Error uploading avatar (did you create the "avatars" bucket?): ' + err.message);
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone and will delete all reading lists.")) {
      // NOTE: Normally, you trigger an edge function or RPC to delete auth user, 
      // because client API cannot delete auth.users without service role.
      // We will attempt client deletion if configured, else advise.
      setError("Account deletion requires admin privileges or Edge Function setup in Supabase. Please contact support.");
    }
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-primary pt-20 pb-24 px-4 sm:px-6">
      <div className="max-w-[700px] mx-auto space-y-10">
        
        <div className="mb-6">
          <h1 className="text-3xl font-logo font-bold text-white mb-2">Settings</h1>
          <p className="text-txt-muted font-body">Manage your profile, preferences, and account details.</p>
        </div>

        {message && <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-lg">{message}</div>}
        {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg">{error}</div>}

        {/* Profile Details section */}
        <section className="bg-secondary border border-line rounded-xl p-6 sm:p-8 shadow-lg section-fade-in">
          <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-wider text-[13px] border-b border-line pb-3">Profile Settings</h2>
          
          <div className="flex items-center gap-6 mb-8">
            <div className="w-[80px] h-[80px] rounded-full bg-primary border-2 border-line overflow-hidden shadow-inner flex items-center justify-center text-xl font-bold font-logo text-txt-muted">
               {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                profile.username?.charAt(0).toUpperCase()
              )}
            </div>
            <div>
               <label className="px-4 py-2 bg-card border border-line hover:border-line-hover rounded-lg text-sm text-txt-primary cursor-pointer transition-colors block text-center mt-1">
                 {avatarLoading ? 'Uploading...' : 'Upload new avatar'}
                 <input type="file" accept="image/*" onChange={uploadAvatar} disabled={avatarLoading} className="hidden" />
               </label>
               <p className="text-xs text-txt-muted mt-2">Recommended: 256x256px max 2MB (requires "avatars" bucket)</p>
            </div>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-txt-secondary">Display Name</label>
                <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-full px-4 py-2.5 bg-[#1a1f33] border border-line rounded-lg text-white" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-txt-secondary">Username</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="w-full px-4 py-2.5 bg-[#1a1f33] border border-line rounded-lg text-white" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-txt-secondary">Bio</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} rows="4" placeholder="Tell us about your favorite manga..." className="w-full px-4 py-2.5 bg-[#1a1f33] border border-line rounded-lg text-white resize-none" />
            </div>

            <div className="pt-2">
              <button type="submit" disabled={loading} className="px-6 py-2.5 bg-crimson hover:bg-crimson-light text-white font-medium rounded-lg transition-colors shadow-lg shadow-crimson/20">
                 {loading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </section>

        {/* Account Settings */}
        <section className="bg-secondary border border-line rounded-xl p-6 sm:p-8 shadow-lg section-fade-in" style={{ animationDelay: '100ms' }}>
          <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-wider text-[13px] border-b border-line pb-3">Account</h2>
          
          <div className="space-y-6">
            <div className="space-y-1.5 opacity-70">
              <label className="text-sm font-medium text-txt-secondary">Email Address</label>
              <input type="email" value={user?.email || ''} readOnly className="w-full px-4 py-2.5 bg-primary/50 border border-line rounded-lg text-txt-muted cursor-not-allowed" />
              <p className="text-xs mt-1 text-txt-muted">Email cannot be changed directly.</p>
            </div>

            <div className="pt-6 border-t border-line border-dashed">
              <h3 className="text-red-500 font-medium mb-2">Danger Zone</h3>
              <p className="text-sm text-txt-muted mb-4">Once you delete your account, there is no going back. Please be certain.</p>
              <button onClick={handleDeleteAccount} className="px-4 py-2 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors text-sm font-medium">
                Delete Account
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
