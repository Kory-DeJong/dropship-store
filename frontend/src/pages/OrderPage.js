import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import AuthContext from '../context/AuthContext';
import Message from '../components/ui/Message';
import Loader from '../components/ui/Loader';
import CheckoutForm from '../components/payment/CheckoutForm';

// Initialize Stripe (will be loaded when needed)
let stripePromise;

const OrderPage = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingPay, setLoadingPay] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const { id: orderId } = useParams();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        
        const { data } = await axios.get(`/api/orders/${orderId}`, config);
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load order details');
        setLoading(false);
        console.error(err);
      }
    };

    fetchOrder();
  }, [orderId, user, paymentSuccess]);

  useEffect(() => {
    // Load Stripe configuration when needed
    const getStripeApiKey = async () => {
      try {
        const { data } = await axios.get('/api/payments/config');
        stripePromise = loadStripe(data.publishableKey);
      } catch (err) {
        console.error('Failed to load Stripe configuration', err);
      }
    };

    // Only load Stripe if order exists, is not paid, and payment method is Stripe
    if (order && !order.isPaid && order.paymentMethod === 'Stripe') {
      getStripeApiKey();
    }
  }, [order]);

  const createPaymentIntent = async () => {
    try {
      setLoadingPay(true);
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      
      const { data } = await axios.post(
        '/api/payments/create-payment-intent',
        { amount: order.totalPrice },
        config
      );
      
      setClientSecret(data.clientSecret);
      setLoadingPay(false);
    } catch (err) {
      console.error('Error creating payment intent:', err);
      setLoadingPay(false);
    }
  };

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Message variant="danger">{error}</Message>;
  }

  if (!order) {
    return <Message variant="info">Order not found</Message>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Order {order._id}</h1>
      <p className="text-gray-600 mb-6">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping</h2>
              <p className="mb-1">
                <strong>Name:</strong> {order.user.name}
              </p>
              <p className="mb-1">
                <strong>Email:</strong> {order.user.email}
              </p>
              <p className="mb-1">
                <strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </p>
              <div className="mt-4">
                {order.isDelivered ? (
                  <Message variant="success">
                    Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                  </Message>
                ) : (
                  <Message variant="info">Not Delivered</Message>
                )}
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Payment</h2>
              <p className="mb-1">
                <strong>Method:</strong> {order.paymentMethod}
              </p>
              <div className="mt-4">
                {order.isPaid ? (
                  <Message variant="success">
                    Paid on {new Date(order.paidAt).toLocaleDateString()}
                  </Message>
                ) : (
                  <Message variant="danger">Not Paid</Message>
                )}
              </div>
            </div>
            
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Order Items</h2>
              
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center py-2 border-b last:border-b-0">
                    <div className="w-16 h-16 flex-shrink-0">
                      <img
                        src={item.image || '/images/placeholder.jpg'}
                        alt={item.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="ml-4 flex-grow">
                      <Link to={`/product/${item.product}`} className="text-primary-600 hover:underline">
                        {item.name}
                      </Link>
                    </div>
                    <div className="text-right">
                      {item.quantity} x ${item.price.toFixed(2)} = ${(item.quantity * item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
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
                <span>${order.itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>${order.shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${order.taxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                <span>Total:</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Payment Section */}
            {!order.isPaid && order.paymentMethod === 'Stripe' && (
              <div className="mt-6">
                {!clientSecret ? (
                  <button
                    onClick={createPaymentIntent}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md font-medium"
                    disabled={loadingPay}
                  >
                    {loadingPay ? <Loader /> : 'Pay Now'}
                  </button>
                ) : (
                  <div className="mt-4">
                    {stripePromise && clientSecret && (
                      <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <CheckoutForm onPaymentSuccess={handlePaymentSuccess} />
                      </Elements>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Order Status */}
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Order Status</h3>
              <div className="bg-gray-100 p-3 rounded-md">
                <div className="flex items-center mb-2">
                  <div className={`w-4 h-4 rounded-full mr-2 ${order.isPaid ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span>Payment Confirmed</span>
                </div>
                <div className="flex items-center mb-2">
                  <div className={`w-4 h-4 rounded-full mr-2 ${order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span>Processing</span>
                </div>
                <div className="flex items-center mb-2">
                  <div className={`w-4 h-4 rounded-full mr-2 ${order.status === 'shipped' || order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span>Shipped</span>
                  {order.trackingNumber && order.status === 'shipped' && (
                    <span className="ml-2 text-sm text-gray-600">
                      (Tracking: {order.trackingNumber})
                    </span>
                  )}
                </div>
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-2 ${order.isDelivered ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span>Delivered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
