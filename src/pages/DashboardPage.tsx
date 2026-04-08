import React, { useEffect, useState } from 'react';
import { authService } from '../services/auth';
import { firestoreService } from '../services/firestore';
import { FinanceTransaction } from '../models/transaction';
import SummaryCard from '../components/SummaryCard';
import BarChartWidget from '../components/BarChart';
import { LogOut, Plus, Trash2, Calendar, Filter } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([]);
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [type, setType] = useState<'entrada' | 'saida'>('saida');
  const [month, setMonth] = useState(new Date().toISOString().substring(0, 7));
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = authService.subscribeToAuthChanges((u) => {
      setUser(u);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (user) {
      const unsubscribe = firestoreService.getTransactions(user.uid, month, (data) => {
        setTransactions(data);
      });
      return () => unsubscribe();
    }
  }, [user, month]);

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !description || !value || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const numericValue = parseFloat(value.replace(',', '.'));
      if (isNaN(numericValue)) throw new Error('Valor inválido');

      await firestoreService.addTransaction(user.uid, {
        description,
        value: numericValue,
        type,
        date: new Date(),
        month,
        icon: type === 'entrada' ? '💰' : '💸'
      });

      setDescription('');
      setValue('');
    } catch (err: any) {
      alert("Erro ao adicionar: " + (err.message || "Erro desconhecido"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (user && id && window.confirm('Excluir esta transação?')) {
      await firestoreService.deleteTransaction(user.uid, id);
    }
  };

  const totals = transactions.reduce((acc, curr) => {
    if (curr.type === 'entrada') acc.entrada += curr.value;
    else acc.saida += curr.value;
    return acc;
  }, { entrada: 0, saida: 0 });

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            FinTrack
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Controle suas finanças com estilo</p>
        </div>
        <button className="btn btn-ghost" onClick={() => authService.signOut()}>
          <LogOut size={18} /> Sair
        </button>
      </header>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
        <SummaryCard title="Entradas" value={totals.entrada} type="entrada" />
        <SummaryCard title="Saídas" value={totals.saida} type="saida" />
        <SummaryCard title="Balanço Total" value={totals.entrada - totals.saida} type="total" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        <div className="card">
          <h3 style={{ marginTop: 0, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={20} color="var(--primary-color)" /> Nova Transação
          </h3>
          <form onSubmit={handleAddTransaction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input className="input" placeholder="O que você comprou ou recebeu?" value={description} onChange={e => setDescription(e.target.value)} required />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input className="input" type="number" step="0.01" placeholder="R$ 0,00" value={value} onChange={e => setValue(e.target.value)} required style={{ flex: 2 }} />
              <select className="input" style={{ flex: 1 }} value={type} onChange={e => setType(e.target.value as any)}>
                <option value="saida">Saída</option>
                <option value="entrada">Entrada</option>
              </select>
            </div>
            <button className="btn btn-primary" type="submit" disabled={isSubmitting} style={{ width: '100%' }}>
              {isSubmitting ? 'Processando...' : 'Adicionar Transação'}
            </button>
          </form>
          
          <div className="divider"></div>
          <BarChartWidget data={[
            { name: 'Entradas', valor: totals.entrada },
            { name: 'Saídas', valor: totals.saida },
          ]} />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0 }}>Histórico</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--card-bg)', padding: '0.5rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
              <Calendar size={16} color="var(--text-muted)" />
              <input type="month" className="input" style={{ border: 'none', padding: 0, width: '120px', fontSize: '0.9rem', marginBottom: 0 }} value={month} onChange={e => setMonth(e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {transactions.map(t => (
              <div key={t.id} className="transaction-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--f8fafc)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', border: '1px solid var(--border-color)' }}>
                    {t.icon}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700 }}>{t.description}</p>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.date.toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem', color: t.type === 'entrada' ? 'var(--secondary-color)' : 'var(--danger-color)' }}>
                    {t.type === 'entrada' ? '+' : '-'} R$ {t.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <button className="btn-ghost" onClick={() => t.id && handleDelete(t.id)} style={{ padding: '0.5rem', borderRadius: '0.5rem' }}>
                    <Trash2 size={18} color="var(--danger-color)" />
                  </button>
                </div>
              </div>
            ))}
            {transactions.length === 0 && (
              <div className="card" style={{ textAlign: 'center', padding: '3rem', borderStyle: 'dashed' }}>
                <Filter size={40} color="var(--border-color)" style={{ marginBottom: '1rem' }} />
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>Nenhuma transação este mês.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
