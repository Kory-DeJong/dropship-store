// backend/routes/adminRoutes.js
import express from 'express';
import { protect, admin } from '../middleware/adminMiddleware.js';

// Import your admin controllers
import {
  getDashboardStats,
  getAllUsers,
  updateUser,
  deleteUser,
  getAllOrders,
  updateOrderStatus,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  // Add other admin controller functions
} from '../controllers/adminController.js';

const router = express.Router();

// Apply both protect and admin middleware to all routes
// This ensures the user is both authenticated AND an admin

// Dashboard routes
router.get('/dashboard', protect, admin, getDashboardStats);

// User management routes
router.get('/users', protect, admin, getAllUsers);
router.put('/users/:id', protect, admin, updateUser);
router.delete('/users/:id', protect, admin, deleteUser);

// Order management routes
router.get('/orders', protect, admin, getAllOrders);
router.put('/orders/:id/status', protect, admin, updateOrderStatus);

// Product management routes
router.get('/products', protect, admin, getAllProducts);
router.post('/products', protect, admin, createProduct);
router.put('/products/:id', protect, admin, updateProduct);
router.delete('/products/:id', protect, admin, deleteProduct);

// Category routes
// router.get('/categories', protect, admin, getAllCategories);
// router.post('/categories', protect, admin, createCategory);
// router.put('/categories/:id', protect, admin, updateCategory);
// router.delete('/categories/:id', protect, admin, deleteCategory);

// Supplier routes
// router.get('/suppliers', protect, admin, getAllSuppliers);
// router.post('/suppliers', protect, admin, createSupplier);
// router.put('/suppliers/:id', protect, admin, updateSupplier);
// router.delete('/suppliers/:id', protect, admin, deleteSupplier);

export default router;
