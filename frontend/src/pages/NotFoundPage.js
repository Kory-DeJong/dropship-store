import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center">
      <div className="text-9xl font-bold text-primary-600">404</div>
      <h1 className="text-3xl font-bold mt-6 mb-2">Page Not Found</h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-6 rounded-md font-medium"
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;
