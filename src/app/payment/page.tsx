"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faMoneyBillWave, faReceipt, faHistory, faWallet, faShieldAlt, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useRouter } from 'next/navigation';

export default function Payment() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('methods');
  const [balance, setBalance] = useState(25.75);

  // Mock payment methods
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'card',
      name: 'Visa ending in 4242',
      details: '•••• •••• •••• 4242',
      expiry: '06/27',
      isDefault: true
    },
    {
      id: 2,
      type: 'card',
      name: 'Mastercard ending in 5555',
      details: '•••• •••• •••• 5555',
      expiry: '09/26',
      isDefault: false
    }
  ]);

  // Mock transactions
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: 'payment',
      amount: 5.50,
      description: 'Ride from Downtown to University Campus',
      date: '2025-03-15',
      status: 'completed'
    },
    {
      id: 2,
      type: 'earnings',
      amount: 12.75,
      description: 'Ride hosting: Tech District to Riverside Park (2 passengers)',
      date: '2025-03-14',
      status: 'completed'
    },
    {
      id: 3,
      type: 'withdraw',
      amount: 20.00,
      description: 'Withdrawal to bank account',
      date: '2025-03-10',
      status: 'completed'
    },
    {
      id: 4,
      type: 'payment',
      amount: 4.75,
      description: 'Ride from Oakwood Heights to City Center',
      date: '2025-03-01',
      status: 'completed'
    }
  ]);

  const [newCard, setNewCard] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: '',
    setDefault: false
  });

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would make an API call to add the card
    alert('Card added successfully!');
    setNewCard({
      cardNumber: '',
      cardholderName: '',
      expiryDate: '',
      cvv: '',
      setDefault: false
    });
  };

  const setDefaultMethod = (id: number) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
  };

  const removePaymentMethod = (id: number) => {
    if (confirm('Are you sure you want to remove this payment method?')) {
      setPaymentMethods(paymentMethods.filter(method => method.id !== id));
    }
  };

  const withdrawBalance = () => {
    if (balance <= 0) {
      alert('No balance available for withdrawal.');
      return;
    }

    // In a real app, this would make an API call to process the withdrawal
    alert(`Withdrawal of ₹${balance.toFixed(2)} initiated. The funds will be transferred to your default payment method.`);
    setBalance(0);
    
    // Add the withdrawal transaction
    setTransactions([
      {
        id: transactions.length + 1,
        type: 'withdraw',
        amount: balance,
        description: 'Withdrawal to bank account',
        date: new Date().toISOString().split('T')[0],
        status: 'pending'
      },
      ...transactions
    ]);
  };

  useEffect(() => {
    // Redirect if not logged in
    if (!session && typeof window !== 'undefined') {
      router.push('/login?redirect=/payment');
    }
    
    setIsMounted(true);
  }, [session, router]);

  if (!isMounted || !session) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Payments & Wallet</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="border-b border-gray-200">
                    <div className="flex">
                      <button 
                        className={`px-6 py-3 font-medium text-sm focus:outline-none ${
                          activeTab === 'methods' 
                            ? 'text-primary border-b-2 border-primary' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('methods')}
                      >
                        Payment Methods
                      </button>
                      <button 
                        className={`px-6 py-3 font-medium text-sm focus:outline-none ${
                          activeTab === 'transactions' 
                            ? 'text-primary border-b-2 border-primary' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('transactions')}
                      >
                        Transaction History
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    {activeTab === 'methods' && (
                      <div>
                        <h2 className="text-lg font-semibold mb-4">Your Payment Methods</h2>
                        
                        {paymentMethods.length === 0 ? (
                          <div className="text-center py-8">
                            <div className="text-5xl text-gray-300 mb-4">
                              <FontAwesomeIcon icon={faCreditCard} />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">No payment methods</h3>
                            <p className="text-gray-500 mb-4">You haven't added any payment methods yet.</p>
                          </div>
                        ) : (
                          <div className="space-y-4 mb-8">
                            {paymentMethods.map(method => (
                              <div key={method.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                  <div className="flex items-start">
                                    <div className="bg-gray-100 p-2 rounded-md mr-4">
                                      <FontAwesomeIcon icon={faCreditCard} className="text-xl text-gray-600" />
                                    </div>
                                    <div>
                                      <div className="flex items-center">
                                        <h3 className="font-medium">{method.name}</h3>
                                        {method.isDefault && (
                                          <span className="ml-2 bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full">
                                            Default
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-gray-600 text-sm mt-1">{method.details}</p>
                                      <p className="text-gray-500 text-sm">Expires: {method.expiry}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {!method.isDefault && (
                                      <button 
                                        onClick={() => setDefaultMethod(method.id)}
                                        className="text-sm text-primary hover:underline"
                                      >
                                        Set as default
                                      </button>
                                    )}
                                    <button 
                                      onClick={() => removePaymentMethod(method.id)}
                                      className="text-sm text-red-500 hover:underline"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <h3 className="text-lg font-semibold mb-4">Add a New Payment Method</h3>
                        <form onSubmit={handleAddCard} className="space-y-4">
                          <div className="form-group">
                            <label htmlFor="cardNumber" className="block text-gray-700 font-medium mb-2">Card Number</label>
                            <input 
                              type="text" 
                              id="cardNumber"
                              value={newCard.cardNumber}
                              onChange={(e) => setNewCard({...newCard, cardNumber: e.target.value})}
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="1234 5678 9012 3456"
                              required
                            />
                          </div>
                          
                          <div className="form-group">
                            <label htmlFor="cardholderName" className="block text-gray-700 font-medium mb-2">Cardholder Name</label>
                            <input 
                              type="text" 
                              id="cardholderName"
                              value={newCard.cardholderName}
                              onChange={(e) => setNewCard({...newCard, cardholderName: e.target.value})}
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="John Doe"
                              required
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="form-group">
                              <label htmlFor="expiryDate" className="block text-gray-700 font-medium mb-2">Expiry Date</label>
                              <input 
                                type="text" 
                                id="expiryDate"
                                value={newCard.expiryDate}
                                onChange={(e) => setNewCard({...newCard, expiryDate: e.target.value})}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="MM/YY"
                                required
                              />
                            </div>
                            
                            <div className="form-group">
                              <label htmlFor="cvv" className="block text-gray-700 font-medium mb-2">CVV</label>
                              <input 
                                type="text" 
                                id="cvv"
                                value={newCard.cvv}
                                onChange={(e) => setNewCard({...newCard, cvv: e.target.value})}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="123"
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              id="setDefault"
                              checked={newCard.setDefault}
                              onChange={(e) => setNewCard({...newCard, setDefault: e.target.checked})}
                              className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            <label htmlFor="setDefault" className="ml-2 text-sm text-gray-700">
                              Make this my default payment method
                            </label>
                          </div>
                          
                          <div className="flex justify-end">
                            <button type="submit" className="btn btn-primary">
                              Add Card
                            </button>
                          </div>
                        </form>
                        
                        <div className="mt-6 flex items-center justify-center text-sm">
                          <FontAwesomeIcon icon={faShieldAlt} className="text-primary mr-2" />
                          <span>Your payment information is secure and encrypted</span>
                        </div>
                      </div>
                    )}
                    
                    {activeTab === 'transactions' && (
                      <div>
                        <h2 className="text-lg font-semibold mb-4">Transaction History</h2>
                        
                        {transactions.length === 0 ? (
                          <div className="text-center py-8">
                            <div className="text-5xl text-gray-300 mb-4">
                              <FontAwesomeIcon icon={faHistory} />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">No transactions yet</h3>
                            <p className="text-gray-500">Your transaction history will appear here.</p>
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="min-w-full">
                              <thead>
                                <tr className="bg-gray-50">
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Description
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {transactions.map(transaction => (
                                  <tr key={transaction.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                      {transaction.date}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                      {transaction.description}
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                                      transaction.type === 'earnings' 
                                        ? 'text-green-600' 
                                        : transaction.type === 'payment' || transaction.type === 'withdraw'
                                          ? 'text-red-600' 
                                          : 'text-gray-900'
                                    }`}>
                                      {transaction.type === 'earnings' ? '+' : '-'}
                                      ₹{transaction.amount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                      <span className={`px-2 py-1 text-xs rounded-full ${
                                        transaction.status === 'completed'
                                          ? 'bg-green-100 text-green-800'
                                          : 'bg-yellow-100 text-yellow-800'
                                      }`}>
                                        {transaction.status === 'completed' ? 'Completed' : 'Pending'}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                  <h2 className="text-lg font-semibold mb-4">Your Wallet</h2>
                  
                  <div className="bg-primary bg-opacity-10 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Available Balance</span>
                      <FontAwesomeIcon icon={faWallet} className="text-primary" />
                    </div>
                    <div className="text-3xl font-bold text-primary">₹{balance.toFixed(2)}</div>
                  </div>
                  
                  <button 
                    onClick={withdrawBalance}
                    className={`w-full btn ${balance > 0 ? 'btn-primary' : 'btn-disabled'} mb-4`}
                    disabled={balance <= 0}
                  >
                    <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2" />
                    Withdraw to Bank
                  </button>
                  
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-blue-700">
                          Withdrawals are typically processed within 1-3 business days. Minimum withdrawal amount is $5.00.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 