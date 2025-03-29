import React from 'react';
import { Link } from 'react-router-dom';

const Paginate = ({ pages, page, keyword = '', isAdmin = false, path = '' }) => {
  if (pages <= 1) {
    return null;
  }

  const getPageUrl = (pageNumber) => {
    if (isAdmin) {
      return `/admin/${path}?pageNumber=${pageNumber}`;
    }
    return keyword ? `/search/${keyword}/page/${pageNumber}` : `/page/${pageNumber}`;
  };

  return (
    <div className="flex justify-center mt-8">
      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
        <Link
          to={getPageUrl(page > 1 ? page - 1 : 1)}
          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
            page === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <span className="sr-only">Previous</span>
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </Link>

        {[...Array(pages).keys()].map((x) => (
          <Link
            key={x + 1}
            to={getPageUrl(x + 1)}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
              x + 1 === page
                ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {x + 1}
          </Link>
        ))}

        <Link
          to={getPageUrl(page < pages ? page + 1 : pages)}
          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
            page === pages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <span className="sr-only">Next</span>
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </nav>
    </div>
  );
};

export default Paginate;
