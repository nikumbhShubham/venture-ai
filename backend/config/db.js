import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config();

const connectDB=async()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGO_URI);
        console.log("DB connected!!");
    }catch(e){
        console.log("Mongo DB connection error",e);
        process.exit(1);
    }

}
export default connectDB;

