import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import Message from '../components/ui/Message';
import Loader from '../components/ui/Loader';

const PlaceOrderPage = () => {
  const { cartItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if shipping address and payment method are set
  if (!shippingAddress.address) {
    navigate('/shipping');
    return null;
  }
  
  if (!paymentMethod) {
    navigate('/payment');
    return null;
  }

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      
      const orderItems = cartItems.map((item) => {
        return {
          product: item._id,
          name: item.name,
          quantity: item.qty,
          image: item.images?.[0] || '',
          price: item.price,
        };
      });
      
      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        },
        config
      );
      
      setLoading(false);
      clearCart();
      navigate(`/order/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while placing your order');
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Review Your Order</h1>
      
      {error && <Message variant="danger">{error}</Message>}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping</h2>
              <p className="mb-1">
                <strong>Name:</strong> {user.name}
              </p>
              <p className="mb-1">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="mb-1">
                <strong>Address:</strong> {shippingAddress.address}, {shippingAddress.city}{' '}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
            </div>
            
            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Payment</h2>
              <p>
                <strong>Method:</strong> {paymentMethod}
              </p>
            </div>
            
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Order Items</h2>
              
              {cartItems.length === 0 ? (
                <Message variant="info">Your cart is empty</Message>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex items-center py-2 border-b last:border-b-0">
                      <div className="w-16 h-16 flex-shrink-0">
                        <img
                          src={item.images?.[0] || '/images/placeholder.jpg'}
                          alt={item.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="ml-4 flex-grow">
                        <Link to={`/product/${item._id}`} className="text-primary-600 hover:underline">
                          {item.name}
                        </Link>
                      </div>
                      <div className="text-right">
                        {item.qty} x ${item.price.toFixed(2)} = ${(item.qty * item.price).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Items:</span>
                <span>${itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>${shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${taxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                <span>Total:</span>
                <span>${totalPrice}</span>
              </div>
            </div>
            
            <button
              onClick={handlePlaceOrder}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md font-medium mt-6"
              disabled={cartItems.length === 0 || loading}
            >
              {loading ? <Loader /> : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;

