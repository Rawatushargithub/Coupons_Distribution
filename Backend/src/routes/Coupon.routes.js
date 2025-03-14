import { Router } from "express";
import { checkEligibility, getNextCoupon , seedCoupons , getAllCoupons , getCouponStats } from "../controllers/Coupon.controller.js";
import { claimLimiter } from "../middleware/claimLimiter.js"

const router = Router();
// Public routes
router.route('/check-eligibility').get(checkEligibility);
router.route('/claim').post( claimLimiter, getNextCoupon);
router.get('/', getAllCoupons);
router.get('/stats',getCouponStats);

// Admin routes (would be protected in production)
router.route('/seed').post(seedCoupons);

export default router;