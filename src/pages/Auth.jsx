import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  // Auto-generate username from email
  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (!isLogin && !username) {
      const baseUsername = val.split('@')[0].replace(/\d+$/, '');
      setUsername(baseUsername || 'user_' + Math.random().toString(36).slice(2,7));
    }
  };

  const handleGoogleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setSuccess(null);

    try {
      if (isLogin) {
        const { error: signInError } = await signIn({ email, password });
        if (signInError) throw signInError;
        navigate('/');
      } else {
        if (password !== confirmPassword) {
          throw new Error("Passwords don't match");
        }
        if (password.length < 8) {
          throw new Error("Password must be at least 8 characters");
        }
        const { error: signUpError } = await signUp({
          email,
          password,
          options: {
            data: {
              username: username || email.split('@')[0].replace(/\d+$/, '') || 'user_' + Math.random().toString(36).slice(2,7)
            }
          }
        });
        if (signUpError) throw signUpError;
        setSuccess('Check your email to confirm your account.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      if (isLogin) setLoading(false);
      // Let success state handle loading unmount if signup
    }
  };

  const InputField = ({ label, type = 'text', value, onChange, placeholder }) => (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-txt-secondary font-body">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full px-4 py-2.5 bg-[#1a1f33] border border-line rounded-lg text-txt-primary placeholder:text-txt-muted/50 focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson transition-all font-body text-[15px]"
      />
    </div>
  );

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* 
        -- Run this in Supabase SQL editor to fix trigger (already done in Auth API):
        CREATE OR REPLACE FUNCTION handle_new_user()
        RETURNS TRIGGER AS $$
        BEGIN
          INSERT INTO public.profiles (id, username, display_name, avatar_url)
          VALUES (
            new.id,
            REGEXP_REPLACE(SPLIT_PART(new.email, '@', 1), '\\d+$', ''),
            REGEXP_REPLACE(SPLIT_PART(new.email, '@', 1), '\\d+$', ''),
            new.raw_user_meta_data->>'avatar_url'
          );
          RETURN new;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      */}

      {/* Background with CSS panel grid pattern */}
      <div 
        className="absolute inset-0 z-0 bg-primary opacity-40 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Auth Card */}
      <div className="w-full max-w-[420px] bg-secondary border border-line rounded-2xl shadow-2xl z-10 p-6 sm:p-8 relative overflow-hidden">
        {/* Top Accent Strip */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-crimson to-crimson-light" />
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-logo font-bold tracking-widest text-white mb-2">
            INKSCROLL
          </h1>
          <p className="text-txt-secondary font-body text-sm">
            {isLogin ? 'Welcome back, reader.' : 'Start your manga journey.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <InputField 
              label="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="CoolReader99"
            />
          )}
          
          <InputField 
            label="Email" 
            type="email" 
            value={email} 
            onChange={handleEmailChange} 
            placeholder="you@example.com"
          />
          
          <InputField 
            label="Password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="••••••••"
          />
          
          {!isLogin && (
            <InputField 
              label="Confirm Password" 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              placeholder="••••••••"
            />
          )}

          {isLogin && (
            <div className="flex justify-end pt-1">
              <a href="#" className="text-sm font-medium text-crimson hover:text-crimson-light transition-colors">
                Forgot password?
              </a>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-500 font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-sm text-green-500 font-medium">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-crimson hover:bg-crimson-light text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-crimson/20 disabled:opacity-70"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-line" />
          <span className="text-xs font-semibold text-txt-muted uppercase tracking-widest">Or</span>
          <div className="flex-1 h-px bg-line" />
        </div>

        <button
          onClick={handleGoogleSubmit}
          type="button"
          className="w-full mt-6 bg-card border border-line hover:border-line-hover text-txt-primary font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            <path fill="none" d="M1 1h22v22H1z" />
          </svg>
          Continue with Google
        </button>

        <div className="mt-8 text-center">
          <p className="text-sm font-body text-txt-secondary">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
                setSuccess(null);
              }}
              className="text-white hover:text-crimson font-medium transition-colors"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
