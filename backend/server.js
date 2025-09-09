import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'
import { createClient } from 'redis'
// import path from 'path'
import connectDB from './config/db.js';
import authRouter from './routes/auth.routes.js';
import brandKitRouter from './routes/brandkit.routes.js';
import stripeRoutes from './routes/stripe.routes.js';



dotenv.config();
connectDB()

const app=express();

app.use(cors());

// ✅ Stripe webhooks MUST be before express.json()
import { stripeWebhook } from './controllers/stripe.controller.js'
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhook)

app.use(express.json())

app.use('/api/auth',authRouter);
app.use('/api/brandkits',brandKitRouter);
app.use('/api/stripe',stripeRoutes);


const server = http.createServer(app); 

// Attach Socket.IO to the HTTP server
const io = new Server(server, {
    cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] }
});

// app.set('socketio',io);

io.on('connection',(socket)=>{
    console.log('new client connected:',socket.id);

    socket.on('joinRoom',(userId)=>{
        socket.join(userId);
        console.log(`user ${userId} joined room ${userId}`)

    });

    socket.on('disconnect',()=>{
        console.log('Client disconnected:',socket.id);
    })
})

const redisClient=createClient({url:`redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`})
const subscriber=redisClient.duplicate();
(async()=>{
    await subscriber.connect();
    await subscriber.subscribe('realtime-events',(messaage)=>{
        console.log('[Redis SUB] Received message:',messaage);
        const {event,data}=JSON.parse(messaage);
        if(event=='brandKitCompleted'){
            io.to(data.userId).emit('brandKitCompleted',data.kit);
        }
        if(event=='brandKitFailed'){
            io.to(data.userId).emit('brandKitFailed',{brandKitId:data.brandKitId});
        }
    })
    console.log('Redis subscriber connected and listening on "realtime-events" ')
})()

const PORT= process.env.PORT || 5001;

server.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
})


