import React, { useState } from 'react';
import { Package, Scan, Check, X, AlertCircle, Calendar } from 'lucide-react';

export default function GoodsReceipt() {
  const [selectedTab, setSelectedTab] = useState('pending');

  const pendingReceipts = [
    {
      id: 'GR-2025-001',
      poNumber: 'PO-2025-001',
      supplier: 'ABC Corporation',
      expectedDate: '2025-01-21',
      items: [
        { name: 'Office Chairs', ordered: 10, received: 0, unit: 'pcs' },
        { name: 'Desk Lamps', ordered: 15, received: 0, unit: 'pcs' },
        { name: 'Paper Reams', ordered: 50, received: 0, unit: 'packs' }
      ]
    },
    {
      id: 'GR-2025-002',
      poNumber: 'PO-2025-002',
      supplier: 'Tech Solutions Ltd',
      expectedDate: '2025-01-20',
      items: [
        { name: 'Laptops', ordered: 5, received: 0, unit: 'pcs' },
        { name: 'Monitors', ordered: 5, received: 0, unit: 'pcs' },
        { name: 'Keyboards', ordered: 8, received: 0, unit: 'pcs' }
      ]
    }
  ];

  const completedReceipts = [
    {
      id: 'GR-2025-003',
      poNumber: 'PO-2025-003',
      supplier: 'Global Manufacturing',
      receivedDate: '2025-01-17',
      status: 'Complete',
      items: [
        { name: 'Raw Material A', ordered: 100, received: 100, unit: 'kg' },
        { name: 'Raw Material B', ordered: 50, received: 48, unit: 'kg', variance: -2 },
        { name: 'Packaging', ordered: 200, received: 200, unit: 'pcs' }
      ]
    }
  ];

  const handleReceiveItem = (receiptId: string, itemIndex: number, quantity: number) => {
    // Handle item receiving logic
    console.log(`Receiving ${quantity} of item ${itemIndex} for receipt ${receiptId}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Goods Receipt</h1>
          <p className="text-neutral-600 mt-2">Receive and validate incoming goods from suppliers</p>
        </div>
        <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2">
          <Scan className="w-4 h-4" />
          <span>Scan Barcode</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="border-b border-neutral-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setSelectedTab('pending')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                selectedTab === 'pending'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              Pending Receipts ({pendingReceipts.length})
            </button>
            <button
              onClick={() => setSelectedTab('completed')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                selectedTab === 'completed'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              Completed ({completedReceipts.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {selectedTab === 'pending' && (
            <div className="space-y-6">
              {pendingReceipts.map((receipt) => (
                <div key={receipt.id} className="border border-neutral-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900">{receipt.id}</h3>
                      <p className="text-sm text-neutral-500">PO: {receipt.poNumber} • {receipt.supplier}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 text-sm text-neutral-600">
                        <Calendar className="w-4 h-4" />
                        <span>Expected: {receipt.expectedDate}</span>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-warning-600 bg-warning-50">
                        <Package className="w-3 h-3 mr-1" />
                        Pending
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-neutral-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase">Item</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase">Ordered</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase">Received</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200">
                        {receipt.items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3">
                              <div className="text-sm font-medium text-neutral-900">{item.name}</div>
                              <div className="text-xs text-neutral-500">{item.unit}</div>
                            </td>
                            <td className="px-4 py-3 text-sm text-neutral-900">{item.ordered}</td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                min="0"
                                max={item.ordered}
                                defaultValue={item.received}
                                className="w-20 px-2 py-1 border border-neutral-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleReceiveItem(receipt.id, index, item.ordered)}
                                  className="p-1 text-secondary-600 hover:bg-secondary-50 rounded transition-colors"
                                  title="Receive All"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button className="p-1 text-error-600 hover:bg-error-50 rounded transition-colors" title="Report Issue">
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-200">
                    <div className="flex items-center space-x-4">
                      <button className="text-sm text-neutral-600 hover:text-neutral-800 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>Report Issue</span>
                      </button>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors">
                        Save Draft
                      </button>
                      <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                        Complete Receipt
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedTab === 'completed' && (
            <div className="space-y-6">
              {completedReceipts.map((receipt) => (
                <div key={receipt.id} className="border border-neutral-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900">{receipt.id}</h3>
                      <p className="text-sm text-neutral-500">PO: {receipt.poNumber} • {receipt.supplier}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 text-sm text-neutral-600">
                        <Calendar className="w-4 h-4" />
                        <span>Received: {receipt.receivedDate}</span>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-secondary-600 bg-secondary-50">
                        <Check className="w-3 h-3 mr-1" />
                        {receipt.status}
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-neutral-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase">Item</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase">Ordered</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase">Received</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase">Variance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200">
                        {receipt.items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3">
                              <div className="text-sm font-medium text-neutral-900">{item.name}</div>
                              <div className="text-xs text-neutral-500">{item.unit}</div>
                            </td>
                            <td className="px-4 py-3 text-sm text-neutral-900">{item.ordered}</td>
                            <td className="px-4 py-3 text-sm text-neutral-900">{item.received}</td>
                            <td className="px-4 py-3">
                              {item.variance ? (
                                <span className={`text-sm font-medium ${item.variance < 0 ? 'text-error-600' : 'text-secondary-600'}`}>
                                  {item.variance > 0 ? '+' : ''}{item.variance}
                                </span>
                              ) : (
                                <span className="text-sm text-secondary-600">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}