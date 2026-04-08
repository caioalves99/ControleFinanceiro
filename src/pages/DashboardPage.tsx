import React, { useEffect, useState } from 'react';
import { authService } from '../services/auth';
import { firestoreService } from '../services/firestore';
import { FinanceTransaction } from '../models/transaction';
import SummaryCard from '../components/SummaryCard';
import BarChartWidget from '../components/BarChart';
import { LogOut, Plus, Trash2 } from 'lucide-react';

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
      if (isNaN(numericValue)) {
        throw new Error('Valor inválido');
      }

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
      console.error("Erro ao adicionar transação:", err);
      alert("Erro ao adicionar transação: " + (err.message || "Verifique sua conexão ou permissões do Firebase."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (user && id) {
      await firestoreService.deleteTransaction(user.uid, id);
    }
  };

  const totals = transactions.reduce((acc, curr) => {
    if (curr.type === 'entrada') acc.entrada += curr.value;
    else acc.saida += curr.value;
    return acc;
  }, { entrada: 0, saida: 0 });

  const chartData = [
    { name: 'Entradas', valor: totals.entrada },
    { name: 'Saídas', valor: totals.saida },
  ];

  return (
    <div className="container" style={{ paddingBottom: '5rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Meus Gastos</h1>
        <button className="btn" onClick={() => authService.signOut()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger-color)' }}>
          <LogOut size={20} /> Sair
        </button>
      </header>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <SummaryCard title="Entradas" value={totals.entrada} type="entrada" />
        <SummaryCard title="Saídas" value={totals.saida} type="saida" />
        <SummaryCard title="Balanço" value={totals.entrada - totals.saida} type="total" />
      </div>

      <BarChartWidget data={chartData} />

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Nova Transação</h3>
        <form onSubmit={handleAddTransaction} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input className="input" style={{ flex: 2, marginBottom: 0 }} placeholder="Descrição" value={description} onChange={e => setDescription(e.target.value)} required />
          <input className="input" style={{ flex: 1, marginBottom: 0 }} type="number" step="0.01" placeholder="Valor" value={value} onChange={e => setValue(e.target.value)} required />
          <select className="input" style={{ flex: 1, marginBottom: 0 }} value={type} onChange={e => setType(e.target.value as any)}>
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
          </select>
          <button className="btn btn-primary" type="submit" disabled={isSubmitting} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: isSubmitting ? 0.7 : 1 }}>
            <Plus size={20} /> {isSubmitting ? 'Adicionando...' : 'Adicionar'}
          </button>
        </form>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>Transações</h3>
          <input type="month" className="input" style={{ width: 'auto', marginBottom: 0 }} value={month} onChange={e => setMonth(e.target.value)} />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {transactions.map(t => (
            <div key={t.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{t.icon}</span>
                <div>
                  <p style={{ margin: 0, fontWeight: 600 }}>{t.description}</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.date.toLocaleDateString()}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <p style={{ margin: 0, fontWeight: 'bold', color: t.type === 'entrada' ? 'var(--secondary-color)' : 'var(--danger-color)' }}>
                  {t.type === 'entrada' ? '+' : '-'} R$ {t.value.toLocaleString('pt-BR')}
                </p>
                <button onClick={() => t.id && handleDelete(t.id)} style={{ background: 'none', border: 'none', color: 'var(--danger-color)', cursor: 'pointer' }}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {transactions.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>Nenhuma transação encontrada.</p>}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
