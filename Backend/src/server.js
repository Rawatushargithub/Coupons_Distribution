import dotenv from "dotenv";
import connectDB from "./db_config/db.js";
import app  from "./app.js";

dotenv.config({
  path: './.env'
})

connectDB()  // as this function run the async function so it will return  the promise 
.then (() => {
    // here we are listening for an event for a error
    app.on("error" , (error) =>{
        console.log("ERRR : " , error);
        throw error
    })


    app.listen(  process.env.PORT || 8000 , () => {
        console.log(` Server is running at port : Server at http://localhost:${process.env.PORT}`);
    })
   
})
.catch((error) => { 
    console.log("MONGO DB connection failed !!! " , error);
})