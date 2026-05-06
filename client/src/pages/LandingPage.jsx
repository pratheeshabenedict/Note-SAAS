import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: 'Notebooks',
    desc: 'Organize notes into beautiful, color-coded notebooks for every area of your life.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Rich Editor',
    desc: 'Write with a powerful TipTap editor — bold, tables, code blocks, and more.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
    title: 'Tags & Search',
    desc: 'Tag anything, find everything. Full-text search across all your notes instantly.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    title: 'Pin & Favorite',
    desc: 'Pin important notes to the top. Mark favorites for lightning-fast access.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ),
    title: 'Dark & Light',
    desc: 'Seamlessly switch between dark and light themes — your eyes, your choice.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Secure & Private',
    desc: 'JWT auth with refresh token rotation. Your notes stay yours, always.',
  },
];

export default function LandingPage() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const heroRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      style={{
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        background: 'var(--surface)',
        color: 'var(--text-primary)',
        minHeight: '100vh',
        overflowX: 'hidden',
      }}
    >
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');

        .landing-nav { transition: all 0.3s ease; }
        .landing-nav.scrolled {
          background: var(--surface-elevated);
          box-shadow: 0 1px 0 var(--border);
          backdrop-filter: blur(12px);
        }
        .hero-gradient {
          background: radial-gradient(ellipse 80% 50% at 50% -10%, color-mix(in srgb, var(--brand) 18%, transparent), transparent);
        }
        .feature-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.12);
        }
        .glow-btn {
          transition: all 0.2s ease;
          box-shadow: 0 0 0 0 var(--brand);
        }
        .glow-btn:hover {
          box-shadow: 0 0 24px 4px color-mix(in srgb, var(--brand) 35%, transparent);
          transform: translateY(-1px);
        }
        .float-anim {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .fade-in {
          animation: fadeIn 0.7s ease both;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .badge-pulse::before {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 99px;
          background: color-mix(in srgb, var(--brand) 20%, transparent);
          animation: pulse 2s ease-in-out infinite;
        }
       @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }

        /* ── Responsive ── */

      /* Mobile: ≤ 480px */
        @media (max-width: 480px) {
          .landing-nav-actions { display: none !important; }
          .hamburger-btn { display: flex !important; }
          .mobile-menu { display: flex !important; }
          .mobile-menu.closed { display: none !important; }
          .hero-section { padding-top: 100px !important; padding-bottom: 60px !important; }
          .hero-heading { font-size: 36px !important; }
          .hero-sub { font-size: 15px !important; }
          .hero-btns { flex-direction: column !important; align-items: center; }
          .hero-btns a { width: 100%; max-width: 280px; text-align: center; }
          .app-preview { margin-top: 40px !important; }
          .mock-sidebar { display: none !important; }
          .features-section { padding: 60px 16px !important; }
          .cta-section { padding: 60px 16px 80px !important; }
        }

        /* Tablet: 481px – 768px */
        @media (min-width: 481px) and (max-width: 768px) {
          .hero-section { padding-top: 120px !important; padding-bottom: 70px !important; }
          .hero-heading { font-size: 48px !important; }
          .app-preview { margin-top: 48px !important; }
          .mock-sidebar { width: 150px !important; }
          .features-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .features-section { padding: 80px 20px !important; }
        }

        /* Small desktop: 769px – 1024px */
        @media (min-width: 769px) and (max-width: 1024px) {
          .features-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .hero-heading { font-size: 58px !important; }
        }
      `}</style>

      {/* Navbar */}
      <nav
        className={`landing-nav fixed top-0 left-0 right-0 z-50 ${scrolled ? 'scrolled' : ''}`}
        style={{ padding: '0 24px' }}
      >
        <div className="landing-nav-inner" style={{ maxWidth: 1120, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          {/* Logo */}
          <div className="landing-nav-logo" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'var(--brand)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#fff' }}>
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
            </div>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, letterSpacing: '-0.02em' }}>
              NoteLuv
            </span>
          </div>

          {/* Actions */}
          <div className="landing-nav-actions" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={toggleTheme}
              style={{
                width: 36, height: 36, borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'transparent',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-secondary)',
              }}
            >
              {resolvedTheme === 'dark' ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            <Link
              to="/login"
              style={{
                padding: '8px 18px', borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'transparent',
                color: 'var(--text-primary)',
                textDecoration: 'none',
                fontSize: 14, fontWeight: 500,
              }}
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="glow-btn"
              style={{
                padding: '8px 18px', borderRadius: 8,
                background: 'var(--brand)',
                color: '#fff',
                textDecoration: 'none',
                fontSize: 14, fontWeight: 600,
                display: 'inline-block',
              }}
            >
              Get started
            </Link>
          </div>

          {/* ── Hamburger button (mobile/tablet only, hidden by default via CSS) ── */}
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen(prev => !prev)}
            style={{
              display: 'none',          // shown via CSS media query
              alignItems: 'center',
              justifyContent: 'center',
              width: 38, height: 38,
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'transparent',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              flexShrink: 0,
            }}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              // X icon
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Hamburger icon
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
        <div
          className={`mobile-menu ${menuOpen ? '' : 'closed'}`}
          style={{
            display: 'none',
            flexDirection: 'column',
            position: 'fixed',
            top: 64,
            left: 0, right: 0,
            zIndex: 49,
            background: resolvedTheme === 'dark'
              ? 'rgba(15, 15, 20, 0.97)'       // ← solid dark overlay
              : 'rgba(255, 255, 255, 0.97)',    // ← solid light overlay
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid var(--border)',
            padding: '20px 24px',
            gap: 12,
            boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
          }}
        >
          {/* Theme toggle row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              {resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode'}
            </span>
            <button
              onClick={toggleTheme}
              style={{
                width: 36, height: 36, borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'transparent',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-secondary)',
              }}
            >
              {resolvedTheme === 'dark' ? (
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>

          <div style={{ height: 1, background: 'var(--border)' }} />

          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            style={{
              padding: '12px 16px', borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--text-primary)',
              textDecoration: 'none',
              fontSize: 15, fontWeight: 500,
              textAlign: 'center',
            }}
          >
            Log in
          </Link>
          <Link
            to="/register"
            onClick={() => setMenuOpen(false)}
            className="glow-btn"
            style={{
              padding: '12px 16px', borderRadius: 8,
              background: 'var(--brand)',
              color: '#fff',
              textDecoration: 'none',
              fontSize: 15, fontWeight: 600,
              textAlign: 'center',
              display: 'block',
            }}
          >
            Get started →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section
        className="hero-gradient hero-section"
        ref={heroRef}
        style={{ paddingTop: 140, paddingBottom: 100, textAlign: 'center', position: 'relative' }}
      >
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px' }}>
          {/* Badge */}
          <div
            className="fade-in"
            style={{ animationDelay: '0s', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 28, position: 'relative' }}
          >
            <span
              className="badge-pulse"
              style={{
                position: 'relative',
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', borderRadius: 99,
                border: '1px solid color-mix(in srgb, var(--brand) 30%, transparent)',
                background: 'color-mix(in srgb, var(--brand) 8%, transparent)',
                fontSize: 13, fontWeight: 500, color: 'var(--brand)',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand)', display: 'inline-block' }} />
              Your second brain, reimagined
            </span>
          </div>

          {/* Heading */}
          <h1
            className="fade-in hero-heading"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(40px, 7vw, 72px)',
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              marginBottom: 24,
              animationDelay: '0.1s',
            }}
          >
            Notes that{' '}
            <span style={{ color: 'var(--brand)', display: 'inline-block' }}>think</span>
            <br />with you
          </h1>

          <p
            className="fade-in hero-sub"
            style={{
              fontSize: 18, lineHeight: 1.65,
              color: 'var(--text-secondary)',
              marginBottom: 40, animationDelay: '0.2s',
            }}
          >
            NoteLuv is a fast, beautiful note-taking app for people who think in systems.
            Organize notebooks, write richly, find anything.
          </p>

          <div className="fade-in hero-btns" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', animationDelay: '0.3s' }}>
            <Link
              to="/register"
              className="glow-btn"
              style={{
                padding: '14px 28px', borderRadius: 10,
                background: 'var(--brand)',
                color: '#fff',
                textDecoration: 'none',
                fontSize: 15, fontWeight: 600,
                display: 'inline-block',
              }}
            >
              Start for free
            </Link>
            <Link
              to="/login"
              style={{
                padding: '14px 28px', borderRadius: 10,
                border: '1px solid var(--border)',
                background: 'var(--surface-elevated)',
                color: 'var(--text-primary)',
                textDecoration: 'none',
                fontSize: 15, fontWeight: 500,
                display: 'inline-block',
                transition: 'all 0.2s',
              }}
            >
              Sign in →
            </Link>
          </div>
        </div>

        {/* App Preview */}
        <div
          className="fade-in float-anim app-preview"
          style={{
            maxWidth: 860, margin: '64px auto 0',
            padding: '0 24px',
            animationDelay: '0.4s',
          }}
        >
          <div
            style={{
              borderRadius: 16,
              border: '1px solid var(--border)',
              background: 'var(--surface-elevated)',
              overflow: 'hidden',
              boxShadow: '0 32px 80px rgba(0,0,0,0.18)',
            }}
          >
            {/* Window chrome */}
            <div style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--surface)',
            }}>
              {['#ff5f57', '#ffbd2e', '#28c840'].map((c, i) => (
                <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
              ))}
              <div style={{
                flex: 1, height: 24, borderRadius: 6,
                background: 'var(--surface-elevated)',
                marginLeft: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>NoteLuv.app/dashboard</span>
              </div>
            </div>

            {/* Mock dashboard */}
            <div style={{ display: 'flex', height: 360 }}>
              {/* Sidebar mock */}
              <div className="mock-sidebar" style={{
                width: 200, borderRight: '1px solid var(--border)',
                background: 'var(--surface)',
                padding: 16, flexShrink: 0,
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {['All Notes', 'Starred', 'Recent', 'Trash'].map((item, i) => (
                    <div key={i} style={{
                      padding: '7px 10px', borderRadius: 7,
                      background: i === 0 ? 'color-mix(in srgb, var(--brand) 12%, transparent)' : 'transparent',
                      color: i === 0 ? 'var(--brand)' : 'var(--text-secondary)',
                      fontSize: 13, fontWeight: i === 0 ? 600 : 400,
                    }}>
                      {item}
                    </div>
                  ))}
                  <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }} />
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', padding: '4px 10px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Notebooks</div>
                  {[
                    { name: 'Work', color: '#6366f1' },
                    { name: 'Personal', color: '#10b981' },
                    { name: 'Ideas', color: '#f59e0b' },
                  ].map((nb, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', fontSize: 13, color: 'var(--text-secondary)' }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: nb.color, flexShrink: 0 }} />
                      {nb.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes list mock */}
              <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { title: 'Q4 Planning Notes', tag: 'Work', time: '2h ago', preview: 'Review OKRs and set goals for the upcoming quarter...' },
                  { title: 'Book Summary: Atomic Habits', tag: 'Personal', time: 'Yesterday', preview: 'Tiny changes, remarkable results. The 1% rule...' },
                  { title: 'API Design Principles', tag: 'Work', time: '3d ago', preview: 'RESTful conventions and GraphQL trade-offs...' },
                ].map((note, i) => (
                  <div key={i} style={{
                    padding: 14, borderRadius: 10,
                    border: '1px solid var(--border)',
                    background: i === 0 ? 'color-mix(in srgb, var(--brand) 5%, var(--surface-elevated))' : 'var(--surface-elevated)',
                    borderColor: i === 0 ? 'color-mix(in srgb, var(--brand) 25%, transparent)' : 'var(--border)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{note.title}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{note.time}</span>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {note.preview}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section" style={{ padding: '100px 24px', maxWidth: 1120, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-0.025em', marginBottom: 16,
          }}>
            Everything you need, nothing you don't
          </h2>
          <p style={{ fontSize: 17, color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto' }}>
            Built for thinkers, writers, and builders who want their tools to stay out of the way.
          </p>
        </div>

        <div className="features-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 20,
        }}>
          {features.map((f, i) => (
            <div
              key={i}
              className="feature-card"
              style={{
                padding: 28, borderRadius: 14,
                border: '1px solid var(--border)',
                background: 'var(--surface-elevated)',
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: 'color-mix(in srgb, var(--brand) 12%, transparent)',
                color: 'var(--brand)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16,
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" style={{
        padding: '80px 24px 100px',
        textAlign: 'center',
        borderTop: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-0.025em', marginBottom: 16,
          }}>
            Ready to think clearer?
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 36 }}>
            Join thousands of people who capture ideas, plans, and memories with NoteLuv.
          </p>
          <Link
            to="/register"
            className="glow-btn"
            style={{
              padding: '14px 36px', borderRadius: 10,
              background: 'var(--brand)', color: '#fff',
              textDecoration: 'none', fontSize: 15, fontWeight: 600,
              display: 'inline-block',
            }}
          >
            Create free account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '24px',
        textAlign: 'center',
        fontSize: 13,
        color: 'var(--text-muted)',
      }}>
        © {new Date().getFullYear()} NoteLuv. Built with ♥ for note-takers everywhere.
      </footer>
    </div>
  );
}