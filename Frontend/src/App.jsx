// client/src/App.js
import React, { useState, useEffect } from 'react';
import { checkEligibility, claimCoupon } from './services/api';
import CouponCard from './components/CouponCard';
import CountdownTimer from './components/CountdownTimer';
import CouponList from './components/CouponList';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [eligible, setEligible] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [coupon, setCoupon] = useState(null);
  const [error, setError] = useState(null);
  const [claiming, setClaiming] = useState(false);
  const [showAllCoupons, setShowAllCoupons] = useState(false);

  // Check eligibility on component mount
  useEffect(() => {
    const checkUserEligibility = async () => {
      try {
        setLoading(true);
        const data = await checkEligibility();
        setEligible(data.eligible);
        if (!data.eligible) {
          setTimeRemaining(data.timeRemaining);
        }
      } catch (err) {
        setError('Error connecting to server. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    checkUserEligibility();
  }, []);

  const handleClaimCoupon = async () => {
    try {
      setClaiming(true);
      setError(null);
      
      const response = await claimCoupon();
      
      if (response.success) {
        setCoupon(response.coupon);
        setEligible(false);
        setTimeRemaining(60); // Default to 60 min if not specified in response
      } else {
        setError(response.message || 'Failed to claim coupon');
        if (response.timeRemaining) {
          setTimeRemaining(response.timeRemaining);
          setEligible(false);
        }
      }
    } catch (err) {
      setError('Error connecting to server. Please try again later.');
    } finally {
      setClaiming(false);
    }
  };

  const toggleCouponList = () => {
    setShowAllCoupons(!showAllCoupons);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Coupon Distribution System</h1>
          <p className="mt-2 text-lg text-gray-600">
            Claim your exclusive discount coupon below
          </p>
          <button 
            onClick={toggleCouponList}
            className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          >
            {showAllCoupons ? 'Hide Coupon List' : 'View All Coupons'}
          </button>
        </header>

        {showAllCoupons && <CouponList />}

        <main className="bg-white rounded-xl shadow-md overflow-hidden p-6 mt-4">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
              <p>{error}</p>
            </div>
          ) : coupon ? (
            <div className="text-center">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Congratulations!</h2>
                <p className="text-gray-600">You've successfully claimed your coupon:</p>
              </div>
              <CouponCard coupon={coupon} />
              <CountdownTimer initialMinutes={timeRemaining} />
            </div>
          ) : eligible ? (
            <div className="text-center">
              <p className="text-xl text-gray-800 mb-6">
                You're eligible to claim a coupon!
              </p>
              <button
                onClick={handleClaimCoupon}
                disabled={claiming}
                className={`px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-sm 
                  ${claiming ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
              >
                {claiming ? 'Claiming...' : 'Claim Your Coupon'}
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-xl text-gray-800 mb-4">
                You've recently claimed a coupon
              </p>
              <p className="text-gray-600 mb-6">
                Please wait before claiming another one
              </p>
              <CountdownTimer initialMinutes={timeRemaining} />
            </div>
          )}
        </main>

        <footer className="mt-10 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Coupon Distribution System</p>
        </footer>
      </div>
    </div>
  );
}

export default App;