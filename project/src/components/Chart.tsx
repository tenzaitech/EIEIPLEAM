import React from 'react';

interface ChartProps {
  type: 'line' | 'bar' | 'doughnut';
}

export default function Chart({ type }: ChartProps) {
  if (type === 'line') {
    return (
      <div className="h-64 flex items-end space-x-2">
        {[65, 45, 75, 85, 60, 70, 90, 80, 95, 70, 85, 75].map((height, index) => (
          <div key={index} className="flex-1 bg-primary-100 rounded-t-sm relative">
            <div
              className="bg-primary-500 rounded-t-sm transition-all duration-300 hover:bg-primary-600"
              style={{ height: `${height}%` }}
            ></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'doughnut') {
    const data = [
      { label: 'Approved', value: 45, color: 'text-secondary-500' },
      { label: 'Pending', value: 30, color: 'text-warning-500' },
      { label: 'Delivered', value: 20, color: 'text-primary-500' },
      { label: 'Cancelled', value: 5, color: 'text-error-500' },
    ];

    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="10"
            />
            {data.map((item, index) => {
              const previousSum = data.slice(0, index).reduce((sum, d) => sum + d.value, 0);
              const strokeDasharray = `${(item.value / 100) * 251.2} 251.2`;
              const strokeDashoffset = -((previousSum / 100) * 251.2);
              
              return (
                <circle
                  key={index}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={item.color.includes('secondary') ? '#388e3c' : 
                         item.color.includes('warning') ? '#f57c00' :
                         item.color.includes('primary') ? '#1976d2' : '#d32f2f'}
                  strokeWidth="10"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-neutral-900">1,247</div>
              <div className="text-sm text-neutral-500">Total Orders</div>
            </div>
          </div>
        </div>
        <div className="ml-6 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                item.color.includes('secondary') ? 'bg-secondary-500' :
                item.color.includes('warning') ? 'bg-warning-500' :
                item.color.includes('primary') ? 'bg-primary-500' : 'bg-error-500'
              }`}></div>
              <span className="text-sm text-neutral-600">{item.label}</span>
              <span className="text-sm font-medium text-neutral-900">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}