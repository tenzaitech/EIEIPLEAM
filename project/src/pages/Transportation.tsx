import React, { useState } from 'react';
import { Truck, MapPin, Clock, Package, Route, Calendar, Filter, Search } from 'lucide-react';

export default function Transportation() {
  const [selectedView, setSelectedView] = useState<'calendar' | 'list'>('calendar');

  const shipments = [
    {
      id: 'SHIP-001',
      orderId: 'PO-2025-001',
      destination: 'New York, NY',
      driver: 'John Smith',
      vehicle: 'Truck-001',
      status: 'In Transit',
      departureTime: '2025-01-14T08:00:00Z',
      estimatedArrival: '2025-01-14T16:00:00Z',
      actualArrival: null,
      distance: '245 miles',
      packages: 15,
      weight: '2,450 lbs',
      priority: 'High',
      route: 'Route A-1',
      currentLocation: 'Philadelphia, PA'
    },
    {
      id: 'SHIP-002',
      orderId: 'PO-2025-002',
      destination: 'Boston, MA',
      driver: 'Sarah Johnson',
      vehicle: 'Van-003',
      status: 'Delivered',
      departureTime: '2025-01-14T06:00:00Z',
      estimatedArrival: '2025-01-14T12:00:00Z',
      actualArrival: '2025-01-14T11:45:00Z',
      distance: '180 miles',
      packages: 8,
      weight: '1,200 lbs',
      priority: 'Medium',
      route: 'Route B-2',
      currentLocation: 'Boston, MA'
    },
    {
      id: 'SHIP-003',
      orderId: 'PO-2025-003',
      destination: 'Washington, DC',
      driver: 'Michael Chen',
      vehicle: 'Truck-002',
      status: 'Loading',
      departureTime: '2025-01-14T14:00:00Z',
      estimatedArrival: '2025-01-14T18:00:00Z',
      actualArrival: null,
      distance: '120 miles',
      packages: 25,
      weight: '3,800 lbs',
      priority: 'High',
      route: 'Route C-1',
      currentLocation: 'Warehouse'
    },
    {
      id: 'SHIP-004',
      orderId: 'PO-2025-004',
      destination: 'Atlanta, GA',
      driver: 'Robert Wilson',
      vehicle: 'Truck-003',
      status: 'Scheduled',
      departureTime: '2025-01-15T09:00:00Z',
      estimatedArrival: '2025-01-15T19:00:00Z',
      actualArrival: null,
      distance: '450 miles',
      packages: 32,
      weight: '4,200 lbs',
      priority: 'Medium',
      route: 'Route D-3',
      currentLocation: 'Warehouse'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'text-secondary-600 bg-secondary-50';
      case 'In Transit': return 'text-primary-600 bg-primary-50';
      case 'Loading': return 'text-warning-600 bg-warning-50';
      case 'Scheduled': return 'text-neutral-600 bg-neutral-50';
      case 'Delayed': return 'text-error-600 bg-error-50';
      default: return 'text-neutral-600 bg-neutral-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered': return Package;
      case 'In Transit': return Truck;
      case 'Loading': return Clock;
      case 'Scheduled': return Calendar;
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

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeStatus = (estimatedArrival: string, actualArrival: string | null) => {
    if (actualArrival) {
      const estimated = new Date(estimatedArrival);
      const actual = new Date(actualArrival);
      const diff = actual.getTime() - estimated.getTime();
      const minutes = Math.floor(diff / (1000 * 60));
      
      if (minutes > 15) {
        return { text: `${minutes}m late`, color: 'text-error-600' };
      } else if (minutes < -15) {
        return { text: `${Math.abs(minutes)}m early`, color: 'text-secondary-600' };
      } else {
        return { text: 'On time', color: 'text-secondary-600' };
      }
    }
    return null;
  };

  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      const dayShipments = shipments.filter(shipment => 
        shipment.departureTime.split('T')[0] === dateString
      );
      
      days.push({
        date: day,
        dateString,
        shipments: dayShipments,
        isToday: dateString === new Date().toISOString().split('T')[0]
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Transportation</h1>
          <p className="text-neutral-600 mt-2">Track shipments and manage delivery schedules</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-white border border-neutral-300 rounded-lg">
            <button
              onClick={() => setSelectedView('calendar')}
              className={`px-4 py-2 rounded-l-lg transition-colors flex items-center space-x-2 ${
                selectedView === 'calendar' ? 'bg-primary-500 text-white' : 'text-neutral-600 hover:text-neutral-800'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Calendar</span>
            </button>
            <button
              onClick={() => setSelectedView('list')}
              className={`px-4 py-2 rounded-r-lg transition-colors flex items-center space-x-2 ${
                selectedView === 'list' ? 'bg-primary-500 text-white' : 'text-neutral-600 hover:text-neutral-800'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">In Transit</p>
              <p className="text-2xl font-bold text-neutral-900 mt-2">
                {shipments.filter(s => s.status === 'In Transit').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Delivered Today</p>
              <p className="text-2xl font-bold text-neutral-900 mt-2">
                {shipments.filter(s => s.status === 'Delivered').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-secondary-500 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Scheduled</p>
              <p className="text-2xl font-bold text-neutral-900 mt-2">
                {shipments.filter(s => s.status === 'Scheduled').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-warning-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Total Distance</p>
              <p className="text-2xl font-bold text-neutral-900 mt-2">995</p>
              <p className="text-xs text-neutral-500">miles today</p>
            </div>
            <div className="w-12 h-12 bg-neutral-500 rounded-lg flex items-center justify-center">
              <Route className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {selectedView === 'calendar' ? (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-neutral-900">
              {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-4">
            {weekDays.map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-neutral-500">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`min-h-[100px] p-2 border border-neutral-100 rounded-lg ${
                  day?.isToday ? 'bg-primary-50 border-primary-200' : 'hover:bg-neutral-50'
                } ${day ? 'cursor-pointer' : ''}`}
              >
                {day && (
                  <>
                    <div className={`text-sm font-medium mb-1 ${
                      day.isToday ? 'text-primary-600' : 'text-neutral-900'
                    }`}>
                      {day.date}
                    </div>
                    <div className="space-y-1">
                      {day.shipments.slice(0, 2).map(shipment => (
                        <div
                          key={shipment.id}
                          className={`text-xs px-2 py-1 rounded text-center ${getStatusColor(shipment.status)}`}
                        >
                          {shipment.id}
                        </div>
                      ))}
                      {day.shipments.length > 2 && (
                        <div className="text-xs text-neutral-500 text-center">
                          +{day.shipments.length - 2} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
          <div className="p-6 border-b border-neutral-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search shipments..."
                    className="pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <select className="pl-10 pr-8 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white">
                    <option value="all">All Status</option>
                    <option value="in-transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Shipment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Destination</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Driver & Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Schedule</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {shipments.map((shipment) => {
                  const StatusIcon = getStatusIcon(shipment.status);
                  const timeStatus = getTimeStatus(shipment.estimatedArrival, shipment.actualArrival);
                  
                  return (
                    <tr key={shipment.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-neutral-900">{shipment.id}</div>
                          <div className="text-sm text-neutral-500">{shipment.orderId}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-neutral-400" />
                          <div>
                            <div className="text-sm font-medium text-neutral-900">{shipment.destination}</div>
                            <div className="text-sm text-neutral-500">{shipment.distance}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-neutral-900">{shipment.driver}</div>
                          <div className="text-sm text-neutral-500">{shipment.vehicle}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {shipment.status}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(shipment.priority)}`}>
                            {shipment.priority}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-neutral-900">
                            Dep: {formatTime(shipment.departureTime)}
                          </div>
                          <div className="text-neutral-900">
                            Est: {formatTime(shipment.estimatedArrival)}
                          </div>
                          {shipment.actualArrival && (
                            <div className={`${timeStatus?.color || 'text-neutral-900'}`}>
                              Act: {formatTime(shipment.actualArrival)}
                            </div>
                          )}
                          {timeStatus && (
                            <div className={`text-xs ${timeStatus.color}`}>
                              {timeStatus.text}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-neutral-500">
                          <div>{shipment.packages} packages</div>
                          <div>{shipment.weight}</div>
                          <div className="text-xs">{shipment.route}</div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}