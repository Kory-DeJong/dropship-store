import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import Loader from '../../components/ui/Loader';
import Message from '../../components/ui/Message';

const ProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [images, setImages] = useState([]);
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [richDescription, setRichDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [supplier, setSupplier] = useState('');
  const [featured, setFeatured] = useState(false);

  const isEdit = id !== 'create';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/categories');
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    const fetchSuppliers = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        
        const { data } = await axios.get('/api/suppliers', config);
        setSuppliers(data);
      } catch (err) {
        console.error('Error fetching suppliers:', err);
      }
    };

    fetchCategories();
    fetchSuppliers();
  }, [user]);

  useEffect(() => {
    if (isEdit) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          
          const { data } = await axios.get(`/api/products/${id}`);
          
          setName(data.name);
          setPrice(data.price);
          setImages(data.images || []);
          setBrand(data.brand);
          setCategory(data.category?._id || '');
          setSupplier(data.supplier || '');
          setCountInStock(data.countInStock);
          setDescription(data.description);
          setRichDescription(data.richDescription || '');
          setFeatured(data.featured || false);
          
          setLoading(false);
        } catch (err) {
          setError('Failed to load product details');
          setLoading(false);
          console.error(err);
        }
      };

      fetchProduct();
    } else {
      setLoading(false);
    }
  }, [id, isEdit]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      setUploadLoading(true);
      setUploadError(null);
      
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      };
      
      const { data } = await axios.post('/api/uploads', formData, config);
      
      setImages([...images, data.imageUrl]);
      setUploadLoading(false);
    } catch (err) {
      setUploadError('Failed to upload image');
      setUploadLoading(false);
      console.error(err);
    }
  };

  const removeImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      
      const productData = {
        name,
        price,
        images,
        brand,
        category,
        supplier,
        countInStock,
        description,
        richDescription,
        featured,
      };
      
      if (isEdit) {
        await axios.put(`/api/products/${id}`, productData, config);
      } else {
        await axios.post('/api/products', productData, config);
      }
      
      setSuccess(true);
      setLoading(false);
      
      // Redirect after successful submission
      setTimeout(() => {
        navigate('/admin/products');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/admin/products" className="text-primary-600 hover:underline mb-4 inline-block">
        &larr; Back to Products
      </Link>
      
      <h1 className="text-3xl font-bold mb-6">
        {isEdit ? 'Edit Product' : 'Create Product'}
      </h1>
      
      {loading && <Loader />}
      {error && <Message variant="danger">{error}</Message>}
      {success && <Message variant="success">Product saved successfully!</Message>}
      
      {!loading && (
        <form onSubmit={submitHandler} className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                  Brand
                </label>
                <input
                  type="text"
                  id="brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier
                </label>
                <select
                  id="supplier"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((sup) => (
                    <option key={sup._id} value={sup._id}>
                      {sup.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <label htmlFor="countInStock" className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    id="countInStock"
                    value={countInStock}
                    onChange={(e) => setCountInStock(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                    min="0"
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                  Featured Product
                </label>
              </div>
            </div>
            
            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images
              </label>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="h-24 w-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {images.length === 0 && (
                  <div className="h-24 w-full bg-gray-100 rounded-md flex items-center justify-center text-gray-500">
                    No Images
                  </div>
                )}
              </div>
              
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Image
                </label>
                <input
                  type="file"
                  onChange={uploadFileHandler}
                  className="w-full"
                  accept="image/*"
                />
                {uploadLoading && <Loader />}
                {uploadError && <Message variant="danger">{uploadError}</Message>}
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div className="mt-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Short Description
            </label>
            <textarea
              id="description"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
            ></textarea>
          </div>
          
          <div className="mt-4">
            <label htmlFor="richDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Detailed Description (HTML supported)
            </label>
            <textarea
              id="richDescription"
              rows="6"
              value={richDescription}
              onChange={(e) => setRichDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            ></textarea>
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md font-medium"
              disabled={loading}
            >
              {loading ? <Loader /> : isEdit ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProductEditPage;

