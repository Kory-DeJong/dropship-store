import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Loader from '../ui/Loader';
import Message from '../ui/Message';

const CheckoutForm = ({ onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    setLoading(true);
    setError(null);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-confirmation`,
      },
      redirect: 'if_required',
    });

    if (result.error) {
      setError(result.error.message);
      setLoading(false);
    } else {
      if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        onPaymentSuccess();
      } else {
        setError('Payment failed. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <Message variant="danger">{error}</Message>}
      
      <PaymentElement className="mb-6" />
      
      <button
        type="submit"
        className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md font-medium"
        disabled={!stripe || loading}
      >
        {loading ? <Loader /> : 'Pay Now'}
      </button>
    </form>
  );
};

export default CheckoutForm;
