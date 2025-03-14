import mongoose from 'mongoose';

const couponClaimSchema = new mongoose.Schema({
  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon',
    required: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  userIdentifier: {
    type: String,
    required: true
  },
  claimedAt: {
    type: Date,
    default: Date.now
  }
});

// Create compound index to efficiently query by IP and time
couponClaimSchema.index({ ipAddress: 1, claimedAt: 1 });
couponClaimSchema.index({ userIdentifier: 1, claimedAt: 1 });

const CouponClaim = mongoose.model('CouponClaim', couponClaimSchema);

export default CouponClaim;
