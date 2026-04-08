import React from 'react';

interface SummaryCardProps {
  title: string;
  value: number;
  type: 'entrada' | 'saida' | 'total';
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, type }) => {
  const color = type === 'entrada' ? 'var(--secondary-color)' : type === 'saida' ? 'var(--danger-color)' : 'var(--primary-color)';
  
  return (
    <div className="card" style={{ flex: 1, minWidth: '200px' }}>
      <h3 style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>{title}</h3>
      <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.5rem', fontWeight: 'bold', color }}>
        R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      </p>
    </div>
  );
};

export default SummaryCard;
