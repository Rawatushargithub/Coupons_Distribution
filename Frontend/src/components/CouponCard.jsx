// client/src/components/CouponCard.js
import React from 'react';

const CouponCard = ({ coupon }) => {
  if (!coupon) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-md mx-auto">
      <div className="border-2 border-dashed border-blue-400 p-4 rounded-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-2">{coupon.code}</h2>
        <p className="text-gray-700 text-center mb-3">{coupon.description}</p>
        <div className="flex justify-center">
          <span className="bg-blue-100 text-blue-800 text-xl font-semibold px-3 py-1 rounded">
            {coupon.discountPercentage}% OFF
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-4 text-center">
        Use this code at checkout to receive your discount
      </p>
    </div>
  );
};

export default CouponCard;