import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('Stripe');
  
  const { savePaymentMethod } = useContext(CartContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save payment method to context/localStorage
    savePaymentMethod(paymentMethod);
    
    // Navigate to place order page
    navigate('/placeorder');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Payment Method</h1>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Select Payment Method</h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  id="stripe"
                  name="paymentMethod"
                  type="radio"
                  value="Stripe"
                  checked={paymentMethod === 'Stripe'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <label htmlFor="stripe" className="ml-3 block text-sm font-medium text-gray-700">
                  Credit Card (Stripe)
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="paypal"
                  name="paymentMethod"
                  type="radio"
                  value="PayPal"
                  checked={paymentMethod === 'PayPal'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <label htmlFor="paypal" className="ml-3 block text-sm font-medium text-gray-700">
                  PayPal
                </label>
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md font-medium"
          >
            Continue to Review Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
