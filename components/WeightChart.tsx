import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { WeightEntry } from '../types';

interface WeightChartProps {
  data: WeightEntry[];
}

export const WeightChart: React.FC<WeightChartProps> = ({ data }) => {
  const formattedData = [...data].sort((a, b) => a.date - b.date).map(entry => ({
    ...entry,
    formattedDate: new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }));

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-700 text-gray-500 font-['VT323'] text-xl">
        NO DATA LOGGED YET
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData}>
          <CartesianGrid stroke="#333" strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="formattedDate" 
            stroke="#ff00ff" 
            tick={{ fill: '#ff00ff', fontFamily: 'Share Tech Mono', fontSize: 12 }}
            tickLine={false}
          />
          <YAxis 
            stroke="#00ffff" 
            tick={{ fill: '#00ffff', fontFamily: 'Share Tech Mono', fontSize: 12 }}
            tickLine={false}
            domain={['auto', 'auto']}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f0f1a', borderColor: '#ff00ff', color: '#fff' }}
            itemStyle={{ color: '#00ffff' }}
            labelStyle={{ color: '#ff00ff' }}
          />
          <Line 
            type="monotone" 
            dataKey="weight" 
            stroke="#00ffff" 
            strokeWidth={3}
            dot={{ fill: '#ff00ff', r: 4, strokeWidth: 0 }}
            activeDot={{ r: 8, fill: '#fff' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
