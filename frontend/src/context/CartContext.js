import React, { createContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('');
  const [itemsPrice, setItemsPrice] = useState(0);
  const [shippingPrice, setShippingPrice] = useState(0);
  const [taxPrice, setTaxPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  
  // Load cart from localStorage
  useEffect(() => {
    const storedCartItems = localStorage.getItem('cartItems');
    const storedShippingAddress = localStorage.getItem('shippingAddress');
    const storedPaymentMethod = localStorage.getItem('paymentMethod');
    
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
    
    if (storedShippingAddress) {
      setShippingAddress(JSON.parse(storedShippingAddress));
    }
    
    if (storedPaymentMethod) {
      setPaymentMethod(JSON.parse(storedPaymentMethod));
    }
  }, []);
  
  // Calculate prices whenever cart items change
  useEffect(() => {
    // Calculate items price
    const calculatedItemsPrice = cartItems.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    );
    setItemsPrice(calculatedItemsPrice);
    
    // Calculate shipping price (free shipping for orders over $100)
    const calculatedShippingPrice = calculatedItemsPrice > 100 ? 0 : 10;
    setShippingPrice(calculatedShippingPrice);
    
    // Calculate tax price (10% tax)
    const calculatedTaxPrice = Number((0.10 * calculatedItemsPrice).toFixed(2));
    setTaxPrice(calculatedTaxPrice);
    
    // Calculate total price
    const calculatedTotalPrice = (
      calculatedItemsPrice +
      calculatedShippingPrice +
      calculatedTaxPrice
    ).toFixed(2);
    setTotalPrice(calculatedTotalPrice);
  }, [cartItems]);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);
  
  // Save shipping address to localStorage
  useEffect(() => {
    if (Object.keys(shippingAddress).length !== 0) {
      localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
    }
  }, [shippingAddress]);
  
  // Save payment method to localStorage
  useEffect(() => {
    if (paymentMethod) {
      localStorage.setItem('paymentMethod', JSON.stringify(paymentMethod));
    }
  }, [paymentMethod]);
  
  // Add item to cart
  const addToCart = (product, qty = 1) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    
    if (existItem) {
      setCartItems(
        cartItems.map((x) =>
          x._id === existItem._id ? { ...x, qty: x.qty + qty } : x
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, qty }]);
    }
  };
  
  // Update cart item quantity
  const updateCartItemQty = (id, qty) => {
    setCartItems(
      cartItems.map((x) => (x._id === id ? { ...x, qty: qty } : x))
    );
  };
  
  // Remove item from cart
  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((x) => x._id !== id));
  };
  
  // Save shipping address
  const saveShippingAddress = (data) => {
    setShippingAddress(data);
  };
  
  // Save payment method
  const savePaymentMethod = (data) => {
    setPaymentMethod(data);
  };
  
  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };
  
  return (
    <CartContext.Provider
      value={{
        cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        addToCart,
        updateCartItemQty,
        removeFromCart,
        saveShippingAddress,
        savePaymentMethod,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
