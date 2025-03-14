// client/src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for cookies to work
  headers: {
    'Content-Type': 'application/json'
  }
});

export const checkEligibility = async () => {
  try {
    const response = await api.get('/coupons/check-eligibility');
    return response.data;
  } catch (error) {
    console.error('Error checking eligibility:', error);
    throw error;
  }
};

export const claimCoupon = async () => {
  try {
    const response = await api.post('/coupons/claim');
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw error;
  }
};

export const getAllCoupons = async () => {
  try {
    const response = await api.get('/coupons');
    return response.data;
  } catch (error) {
    console.error('Error fetching coupons:', error);
    throw error;
  }
};

export const getCouponStats = async () => {
  try {
    const response = await api.get('/coupons/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching coupon stats:', error);
    throw error;
  }
};