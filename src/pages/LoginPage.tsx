import React, { useState } from 'react';
import { authService } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      await authService.signInWithGoogle();
      navigate('/');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/popup-blocked') {
        setError('O pop-up de login foi bloqueado pelo seu navegador. Por favor, permita pop-ups.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('Este domínio não está autorizado no Firebase Console (caioalves99.github.io).');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('O login com Google não foi ativado no Firebase Console.');
      } else {
        setError('Erro ao entrar: ' + (err.message || 'Verifique sua conexão.'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#060b18',
      padding: '1rem'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '3rem', textAlign: 'center' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            background: 'var(--f8fafc)', 
            borderRadius: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 1rem auto',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <LogIn size={32} color="var(--primary-color)" />
          </div>
          <h1 style={{ margin: 0, fontSize: '2rem', color: 'var(--primary-color)' }}>FinTrack</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Gerencie suas finanças de forma simples e rápida.
          </p>
        </div>

        {error && (
          <div style={{ 
            padding: '0.75rem', 
            borderRadius: '0.75rem', 
            background: '#fef2f2', 
            color: 'var(--danger-color)', 
            fontSize: '0.85rem', 
            marginBottom: '1.5rem',
            border: '1px solid #fee2e2'
          }}>
            {error}
          </div>
        )}

        <button 
          className="btn" 
          onClick={handleGoogleLogin}
          disabled={isLoading}
          style={{ 
            width: '100%', 
            background: 'white', 
            color: '#1f2937', 
            border: '1px solid var(--border-color)',
            height: '56px',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1
          }}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '22px' }} />
          {isLoading ? 'Entrando...' : 'Entrar com Google'}
        </button>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '2.5rem' }}>
          Ao entrar, você concorda com nossos termos de uso.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
