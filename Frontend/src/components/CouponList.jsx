// client/src/components/CouponList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL ='http://localhost:8000/api/v1';

const CouponList = () => {
  const [coupons, setCoupons] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true);
        const [couponsResponse, statsResponse] = await Promise.all([
          axios.get(`${API_URL}/coupons`),
          axios.get(`${API_URL}/coupons/stats`)
        ]);
        
        setCoupons(couponsResponse.data.coupons);
        setStats(statsResponse.data.stats);
      } catch (err) {
        console.error('Error fetching coupon data:', err);
        setError('Failed to load coupon data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Coupons</h2>
      
      {/* Stats Summary */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-700">Total Coupons</h3>
            <p className="text-3xl font-bold text-blue-900">{stats.totalCoupons}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-700">Total Claims</h3>
            <p className="text-3xl font-bold text-green-900">{stats.totalClaims}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-700">Distribution</h3>
            <p className="text-sm text-purple-900">
              Min: <span className="font-bold">{stats.distributionStats?.minDistribution || 0}</span> | 
              Avg: <span className="font-bold">{Math.round((stats.distributionStats?.avgDistribution || 0) * 10) / 10}</span> | 
              Max: <span className="font-bold">{stats.distributionStats?.maxDistribution || 0}</span>
            </p>
          </div>
        </div>
      )}
      
      {/* Coupon Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Discount
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Times Claimed
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Next Up
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {coupons.map((coupon, index) => (
              <tr key={coupon._id} className={index === 0 ? "bg-yellow-50" : ""}>
                <td className="py-4 px-4 whitespace-nowrap font-medium text-gray-900">
                  {coupon.code}
                </td>
                <td className="py-4 px-4 whitespace-nowrap text-gray-700">
                  {coupon.description}
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {coupon.discountPercentage}%
                  </span>
                </td>
                <td className="py-4 px-4 whitespace-nowrap text-gray-700">
                  {coupon.distributionCount}
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  {index === 0 ? (
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Next in line
                    </span>
                  ) : (
                    <span className="text-gray-500">In queue</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent Activity */}
      {stats && stats.recentClaims && stats.recentClaims.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <ul className="divide-y divide-gray-200">
            {stats.recentClaims.map((claim, index) => (
              <li key={index} className="py-3 flex justify-between">
                <div className="text-gray-800">
                  <span className="font-medium">{claim.couponId?.code || 'Unknown'}</span> 
                  <span className="text-gray-600"> was claimed</span>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(claim.claimedAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CouponList;