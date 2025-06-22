import React, { useState } from 'react';
import { Thermometer, MapPin, AlertTriangle, Zap, Wind, Droplets } from 'lucide-react';

export default function Storage() {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const storageZones = [
    {
      id: 'A1',
      name: 'Warehouse A - Zone 1',
      type: 'General Storage',
      temperature: 22,
      humidity: 45,
      capacity: 1000,
      occupied: 750,
      status: 'Normal',
      alerts: 0,
      items: ['Office Supplies', 'Packaging Materials', 'Raw Materials'],
      lastUpdated: '2025-01-14T10:30:00Z'
    },
    {
      id: 'B1',
      name: 'Cold Storage - Zone 1',
      type: 'Temperature Controlled',
      temperature: -5,
      humidity: 80,
      capacity: 500,
      occupied: 320,
      status: 'Normal',
      alerts: 0,
      items: ['Chemical Reagents', 'Biological Samples', 'Pharmaceuticals'],
      lastUpdated: '2025-01-14T10:25:00Z'
    },
    {
      id: 'C1',
      name: 'Hazardous Storage',
      type: 'Hazmat',
      temperature: 18,
      humidity: 30,
      capacity: 200,
      occupied: 45,
      status: 'Warning',
      alerts: 1,
      items: ['Flammable Chemicals', 'Corrosive Materials'],
      lastUpdated: '2025-01-14T10:20:00Z'
    },
    {
      id: 'D1',
      name: 'High Value Storage',
      type: 'Secure',
      temperature: 20,
      humidity: 40,
      capacity: 300,
      occupied: 180,
      status: 'Normal',
      alerts: 0,
      items: ['IT Equipment', 'Precision Instruments', 'Valuable Components'],
      lastUpdated: '2025-01-14T10:35:00Z'
    },
    {
      id: 'E1',
      name: 'Incoming Goods',
      type: 'Receiving',
      temperature: 25,
      humidity: 55,
      capacity: 400,
      occupied: 380,
      status: 'Critical',
      alerts: 2,
      items: ['Pending Inspection', 'Recent Deliveries', 'Returns Processing'],
      lastUpdated: '2025-01-14T10:40:00Z'
    },
    {
      id: 'F1',
      name: 'Shipping Dock',
      type: 'Dispatch',
      temperature: 24,
      humidity: 50,
      capacity: 350,
      occupied: 120,
      status: 'Normal',
      alerts: 0,
      items: ['Ready to Ship', 'Packaging Area', 'Loading Zone'],
      lastUpdated: '2025-01-14T10:15:00Z'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Normal': return 'text-secondary-600 bg-secondary-50 border-secondary-200';
      case 'Warning': return 'text-warning-600 bg-warning-50 border-warning-200';
      case 'Critical': return 'text-error-600 bg-error-50 border-error-200';
      default: return 'text-neutral-600 bg-neutral-50 border-neutral-200';
    }
  };

  const getCapacityColor = (occupied: number, capacity: number) => {
    const percentage = (occupied / capacity) * 100;
    if (percentage >= 90) return 'bg-error-500';
    if (percentage >= 75) return 'bg-warning-500';
    return 'bg-secondary-500';
  };

  const getTempColor = (temp: number, type: string) => {
    if (type === 'Temperature Controlled') {
      return temp >= -10 && temp <= 5 ? 'text-secondary-600' : 'text-error-600';
    }
    return temp >= 15 && temp <= 25 ? 'text-secondary-600' : 'text-warning-600';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Storage Management</h1>
        <p className="text-neutral-600 mt-2">Monitor storage conditions, capacity, and environmental controls</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Total Zones</p>
              <p className="text-2xl font-bold text-neutral-900 mt-2">{storageZones.length}</p>
            </div>
            <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Total Capacity</p>
              <p className="text-2xl font-bold text-neutral-900 mt-2">
                {storageZones.reduce((sum, zone) => sum + zone.capacity, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-secondary-500 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Occupied</p>
              <p className="text-2xl font-bold text-neutral-900 mt-2">
                {storageZones.reduce((sum, zone) => sum + zone.occupied, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-warning-500 rounded-lg flex items-center justify-center">
              <Wind className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Active Alerts</p>
              <p className="text-2xl font-bold text-neutral-900 mt-2">
                {storageZones.reduce((sum, zone) => sum + zone.alerts, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-error-500 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Storage Zones Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {storageZones.map((zone) => (
          <div
            key={zone.id}
            className={`bg-white rounded-xl shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-all cursor-pointer ${
              selectedZone === zone.id ? 'ring-2 ring-primary-500 border-primary-300' : ''
            }`}
            onClick={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">{zone.name}</h3>
                <p className="text-sm text-neutral-500">{zone.id} • {zone.type}</p>
              </div>
              <div className="flex items-center space-x-2">
                {zone.alerts > 0 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-error-600 bg-error-50">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {zone.alerts}
                  </span>
                )}
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(zone.status)}`}>
                  {zone.status}
                </span>
              </div>
            </div>

            {/* Environmental Conditions */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <Thermometer className={`w-4 h-4 ${getTempColor(zone.temperature, zone.type)}`} />
                <div>
                  <p className="text-xs text-neutral-500">Temperature</p>
                  <p className={`text-sm font-medium ${getTempColor(zone.temperature, zone.type)}`}>{zone.temperature}°C</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Droplets className="w-4 h-4 text-primary-500" />
                <div>
                  <p className="text-xs text-neutral-500">Humidity</p>
                  <p className="text-sm font-medium text-neutral-900">{zone.humidity}%</p>
                </div>
              </div>
            </div>

            {/* Capacity */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-neutral-700">Capacity</span>
                <span className="text-sm text-neutral-500">
                  {zone.occupied}/{zone.capacity} ({Math.round((zone.occupied / zone.capacity) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getCapacityColor(zone.occupied, zone.capacity)}`}
                  style={{ width: `${(zone.occupied / zone.capacity) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-neutral-700">Stored Items:</p>
              <div className="flex flex-wrap gap-1">
                {zone.items.map((item, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 text-xs bg-neutral-100 text-neutral-600 rounded-md"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {selectedZone === zone.id && (
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-neutral-500">Last Updated:</p>
                    <p className="font-medium text-neutral-900">
                      {new Date(zone.lastUpdated).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-neutral-500">Available Space:</p>
                    <p className="font-medium text-neutral-900">
                      {zone.capacity - zone.occupied} units
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-3">
                  <button className="px-3 py-1 text-xs bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors">
                    View Details
                  </button>
                  <button className="px-3 py-1 text-xs border border-neutral-300 text-neutral-700 rounded-md hover:bg-neutral-50 transition-colors">
                    Adjust Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Zone Map Placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Storage Layout</h3>
        <div className="bg-neutral-50 rounded-lg p-8 text-center">
          <MapPin className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-neutral-700 mb-2">Interactive Storage Map</h4>
          <p className="text-neutral-500">
            Visual representation of storage zones would be displayed here with real-time status indicators.
          </p>
        </div>
      </div>
    </div>
  );
}