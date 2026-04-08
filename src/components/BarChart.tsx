import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ChartData {
  name: string;
  valor: number;
}

interface BarChartWidgetProps {
  data: ChartData[];
}

const BarChartWidget: React.FC<BarChartWidgetProps> = ({ data }) => {
  return (
    <div className="card" style={{ height: '300px', width: '100%', marginTop: '1.5rem', background: 'transparent', border: 'none', boxShadow: 'none' }}>
      <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem', color: 'var(--text-main)' }}>Fluxo Mensal</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip 
            formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`}
            contentStyle={{ 
              borderRadius: '12px', 
              border: '1px solid #1e293b', 
              background: '#0f172a',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)' 
            }}
            itemStyle={{ color: '#fff' }}
          />
          <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.name === 'Entradas' ? 'var(--secondary-color)' : 'var(--danger-color)'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartWidget;
