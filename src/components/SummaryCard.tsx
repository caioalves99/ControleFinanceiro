import React from 'react';

interface SummaryCardProps {
  title: string;
  value: number;
  type: 'entrada' | 'saida' | 'total';
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, type }) => {
  const gradientClass = 
    type === 'entrada' ? 'card-gradient-success' : 
    type === 'saida' ? 'card-gradient-danger' : 
    'card-gradient-primary';
  
  return (
    <div className={`card ${gradientClass}`} style={{ flex: 1, minWidth: '200px' }}>
      <h3 style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9 }}>{title}</h3>
      <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.75rem', fontWeight: '800' }}>
        R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      </p>
    </div>
  );
};

export default SummaryCard;
