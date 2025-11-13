import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { PredictionResponse } from '../types/Student';

interface AnalyticsChartsProps {
  predictions: PredictionResponse['predictions'];
  featureImpact: { [key: string]: number };
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ 
  predictions, 
  featureImpact 
}) => {
  // Model comparison data
  const modelData = [
    { name: 'XGBoost', score: predictions.model_breakdown.xgboost_score },
    { name: 'CatBoost', score: predictions.model_breakdown.catboost_score },
    { name: 'Ensemble', score: predictions.model_breakdown.ensemble_score },
  ];

  // Feature impact data for chart
  const featureData = Object.entries(featureImpact)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));

  // Performance distribution data
  const performanceData = [
    { name: 'Low', value: 25, color: '#ef4444' },
    { name: 'Medium', value: 50, color: '#f59e0b' },
    { name: 'High', value: 25, color: '#22c55e' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-sm text-primary-600">
            Score: <span className="font-medium">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Model Comparison Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={modelData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="score" 
              fill="#0ea5e9"
              radius={[4, 4, 0, 0]}
            >
              {modelData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.name === 'Ensemble' ? '#0369a1' : '#0ea5e9'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Feature Impact Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Influencing Factors</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart 
            data={featureData} 
            layout="vertical"
            margin={{ left: 100 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={80}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Impact']}
              labelFormatter={(label) => `Factor: ${label}`}
            />
            <Bar 
              dataKey="value" 
              fill="#0ea5e9"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Distribution */}
      <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Distribution Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={performanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {performanceData.map((item, index) => (
                <div key={item.name} className="text-center">
                  <div 
                    className="w-4 h-4 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  <div className="text-2xl font-bold text-gray-700">{item.value}%</div>
                  <div className="text-xs text-gray-500">of students</div>
                </div>
              ))}
            </div>
            
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-primary-700">
                <div className={`w-3 h-3 rounded-full ${
                  predictions.performance_level === 'High' ? 'bg-green-500' :
                  predictions.performance_level === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="font-medium">Your Performance:</span>
                <span className="font-bold">{predictions.performance_level}</span>
                <span className="text-sm">(Top {100 - (predictions.performance_level === 'High' ? 25 : predictions.performance_level === 'Medium' ? 75 : 100)}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};