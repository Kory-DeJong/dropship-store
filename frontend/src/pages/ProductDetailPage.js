import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';
import Rating from '../components/ui/Rating';
import Loader from '../components/ui/Loader';
import Message from '../components/ui/Message';

const ProductDetailPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const { id } = useParams();
  const { isAuthenticated, user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load product details');
        setLoading(false);
        console.error(err);
      }
    };

    fetchProduct();
  }, [id, reviewSuccess]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleQuantityChange = (e) => {
    setQuantity(Number(e.target.value));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!rating) {
      setReviewError('Please select a rating');
      return;
    }
    
    try {
      setReviewLoading(true);
      setReviewError(null);
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      
      await axios.post(
        `/api/products/${id}/reviews`,
        { rating, comment },
        config
      );
      
      setReviewSuccess(true);
      setRating(0);
      setComment('');
      setReviewLoading(false);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setReviewSuccess(false);
      }, 3000);
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
      setReviewLoading(false);
      console.error(err);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Message variant="danger">{error}</Message>;
  }

  if (!product) {
    return <Message variant="info">Product not found</Message>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/products" className="text-primary-600 hover:underline mb-4 inline-block">
        &larr; Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Product Images */}
        <div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
            <img
              src={product.images[activeImage] || '/images/placeholder.jpg'}
              alt={product.name}
              className="w-full h-96 object-contain"
            />
          </div>
          
          {product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className={`cursor-pointer border-2 rounded-md overflow-hidden ${
                    activeImage === index ? 'border-primary-500' : 'border-transparent'
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <img
                    src={image}
                    alt={`${product.name} - ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          <div className="mb-4">
            <Rating value={product.rating} text={`${product.numReviews} reviews`} />
          </div>
          
          <div className="text-2xl font-bold text-primary-600 mb-4">
            ${product.price.toFixed(2)}
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Description:</h2>
            <p className="text-gray-700">{product.description}</p>
          </div>
          
          {product.countInStock > 0 ? (
            <>
              <div className="mb-4">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  {[...Array(Math.min(product.countInStock, 10)).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={handleAddToCart}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-md font-medium"
              >
                Add to Cart
              </button>
            </>
          ) : (
            <button
              disabled
              className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-md font-medium cursor-not-allowed"
            >
              Out of Stock
            </button>
          )}
          
          <div className="mt-6 border-t pt-6">
            <div className="flex items-center mb-2">
              <span className="text-gray-600 w-32">Category:</span>
              <span className="font-medium">{product.category?.name}</span>
            </div>
            
            <div className="flex items-center mb-2">
              <span className="text-gray-600 w-32">Brand:</span>
              <span className="font-medium">{product.brand}</span>
            </div>
            
            <div className="flex items-center">
              <span className="text-gray-600 w-32">Availability:</span>
              <span className={`font-medium ${product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details & Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Product Details */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Product Details</h2>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: product.richDescription || product.description }} />
          </div>
        </div>

        {/* Reviews */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
            
            {product.reviews.length === 0 ? (
              <Message variant="info">No reviews yet</Message>
            ) : (
              <div className="space-y-4 mb-6">
                {product.reviews.map((review) => (
                  <div key={review._id} className="border-b pb-4">
                    <div className="flex items-center mb-2">
                      <strong className="mr-2">{review.name}</strong>
                      <Rating value={review.rating} />
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                    <p className="mt-2">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
            
            {isAuthenticated ? (
              <div>
                <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                
                {reviewSuccess && (
                  <Message variant="success">Review submitted successfully!</Message>
                )}
                
                {reviewError && (
                  <Message variant="danger">{reviewError}</Message>
                )}
                
                <form onSubmit={handleReviewSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="0">Select...</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comment
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows="3"
                      className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md font-medium"
                    disabled={reviewLoading}
                  >
                    {reviewLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            ) : (
              <Message variant="info">
                Please <Link to="/login" className="text-primary-600 hover:underline">sign in</Link> to write a review
              </Message>
            )}
          </div>
          </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
