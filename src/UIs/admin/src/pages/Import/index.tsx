import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Types
interface ImportReceipt {
  id: string;
  date: string;
  supplier: string;
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  items: number;
}

const ImportGoodsPage: React.FC = () => {
  const [receipts, setReceipts] = useState<ImportReceipt[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      try {
        // Replace with actual API call
        setTimeout(() => {
          const dummyData: ImportReceipt[] = [
            {
              id: 'IMP-001',
              date: '2025-04-15',
              supplier: 'Global Supplies Inc.',
              totalAmount: 5600.0,
              status: 'completed',
              items: 12,
            },
            {
              id: 'IMP-002',
              date: '2025-04-10',
              supplier: 'Tech Parts Ltd.',
              totalAmount: 3200.5,
              status: 'pending',
              items: 8,
            },
            {
              id: 'IMP-003',
              date: '2025-04-05',
              supplier: 'Wholesale Goods Co.',
              totalAmount: 1800.75,
              status: 'completed',
              items: 5,
            },
            {
              id: 'IMP-004',
              date: '2025-03-28',
              supplier: 'Premium Materials',
              totalAmount: 7200.0,
              status: 'cancelled',
              items: 15,
            },
          ];
          setReceipts(dummyData);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching import receipts:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const ActionButton: React.FC<{
    text: string;
    icon: string;
    onClick: () => void;
    color: string;
  }> = ({ text, icon, onClick, color }) => (
    <button
      onClick={onClick}
      className={`flex items-center justify-center p-6 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 ${color} text-white w-full`}
    >
      <span className="mr-3 text-2xl">{icon}</span>
      <span className="text-lg font-semibold">{text}</span>
    </button>
  );

  const handleCreateImportReceipt = () => {
    console.log('Create new import receipt');
    // Implementation for creating new import receipt
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Import Goods Management</h1>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <ActionButton
          text="New Import Receipt"
          icon="📝"
          onClick={handleCreateImportReceipt}
          color="bg-blue-600 hover:bg-blue-700"
        />
        <ActionButton
          text="New Product"
          icon="📦"
          onClick={() => navigate('/import/new-product')}
          color="bg-purple-600 hover:bg-purple-700"
        />
        <ActionButton
          text="New Product Variant"
          icon="🔄"
          onClick={() => navigate('/import/new-variant')}
          color="bg-teal-600 hover:bg-teal-700"
        />
      </div>

      {/* Import Receipt History */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">Import Receipt History</h2>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">ID</th>
                  <th className="py-3 px-6 text-left">Date</th>
                  <th className="py-3 px-6 text-left">Supplier</th>
                  <th className="py-3 px-6 text-right">Items Count</th>
                  <th className="py-3 px-6 text-right">Total Amount</th>
                  <th className="py-3 px-6 text-center">Status</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {receipts.map((receipt) => (
                  <tr
                    key={receipt.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-4 px-6 text-left">{receipt.id}</td>
                    <td className="py-4 px-6 text-left">{receipt.date}</td>
                    <td className="py-4 px-6 text-left">{receipt.supplier}</td>
                    <td className="py-4 px-6 text-right">{receipt.items}</td>
                    <td className="py-4 px-6 text-right">
                      ${receipt.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`rounded-full px-3 py-1 text-xs ${getStatusColor(receipt.status)}`}
                      >
                        {receipt.status.charAt(0).toUpperCase() +
                          receipt.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          title="View"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900"
                          title="Edit"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {receipts.length === 0 && !isLoading && (
          <div className="text-center py-10">
            <p className="text-gray-500">No import receipts found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportGoodsPage;
