import React, { useState } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, Clock, AlertTriangle, Settings } from 'lucide-react';

export default function Processing() {
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);

  const processes = [
    {
      id: 'PROC-001',
      name: 'Quality Control Inspection',
      type: 'Quality Assurance',
      status: 'In Progress',
      progress: 65,
      startTime: '2025-01-14T08:00:00Z',
      estimatedCompletion: '2025-01-14T16:00:00Z',
      operator: 'Sarah Johnson',
      batchId: 'BATCH-2025-001',
      items: 500,
      completedItems: 325,
      temperature: 22,
      priority: 'High',
      steps: [
        { name: 'Initial Inspection', status: 'completed', duration: '2 hours' },
        { name: 'Detailed Testing', status: 'in-progress', duration: '4 hours' },
        { name: 'Documentation', status: 'pending', duration: '1 hour' },
        { name: 'Final Approval', status: 'pending', duration: '1 hour' }
      ]
    },
    {
      id: 'PROC-002',
      name: 'Material Processing',
      type: 'Manufacturing',
      status: 'Running',
      progress: 90,
      startTime: '2025-01-14T06:00:00Z',
      estimatedCompletion: '2025-01-14T14:00:00Z',
      operator: 'Michael Chen',
      batchId: 'BATCH-2025-002',
      items: 1000,
      completedItems: 900,
      temperature: 85,
      priority: 'Medium',
      steps: [
        { name: 'Raw Material Prep', status: 'completed', duration: '1 hour' },
        { name: 'Heating Process', status: 'completed', duration: '3 hours' },
        { name: 'Molding', status: 'in-progress', duration: '2 hours' },
        { name: 'Cooling', status: 'pending', duration: '2 hours' }
      ]
    },
    {
      id: 'PROC-003',
      name: 'Packaging Line A',
      type: 'Packaging',
      status: 'Paused',
      progress: 45,
      startTime: '2025-01-14T09:00:00Z',
      estimatedCompletion: '2025-01-14T17:00:00Z',
      operator: 'Robert Wilson',
      batchId: 'BATCH-2025-003',
      items: 2000,
      completedItems: 900,
      temperature: 20,
      priority: 'Low',
      steps: [
        { name: 'Product Sorting', status: 'completed', duration: '2 hours' },
        { name: 'Primary Packaging', status: 'in-progress', duration: '3 hours' },
        { name: 'Labeling', status: 'pending', duration: '2 hours' },
        { name: 'Final Packaging', status: 'pending', duration: '1 hour' }
      ]
    },
    {
      id: 'PROC-004',
      name: 'Chemical Synthesis',
      type: 'Laboratory',
      status: 'Completed',
      progress: 100,
      startTime: '2025-01-13T10:00:00Z',
      estimatedCompletion: '2025-01-13T18:00:00Z',
      operator: 'Dr. Emily Davis',
      batchId: 'BATCH-2025-004',
      items: 50,
      completedItems: 50,
      temperature: 15,
      priority: 'High',
      steps: [
        { name: 'Reagent Preparation', status: 'completed', duration: '1 hour' },
        { name: 'Synthesis Reaction', status: 'completed', duration: '4 hours' },
        { name: 'Purification', status: 'completed', duration: '2 hours' },
        { name: 'Quality Testing', status: 'completed', duration: '1 hour' }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Running':
      case 'In Progress': return 'text-primary-600 bg-primary-50';
      case 'Completed': return 'text-secondary-600 bg-secondary-50';
      case 'Paused': return 'text-warning-600 bg-warning-50';
      case 'Error': return 'text-error-600 bg-error-50';
      default: return 'text-neutral-600 bg-neutral-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Running':
      case 'In Progress': return Play;
      case 'Completed': return CheckCircle;
      case 'Paused': return Pause;
      case 'Error': return AlertTriangle;
      default: return Clock;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-error-600 bg-error-50';
      case 'Medium': return 'text-warning-600 bg-warning-50';
      case 'Low': return 'text-secondary-600 bg-secondary-50';
      default: return 'text-neutral-600 bg-neutral-50';
    }
  };

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in-progress': return Play;
      case 'pending': return Clock;
      default: return Clock;
    }
  };

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-secondary-500';
      case 'in-progress': return 'text-primary-500';
      case 'pending': return 'text-neutral-400';
      default: return 'text-neutral-400';
    }
  };

  const formatTimeRemaining = (estimatedCompletion: string) => {
    const now = new Date();
    const completion = new Date(estimatedCompletion);
    const diff = completion.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    } else if (minutes > 0) {
      return `${minutes}m remaining`;
    } else {
      return 'Completing soon';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Processing Management</h1>
        <p className="text-neutral-600 mt-2">Monitor and control manufacturing and processing operations</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Active Processes</p>
              <p className="text-2xl font-bold text-neutral-900 mt-2">
                {processes.filter(p => p.status === 'Running' || p.status === 'In Progress').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
              <Play className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Completed Today</p>
              <p className="text-2xl font-bold text-neutral-900 mt-2">
                {processes.filter(p => p.status === 'Completed').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-secondary-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Paused</p>
              <p className="text-2xl font-bold text-neutral-900 mt-2">
                {processes.filter(p => p.status === 'Paused').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-warning-500 rounded-lg flex items-center justify-center">
              <Pause className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Average Progress</p>
              <p className="text-2xl font-bold text-neutral-900 mt-2">
                {Math.round(processes.reduce((sum, p) => sum + p.progress, 0) / processes.length)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-neutral-500 rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Processes List */}
      <div className="space-y-6">
        {processes.map((process) => {
          const StatusIcon = getStatusIcon(process.status);
          const isExpanded = selectedProcess === process.id;
          
          return (
            <div key={process.id} className="bg-white rounded-xl shadow-sm border border-neutral-200">
              <div
                className="p-6 cursor-pointer hover:bg-neutral-50 transition-colors"
                onClick={() => setSelectedProcess(isExpanded ? null : process.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
                      <StatusIcon className={`w-6 h-6 ${getStatusColor(process.status).split(' ')[0]}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900">{process.name}</h3>
                      <p className="text-sm text-neutral-500">{process.id} • {process.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(process.priority)}`}>
                      {process.priority}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(process.status)}`}>
                      {process.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-neutral-700">Progress</span>
                      <span className="text-sm text-neutral-500">{process.progress}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${process.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Items Processed</p>
                    <p className="text-lg font-semibold text-neutral-900">
                      {process.completedItems.toLocaleString()} / {process.items.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Time Remaining</p>
                    <p className="text-lg font-semibold text-neutral-900">
                      {process.status === 'Completed' ? 'Completed' : formatTimeRemaining(process.estimatedCompletion)}
                    </p>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-neutral-200 p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-semibold text-neutral-900 mb-4">Process Details</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Operator:</span>
                          <span className="font-medium text-neutral-900">{process.operator}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Batch ID:</span>
                          <span className="font-medium text-neutral-900">{process.batchId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Start Time:</span>
                          <span className="font-medium text-neutral-900">
                            {new Date(process.startTime).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Temperature:</span>
                          <span className="font-medium text-neutral-900">{process.temperature}°C</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-neutral-900 mb-4">Process Steps</h4>
                      
                      <div className="space-y-3">
                        {process.steps.map((step, index) => {
                          const StepIcon = getStepStatusIcon(step.status);
                          return (
                            <div key={index} className="flex items-center space-x-3">
                              <StepIcon className={`w-5 h-5 ${getStepStatusColor(step.status)}`} />
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className={`text-sm font-medium ${
                                    step.status === 'completed' ? 'text-neutral-900' :
                                    step.status === 'in-progress' ? 'text-primary-600' :
                                    'text-neutral-500'
                                  }`}>
                                    {step.name}
                                  </span>
                                  <span className="text-xs text-neutral-400">{step.duration}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-200">
                    <div className="flex items-center space-x-3">
                      {process.status === 'Running' || process.status === 'In Progress' ? (
                        <button className="px-4 py-2 bg-warning-500 text-white rounded-lg hover:bg-warning-600 transition-colors flex items-center space-x-2">
                          <Pause className="w-4 h-4" />
                          <span>Pause</span>
                        </button>
                      ) : process.status === 'Paused' ? (
                        <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2">
                          <Play className="w-4 h-4" />
                          <span>Resume</span>
                        </button>
                      ) : null}
                      <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors flex items-center space-x-2">
                        <RotateCcw className="w-4 h-4" />
                        <span>Restart</span>
                      </button>
                    </div>
                    <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors flex items-center space-x-2">
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}