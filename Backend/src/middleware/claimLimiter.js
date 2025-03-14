import CouponClaim from '../models/CouponClaim.js';

const claimLimiter = async (req, res, next) => {
  try {
    const ipAddress = req.ip;
    const userIdentifier = req.cookies.userIdentifier;
    const cooldownPeriod = process.env.CLAIM_COOLDOWN || 3600000; // Default 1 hour in ms

    // Check if the user has claimed a coupon recently based on IP
    const ipRecentClaim = await CouponClaim.findOne({
      ipAddress,
      claimedAt: { $gt: new Date(Date.now() - cooldownPeriod) }
    }).sort({ claimedAt: -1 });

    // Check if the user has claimed a coupon recently based on cookie
    const cookieRecentClaim = userIdentifier
      ? await CouponClaim.findOne({
          userIdentifier,
          claimedAt: { $gt: new Date(Date.now() - cooldownPeriod) }
        }).sort({ claimedAt: -1 })
      : null;

    // If either check found a recent claim, block the request
    if (ipRecentClaim || cookieRecentClaim) {
      const mostRecentClaim =
        ipRecentClaim && cookieRecentClaim
          ? ipRecentClaim.claimedAt > cookieRecentClaim.claimedAt
            ? ipRecentClaim
            : cookieRecentClaim
          : ipRecentClaim || cookieRecentClaim;

      const timeElapsed = Date.now() - mostRecentClaim.claimedAt;
      const timeRemaining = cooldownPeriod - timeElapsed;

      return res.status(429).json({
        success: false,
        message: 'You have recently claimed a coupon',
        timeRemaining: Math.ceil(timeRemaining / 60000) // Convert to minutes
      });
    }

    next();
  } catch (error) {
    console.error('Error in claim limiter middleware:', error);
    next(error);
  }
};

export {claimLimiter};
