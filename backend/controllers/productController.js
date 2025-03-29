const Product = require('../models/productModel');
const Category = require('../models/categoryModel');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};
    
    const category = req.query.category ? { category: req.query.category } : {};
    
    const count = await Product.countDocuments({ ...keyword, ...category });
    
    const products = await Product.find({ ...keyword, ...category })
      .populate('category', 'name')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });
    
    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 8;
    
    const products = await Product.find({ isFeatured: true })
      .populate('category', 'name')
      .limit(limit);
    
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name')
      .populate('supplier', 'name');
    
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      richDescription,
      brand,
      price,
      costPrice,
      category,
      supplier,
      countInStock,
      images,
      isFeatured,
      tags,
      weight,
      dimensions,
      shippingInfo,
      seoMetadata,
    } = req.body;
    
    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
    
    const product = new Product({
      name,
      slug,
      description,
      richDescription,
      brand,
      price,
      costPrice,
      category,
      supplier,
      countInStock,
      images,
      isFeatured,
      tags,
      weight,
      dimensions,
      shippingInfo,
      seoMetadata,
    });
    
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      richDescription,
      brand,
      price,
      costPrice,
      category,
      supplier,
      countInStock,
      images,
      isFeatured,
      isActive,
      tags,
      weight,
      dimensions,
      shippingInfo,
      seoMetadata,
    } = req.body;
    
    const product = await Product.findById(req.params.id);
    
    if (product) {
      // Generate new slug if name is updated
      const slug = name
        ? name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-')
        : product.slug;
      
      product.name = name || product.name;
      product.slug = slug;
      product.description = description || product.description;
      product.richDescription = richDescription || product.richDescription;
      product.brand = brand || product.brand;
      product.price = price || product.price;
      product.costPrice = costPrice || product.costPrice;
      product.category = category || product.category;
      product.supplier = supplier || product.supplier;
      product.countInStock = countInStock || product.countInStock;
      product.images = images || product.images;
      product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
      product.isActive = isActive !== undefined ? isActive : product.isActive;
      product.tags = tags || product.tags;
      product.weight = weight || product.weight;
      product.dimensions = dimensions || product.dimensions;
      product.shippingInfo = shippingInfo || product.shippingInfo;
      product.seoMetadata = seoMetadata || product.seoMetadata;
      
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      
      if (product) {
        await product.remove();
        res.json({ message: 'Product removed' });
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
  
  // @desc    Create new review
  // @route   POST /api/products/:id/reviews
  // @access  Private
  const createProductReview = async (req, res) => {
    try {
      const { rating, comment } = req.body;
      
      const product = await Product.findById(req.params.id);
      
      if (product) {
        // Check if user already reviewed
        const alreadyReviewed = product.reviews.find(
          (r) => r.user.toString() === req.user._id.toString()
        );
        
        if (alreadyReviewed) {
          return res.status(400).json({ message: 'Product already reviewed' });
        }
        
        const review = {
          name: req.user.name,
          rating: Number(rating),
          comment,
          user: req.user._id,
        };
        
        product.reviews.push(review);
        
        product.numReviews = product.reviews.length;
        
        product.rating =
          product.reviews.reduce((acc, item) => item.rating + acc, 0) /
          product.reviews.length;
        
        await product.save();
        res.status(201).json({ message: 'Review added' });
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
  
  module.exports = {
    getProducts,
    getFeaturedProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
  };
  
