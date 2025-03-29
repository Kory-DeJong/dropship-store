import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import Message from '../components/ui/Message';

const ShippingPage = () => {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { saveShippingAddress, shippingAddress } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Load user's saved addresses
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        
        const { data } = await axios.get('/api/users/profile', config);
        
        if (data.shippingAddresses && data.shippingAddresses.length > 0) {
          setSavedAddresses(data.shippingAddresses);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load saved addresses');
        setLoading(false);
        console.error(err);
      }
    };
    
    fetchAddresses();
    
    // Pre-fill form with saved shipping address if available
    if (shippingAddress) {
      setAddress(shippingAddress.address || '');
      setCity(shippingAddress.city || '');
      setPostalCode(shippingAddress.postalCode || '');
      setCountry(shippingAddress.country || '');
    }
  }, [user, shippingAddress]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save shipping address to context/localStorage
    saveShippingAddress({ address, city, postalCode, country });
    
    // Navigate to payment page
    navigate('/payment');
  };

  const handleAddressSelect = (e) => {
    const addressId = e.target.value;
    setSelectedAddress(addressId);
    
    if (addressId) {
      const selected = savedAddresses.find((addr) => addr._id === addressId);
      if (selected) {
        setAddress(selected.address);
        setCity(selected.city);
        setPostalCode(selected.postalCode);
        setCountry(selected.country);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-6">Shipping</h1>
        
        {error && <Message variant="danger">{error}</Message>}
        
        {savedAddresses.length > 0 && (
          <div className="mb-6">
            <label htmlFor="savedAddress" className="block text-sm font-medium text-gray-700 mb-2">
              Use Saved Address
            </label>
            <select
              id="savedAddress"
              value={selectedAddress}
              onChange={handleAddressSelect}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">-- Select Saved Address --</option>
              {savedAddresses.map((addr) => (
                <option key={addr._id} value={addr._id}>
                  {addr.address}, {addr.city}, {addr.country}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter address"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter city"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
              Postal Code
            </label>
            <input
              type="text"
              id="postalCode"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter postal code"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <input
              type="text"
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter country"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md font-medium"
          >
            Continue to Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShippingPage;
