import React from 'react';
import { DivideIcon as LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
  color: 'primary' | 'secondary' | 'warning' | 'error';
}

const colorClasses = {
  primary: 'from-primary-500 to-primary-600',
  secondary: 'from-secondary-500 to-secondary-600',
  warning: 'from-warning-500 to-warning-600',
  error: 'from-error-500 to-error-600',
};

const trendClasses = {
  up: 'text-secondary-600 bg-secondary-50',
  down: 'text-error-600 bg-error-50',
};

export default function StatCard({ title, value, change, trend, icon: Icon, color }: StatCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-neutral-900 mb-3">{value}</p>
          <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${trendClasses[trend]}`}>
            <TrendIcon className="w-3 h-3 mr-1.5" />
            {change}
          </div>
        </div>
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${colorClasses[color]} shadow-lg`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </div>
  );
}