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
    <div className="card" style={{ height: '300px', width: '100%', marginTop: '1.5rem' }}>
      <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Fluxo Mensal</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip 
            formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
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
