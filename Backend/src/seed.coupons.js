import mongoose from "mongoose";
import dotenv from "dotenv";
import Coupon from "./models/Coupon.js";
import connectDB from "./db_config/db.js";

dotenv.config({
  path: './.env'
})

connectDB()  // as this function run the async function so it will return  the promise 
.then (() => {

    // Array of coupon codes
const coupons = [
    { code: "DISCOUNT10" },
    { code: "SAVE20" },
    { code: "OFFER30" },
    { code: "SUPER50" },
    { code: "MEGA100" }
  ];
  
    // Insert coupons into MongoDB
    const seedCoupons = async () => {
        try {
          await Coupon.insertMany(coupons);
          console.log("Coupons added successfully!");
        } catch (error) {
          console.error("Error seeding coupons:", error);
        } finally {
          mongoose.connection.close();
        }
      };
      
      // Run the function
      seedCoupons();
      
})
.catch((error) => { 
    console.log("MONGO DB connection failed !!! " , error);
})


