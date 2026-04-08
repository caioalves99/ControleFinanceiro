import React, { useState } from 'react';
import { authService } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, UserPlus } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegistering) {
        await authService.register(email, password);
      } else {
        await authService.signIn(email, password);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro');
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await authService.signInWithGoogle();
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao entrar com Google');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'var(--grad-primary)',
      padding: '1rem'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ margin: 0, fontSize: '2rem', color: 'var(--primary-color)' }}>FinTrack</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            {isRegistering ? 'Crie sua conta agora' : 'Bem-vindo de volta!'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              className="input"
              type="email"
              placeholder="Seu e-mail"
              style={{ paddingLeft: '40px', marginBottom: 0 }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              className="input"
              type="password"
              placeholder="Sua senha"
              style={{ paddingLeft: '40px', marginBottom: 0 }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div style={{ padding: '0.75rem', borderRadius: '0.5rem', background: '#fef2f2', color: 'var(--danger-color)', fontSize: '0.85rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <button className="btn btn-primary" type="submit" style={{ width: '100%', height: '50px' }}>
            {isRegistering ? <><UserPlus size={20} /> Criar Conta</> : <><LogIn size={20} /> Entrar</>}
          </button>
        </form>

        <div style={{ margin: '1.5rem 0', textAlign: 'center', position: 'relative' }}>
          <div className="divider" style={{ margin: 0 }}></div>
          <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'var(--card-bg)', padding: '0 10px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            OU
          </span>
        </div>

        <button 
          className="btn" 
          onClick={handleGoogleLogin}
          style={{ 
            width: '100%', 
            background: 'white', 
            color: '#444', 
            border: '1px solid #ddd',
            height: '50px'
          }}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '20px' }} />
          Entrar com Google
        </button>

        <p 
          style={{ textAlign: 'center', marginTop: '1.5rem', cursor: 'pointer', color: 'var(--primary-color)', fontWeight: 600, fontSize: '0.9rem' }} 
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering ? 'Já tem uma conta? Faça login' : 'Não tem uma conta? Cadastre-se'}
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
