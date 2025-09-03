import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js';
import authRouter from './routes/auth.routes.js';
import brandKitRouter from './routes/brandkit.routes.js';

dotenv.config();
connectDB()

const app=express();

app.use(cors());

app.use(express.json())

app.use('/api/auth',authRouter);
app.use('/api/brandkits',brandKitRouter);



const PORT= process.env.PORT || 5001;

app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
})


