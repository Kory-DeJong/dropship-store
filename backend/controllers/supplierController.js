const Supplier = require('../models/supplierModel');

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Private/Admin
const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find({}).sort({ name: 1 });
    res.json(suppliers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single supplier
// @route   GET /api/suppliers/:id
// @access  Private/Admin
const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    
    if (supplier) {
      res.json(supplier);
    } else {
      res.status(404).json({ message: 'Supplier not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a supplier
// @route   POST /api/suppliers
// @access  Private/Admin
const createSupplier = async (req, res) => {
  try {
    const {
      name,
      contactPerson,
      email,
      phone,
      address,
      website,
      description,
      shippingTime,
      paymentTerms,
      notes,
    } = req.body;
    
    const supplier = new Supplier({
      name,
      contactPerson,
      email,
      phone,
      address,
      website,
      description,
      shippingTime,
      paymentTerms,
      notes,
    });
    
    const createdSupplier = await supplier.save();
    res.status(201).json(createdSupplier);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a supplier
// @route   PUT /api/suppliers/:id
// @access  Private/Admin
const updateSupplier = async (req, res) => {
  try {
    const {
      name,
      contactPerson,
      email,
      phone,
      address,
      website,
      description,
      isActive,
      shippingTime,
      paymentTerms,
      notes,
    } = req.body;
    
    const supplier = await Supplier.findById(req.params.id);
    
    if (supplier) {
      supplier.name = name || supplier.name;
      supplier.contactPerson = contactPerson || supplier.contactPerson;
      supplier.email = email || supplier.email;
      supplier.phone = phone || supplier.phone;
      supplier.address = address || supplier.address;
      supplier.website = website || supplier.website;
      supplier.description = description || supplier.description;
      supplier.isActive = isActive !== undefined ? isActive : supplier.isActive;
      supplier.shippingTime = shippingTime || supplier.shippingTime;
      supplier.paymentTerms = paymentTerms || supplier.paymentTerms;
      supplier.notes = notes || supplier.notes;
      
      const updatedSupplier = await supplier.save();
      res.json(updatedSupplier);
    } else {
      res.status(404).json({ message: 'Supplier not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a supplier
// @route   DELETE /api/suppliers/:id
// @access  Private/Admin
const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    
    if (supplier) {
      await supplier.remove();
      res.json({ message: 'Supplier removed' });
    } else {
      res.status(404).json({ message: 'Supplier not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
