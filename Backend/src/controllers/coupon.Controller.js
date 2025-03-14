import Coupon from "../models/Coupon.js"
import CouponClaim from '../models/CouponClaim.js';
import { v4 as uuidv4 } from 'uuid';

// Get the next available coupon in round-robin fashion
export const getNextCoupon = async (req, res) => {
  try {
    // Find all active coupons sorted by distribution count
    const coupons = await Coupon.find({ isActive: true }).sort({ distributionCount: 1 });

    if (coupons.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No coupons available at this time'
      });
    } 

    // Get the coupon with the lowest distribution count (round-robin)
    const nextCoupon = coupons[0];

    // Create user identifier if not exists
    if (!req.cookies.userIdentifier) {
      const userIdentifier = uuidv4();
      res.cookie('userIdentifier', userIdentifier, {
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      req.cookies.userIdentifier = userIdentifier;
    }

    // Record the claim
    await CouponClaim.create({
      couponId: nextCoupon._id,
      ipAddress: req.ip,
      userIdentifier: req.cookies.userIdentifier
    });

    // Update the distribution count
    await Coupon.findByIdAndUpdate(nextCoupon._id, {
      $inc: { distributionCount: 1 }
    });

    // Return the coupon
    return res.status(200).json({
      success: true,
      message: 'Coupon claimed successfully',
      coupon: {
        code: nextCoupon.code,
        description: nextCoupon.description,
        discountPercentage: nextCoupon.discountPercentage
      }
    });
  } catch (error) {
    console.error('Error getting next coupon:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to claim coupon',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Check if user can claim a coupon (without actually claiming)
export const checkEligibility = async (req, res) => {
  try {
    const ipAddress = req.ip;
    const userIdentifier = req.cookies.userIdentifier;
    const cooldownPeriod = process.env.CLAIM_COOLDOWN || 3600000;

    // Check for recent claims
    const ipRecentClaim = await CouponClaim.findOne({
      ipAddress,
      claimedAt: { $gt: new Date(Date.now() - cooldownPeriod) }
    }).sort({ claimedAt: -1 });

    const cookieRecentClaim = userIdentifier ? await CouponClaim.findOne({
      userIdentifier,
      claimedAt: { $gt: new Date(Date.now() - cooldownPeriod) }
    }).sort({ claimedAt: -1 }) : null;

    if (ipRecentClaim || cookieRecentClaim) {
      const mostRecentClaim = ipRecentClaim && cookieRecentClaim
        ? (ipRecentClaim.claimedAt > cookieRecentClaim.claimedAt ? ipRecentClaim : cookieRecentClaim)
        : (ipRecentClaim || cookieRecentClaim);

      const timeElapsed = Date.now() - mostRecentClaim.claimedAt;
      const timeRemaining = cooldownPeriod - timeElapsed;

      return res.status(200).json({
        eligible: false,
        message: 'You have recently claimed a coupon',
        timeRemaining: Math.ceil(timeRemaining / 60000) // Minutes
      });
    }

    return res.status(200).json({
      eligible: true,
      message: 'You are eligible to claim a coupon'
    });
  } catch (error) {
    console.error('Error checking eligibility:', error);
    return res.status(500).json({
      eligible: false,
      message: 'Error checking eligibility',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Admin endpoint to seed coupons (protected in production)
export const seedCoupons = async (req, res) => {
  // This would be protected with authentication in a real app
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ success: false, message: 'Not allowed in production' });
  }

  try {
    const coupons = [
      { code: 'DISCOUNT10', description: '10% off your purchase', discountPercentage: 10 },
      { code: 'DISCOUNT20', description: '20% off your purchase', discountPercentage: 20 },
      { code: 'FREESHIP', description: 'Free shipping on your order', discountPercentage: 100 },
      { code: 'SUMMER25', description: '25% Summer special discount', discountPercentage: 25 },
      { code: 'WELCOME15', description: '15% off for new customers', discountPercentage: 15 }
    ];
    console.log(Coupon.collection.name)
    //await Coupon.deleteMany({}); // Clear existing coupons
    await Coupon.insertMany(coupons);

    return res.status(201).json({
      success: true,
      message: 'Coupons seeded successfully',
      count: coupons.length
    });
  } catch (error) {
    console.error('Error seeding coupons:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to seed coupons',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all available coupons
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({ isActive: true })
      .select('code description discountPercentage distributionCount')
      .sort({ distributionCount: 1 });
    
    return res.status(200).json({
      success: true,
      count: coupons.length,
      coupons
    });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch coupons',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get stats for coupons
export const getCouponStats = async (req, res) => {
  try {
    const totalCoupons = await Coupon.countDocuments({ isActive: true });
    const totalClaims = await CouponClaim.countDocuments();
    
    // Get distribution counts for each coupon
    const distributionStats = await Coupon.aggregate([
      { $match: { isActive: true } },
      { $group: { 
        _id: null, 
        avgDistribution: { $avg: '$distributionCount' },
        maxDistribution: { $max: '$distributionCount' },
        minDistribution: { $min: '$distributionCount' }
      }}
    ]);
    
    // Get recent claims
    const recentClaims = await CouponClaim.find()
      .sort({ claimedAt: -1 })
      .limit(10)
      .populate('couponId', 'code')
      .select('claimedAt ipAddress -_id');
    
    return res.status(200).json({
      success: true,
      stats: {
        totalCoupons,
        totalClaims,
        distributionStats: distributionStats[0] || {},
        recentClaims
      }
    });
  } catch (error) {
    console.error('Error fetching coupon stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch coupon statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
