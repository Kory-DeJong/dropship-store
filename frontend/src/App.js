import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layout Components
import Header from './components/layout/Header.js';
import Footer from './components/layout/Footer';

// Public Pages
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ShippingPage from './pages/ShippingPage';
import PaymentPage from './pages/PaymentPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import OrderPage from './pages/OrderPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin Pages
import DashboardPage from './pages/admin/DashboardPage';
import ProductListPage from './pages/admin/ProductListPage';
import ProductEditPage from './pages/admin/ProductEditPage';
import OrderListPage from './pages/admin/OrderListPage';
import UserListPage from './pages/admin/UserListPage';
import CategoryListPage from './pages/admin/CategoryListPage';
import SupplierListPage from './pages/admin/SupplierListPage';

// Route Guards
import PrivateRoute from './components/routes/PrivateRoute';
import AdminRoute from './components/routes/AdminRoute';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow bg-gray-50">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/page/:pageNumber" element={<HomePage />} />
                <Route path="/search/:keyword" element={<ProductPage />} />
                <Route path="/search/:keyword/page/:pageNumber" element={<ProductPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Protected Routes */}
                <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
                <Route path="/orderhistory" element={<PrivateRoute><OrderHistoryPage /></PrivateRoute>} />
                <Route path="/shipping" element={<PrivateRoute><ShippingPage /></PrivateRoute>} />
                <Route path="/payment" element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
                <Route path="/placeorder" element={<PrivateRoute><PlaceOrderPage /></PrivateRoute>} />
                <Route path="/order/:id" element={<PrivateRoute><OrderPage /></PrivateRoute>} />
                
                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<AdminRoute><DashboardPage /></AdminRoute>} />
                <Route path="/admin/products" element={<AdminRoute><ProductListPage /></AdminRoute>} />
                <Route path="/admin/product/:id/edit" element={<AdminRoute><ProductEditPage /></AdminRoute>} />
                <Route path="/admin/products/create" element={<AdminRoute><ProductEditPage /></AdminRoute>} />
                <Route path="/admin/orders" element={<AdminRoute><OrderListPage /></AdminRoute>} />
                <Route path="/admin/users" element={<AdminRoute><UserListPage /></AdminRoute>} />
                <Route path="/admin/categories" element={<AdminRoute><CategoryListPage /></AdminRoute>} />
                <Route path="/admin/suppliers" element={<AdminRoute><SupplierListPage /></AdminRoute>} />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
