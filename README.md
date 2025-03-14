
# Coupon Claiming System Documentation

## Project Overview
This project implements a coupon claiming system with abuse prevention mechanisms. Users can claim a coupon every **one minute** (previously set to one hour). The system prevents excessive claims from the same IP address within the cooldown period.

---

## Setup Instructions

### Prerequisites
Ensure you have the following installed:
- **Node.js** (v16+ recommended)
- **MongoDB** (local or cloud-based, e.g., MongoDB Atlas)

### Installation Steps
1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/coupon-claiming-system.git
   cd coupon-claiming-system
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory and add:
   ```sh
   MONGO_URI=your_mongodb_connection_string
   PORT=8000
   ```

4. **Start the server:**
   ```sh
   npm start
   ```
   The backend will run on `http://localhost:8000`.

---

## API Endpoints

### 1. **Get Available Coupons**
   - **Endpoint:** `GET /api/coupons`
   - **Description:** Fetches all available coupons.
   - **Response:**
     ```json
     {
       "coupons": [
         { "_id": "123", "code": "DISCOUNT50", "assignedTo": null }
       ]
     }
     ```

### 2. **Claim a Coupon**
   - **Endpoint:** `POST /api/coupons/claim`
   - **Description:** Allows users to claim a specific coupon.
   - **Request Body:**
     ```json
     { "couponId": "123" }
     ```
   - **Response:**
     ```json
     { "message": "Coupon claimed successfully!", "coupon": { "_id": "123", "code": "DISCOUNT50" } }
     ```
   - **Rate Limit:** Users can claim a coupon **once every 1 minute**.

---

## Abuse Prevention Strategies
To prevent excessive coupon claims, the following measures are implemented:

1. **IP-Based Rate Limiting:**
   - Each IP address can claim only one coupon every **1 minute**.
   - Tracked using the `UserClaim` model in MongoDB.
   - Before processing a claim, the server checks the `lastClaimed` timestamp.

2. **Cookie Tracking:**
   - The backend sets an `httpOnly` cookie (`claimedCoupon`) when a user claims a coupon.
   - This prevents users from claiming multiple coupons in separate sessions.

3. **Database Integrity Checks:**
   - Coupons are assigned only if `assignedTo` is `null`.
   - Ensures that a coupon cannot be claimed by multiple users.

4. **Server-Side Validations:**
   - The system verifies `couponId` existence and availability before assigning.
   - Prevents users from attempting to claim non-existent or already claimed coupons.


