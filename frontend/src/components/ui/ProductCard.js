import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import CartContext from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Link to={`/product/${product._id}`}>
        <img
          src={product.images[0] || '/images/placeholder.jpg'}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4">
        <Link to={`/product/${product._id}`} className="block">
          <h3 className="text-lg font-semibold text-gray-800 hover:text-primary-600 truncate">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center mt-1">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, index) => (
              <svg
                key={index}
                className={`w-4 h-4 ${
                  index < Math.round(product.rating) ? 'text-yellow-500' : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 15.585l-6.327 3.354 1.209-7.07L.342 7.478l7.076-1.027L10 0l2.582 6.45 7.076 1.028-4.54 4.39 1.209 7.07z"
                  clipRule="evenodd"
                />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">({product.numReviews} reviews)</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
          {product.countInStock > 0 ? (
            <button
              onClick={handleAddToCart}
              className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded-md text-sm"
            >
              Add to Cart
            </button>
          ) : (
            <span className="text-red-500 text-sm">Out of Stock</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
