import React, { useState, useEffect } from 'react';
import { ArtistSidebar } from '../components/ArtistSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useToast } from '../components/ui/use-toast';
import { api } from '../lib/api-client';
import { API_ENDPOINTS } from '../config/api';

interface Transaction {
  id: number;
  buyer_name: string;
  seller_name: string;
  artwork_title: string;
  amount: number;
  transaction_date: string;
  status: string;
  payment_method: string;
  notes: string;
}

export default function ArtistTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const data = await api.get<{ transactions: Transaction[] }>(API_ENDPOINTS.transactions + '/my-transactions');
      setTransactions(data.transactions);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch transactions',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
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

  if (isLoading) {
    return (
      <div className="flex">
        <ArtistSidebar />
        <div className="flex-1 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading transactions...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <ArtistSidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Transactions</h1>
          <p className="text-gray-600">View your sales and purchase history</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">Date</th>
                      <th className="text-left py-2 font-medium">Artwork</th>
                      <th className="text-left py-2 font-medium">Type</th>
                      <th className="text-left py-2 font-medium">Amount</th>
                      <th className="text-left py-2 font-medium">Status</th>
                      <th className="text-left py-2 font-medium">Payment Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b">
                        <td className="py-2 text-sm text-gray-600">
                          {new Date(transaction.transaction_date).toLocaleDateString()}
                        </td>
                        <td className="py-2 font-medium">{transaction.artwork_title}</td>
                        <td className="py-2">
                          <Badge variant="outline">
                            {transaction.buyer_name === 'You' ? 'Sale' : 'Purchase'}
                          </Badge>
                        </td>
                        <td className="py-2 font-semibold">${transaction.amount.toLocaleString()}</td>
                        <td className="py-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td className="py-2 text-sm text-gray-600">
                          {transaction.payment_method || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No transactions found</p>
                <p className="text-sm text-gray-400 mt-2">Your transaction history will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 