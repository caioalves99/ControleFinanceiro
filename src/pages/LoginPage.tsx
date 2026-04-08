import React, { useState } from 'react';
import { authService } from '../services/auth';
import { useNavigate } from 'react-router-dom';

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

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          {isRegistering ? 'Criar Conta' : 'Entrar no Controle'}
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            className="input"
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p style={{ color: 'var(--danger-color)', marginBottom: '1rem' }}>{error}</p>}
          <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>
            {isRegistering ? 'Cadastrar' : 'Entrar'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem', cursor: 'pointer', color: 'var(--primary-color)' }} onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? 'Já tem uma conta? Entre' : 'Não tem conta? Cadastre-se'}
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
