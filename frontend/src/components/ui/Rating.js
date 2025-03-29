import React from 'react';

const Rating = ({ value, text, color = 'text-yellow-500' }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((rating) => (
        <span key={rating}>
          <svg
            className={`w-4 h-4 ${
              value >= rating
                ? color
                : value >= rating - 0.5
                ? color
                : 'text-gray-300'
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
        </span>
      ))}
      <span className="ml-2 text-sm text-gray-600">{text && text}</span>
    </div>
  );
};

export default Rating;
