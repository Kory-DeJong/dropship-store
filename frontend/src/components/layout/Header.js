import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import CartContext from '../../context/CartContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/products/search/${searchKeyword}`);
      setSearchKeyword('');
    } else {
      navigate('/products');
    }
  };

  // Check if user is admin - making it more robust
  const isAdmin = user && (user.role === 'admin' || user.isAdmin === true);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary-600">
            DropShipMaster
          </Link>

          {/* Search Bar */}
          <div className="hidden md:block flex-grow max-w-md mx-4">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
              <button
                type="submit"
                className="bg-primary-600 text-white px-4 py-2 rounded-r-md hover:bg-primary-700"
              >
                Search
              </button>
            </form>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/products" className="text-gray-700 hover:text-primary-600">
              Products
            </Link>
            <Link to="/cart" className="text-gray-700 hover:text-primary-600 relative">
              <span>Cart</span>
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  className="text-gray-700 hover:text-primary-600 flex items-center"
                  onClick={toggleDropdown}
                >
                  <span>{user.name || 'Admin User'}</span>
                  <svg 
                    className={`ml-1 h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orderhistory"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Order History
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-semibold bg-gray-50"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-gray-700 hover:text-primary-600">
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Link to="/cart" className="text-gray-700 hover:text-primary-600 relative mr-4">
              <span>Cart</span>
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                </span>
              )}
            </Link>
            <button
              onClick={toggleMenu}
              className="text-gray-500 hover:text-gray-600 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="mt-4 md:hidden">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <button
              type="submit"
              className="bg-primary-600 text-white px-4 py-2 rounded-r-md hover:bg-primary-700"
            >
              Search
            </button>
          </form>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-gray-200">
            <ul className="space-y-4">
              <li>
                <Link
                  to="/products"
                  className="block text-gray-700 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Products
                </Link>
              </li>
              {isAuthenticated ? (
                <>
                  <li>
                    <Link
                      to="/profile"
                      className="block text-gray-700 hover:text-primary-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/orderhistory"
                      className="block text-gray-700 hover:text-primary-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Order History
                    </Link>
                  </li>
                  {isAdmin && (
                    <li>
                      <Link
                        to="/admin/dashboard"
                        className="block text-gray-700 hover:text-primary-600 font-semibold"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    </li>
                  )}
                  <li>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="block text-gray-700 hover:text-primary-600"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    to="/login"
                    className="block text-gray-700 hover:text-primary-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
