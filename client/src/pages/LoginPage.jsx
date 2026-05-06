import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  console.log(process.env.REACT_APP_SERVER_URL)
  const { login } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Invalid email or password';
      toast.error(msg);
      if (msg.toLowerCase().includes('email')) setErrors({ email: msg });
      else setErrors({ password: msg });
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }));
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--surface)',
      color: 'var(--text-primary)',
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        .auth-input {
          width: 100%; padding: 11px 14px; border-radius: 9px;
          border: 1.5px solid var(--border);
          background: var(--surface-elevated);
          color: var(--text-primary);
          font-size: 14px; font-family: inherit;
          outline: none; transition: border-color 0.15s, box-shadow 0.15s;
          box-sizing: border-box;
        }
        .auth-input:focus {
          border-color: var(--brand);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand) 15%, transparent);
        }
        .auth-input.error { border-color: #ef4444; }
        .auth-input.error:focus { box-shadow: 0 0 0 3px rgba(239,68,68,0.15); }
        .auth-btn {
          width: 100%; padding: 12px; border-radius: 9px;
          background: var(--brand); color: #fff;
          border: none; cursor: pointer;
          font-size: 15px; font-weight: 600; font-family: inherit;
          transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .auth-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 6px 20px color-mix(in srgb, var(--brand) 35%, transparent); }
        .auth-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .left-panel { display: none; }
        @media (min-width: 768px) { .left-panel { display: flex; } }
      `}</style>

      {/* Left decorative panel */}
      <div className="left-panel" style={{
        flex: 1, background: 'color-mix(in srgb, var(--brand) 8%, var(--surface-elevated))',
        borderRight: '1px solid var(--border)',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 48, gap: 32,
      }}>
        <div style={{ maxWidth: 360, textAlign: 'center' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: 'var(--brand)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 12px 32px color-mix(in srgb, var(--brand) 40%, transparent)',
          }}>
            <svg style={{ width: 34, height: 34, color: '#fff' }} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 32, letterSpacing: '-0.02em', marginBottom: 12 }}>
            NoteLuv
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
            Capture ideas, organize notebooks, and never lose a thought again.
          </p>

          {/* Testimonial */}
          <div style={{
            marginTop: 40, padding: '20px 24px', borderRadius: 12,
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            textAlign: 'left',
          }}>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 12, fontStyle: 'italic' }}>
              "NoteLuv replaced three apps for me. Everything just clicks."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, color: '#fff',
              }}>A</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Pratheesha B</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Product Designer</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px', position: 'relative',
      }}>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          style={{
            position: 'absolute', top: 20, right: 20,
            width: 36, height: 36, borderRadius: 8,
            border: '1px solid var(--border)', background: 'transparent',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-secondary)',
          }}
        >
          {resolvedTheme === 'dark' ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{ width: 16, height: 16 }}>
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg style={{ width: 16, height: 16 }} fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>

        <div style={{ width: '100%', maxWidth: 400 }}>
          {/* Mobile logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36, justifyContent: 'center' }} className="md-hidden">
            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg style={{ width: 18, height: 18, color: '#fff' }} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
            </div>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20 }}>NoteLuv</span>
          </div>

          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em', marginBottom: 8 }}>
            Welcome back
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 32 }}>
            Sign in to continue to your notes.{' '}
            <Link to="/register" style={{ color: 'var(--brand)', fontWeight: 600, textDecoration: 'none' }}>
              No account? Register →
            </Link>
          </p>

          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Email */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Email</label>
              <input
                type="email"
                className={`auth-input${errors.email ? ' error' : ''}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={set('email')}
                autoComplete="email"
              />
              {errors.email && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 5 }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  className={`auth-input${errors.password ? ' error' : ''}`}
                  placeholder="Your password"
                  value={form.password}
                  onChange={set('password')}
                  autoComplete="current-password"
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', padding: 0,
                  }}
                >
                  {showPass ? (
                    <svg style={{ width: 18, height: 18 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg style={{ width: 18, height: 18 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 5 }}>{errors.password}</p>}
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? (
                <>
                  <svg style={{ width: 16, height: 16, animation: 'spin 0.8s linear infinite' }} fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in...
                </>
              ) : 'Sign in'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text-muted)' }}>
            <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>← Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}