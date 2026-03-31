'use client';

import { Component, ReactNode } from 'react';

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error?: Error; }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Open Sans', sans-serif", background: '#f8f9fa' }}>
          <div style={{ textAlign: 'center', maxWidth: 400 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>Something went wrong</h2>
            <p style={{ fontSize: 14, color: '#6c757d', marginBottom: 20 }}>An unexpected error occurred. Please try refreshing the page.</p>
            <button onClick={() => window.location.reload()} style={{ padding: '10px 24px', fontSize: 14, fontWeight: 700, color: 'white', background: '#0a1628', border: 'none', borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit' }}>
              Refresh page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
