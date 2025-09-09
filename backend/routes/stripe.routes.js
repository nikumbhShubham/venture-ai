import express from 'express';
const router = express.Router();
import { createCheckoutSession, stripeWebhook } from '../controllers/stripe.controller.js';
import { protect } from '../middleware/auth.middleware.js';

// This route is protected; only a logged-in user can create a payment session.
router.post('/create-checkout-session', protect, createCheckoutSession);

// This route must be public for Stripe's servers to reach it.
// We use a special express middleware to get the raw request body, which Stripe requires.
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

export default router;

// ```

// ---
//5. Update `server.js`

// Finally, tell your main server to use these new routes. Add one line to your `backend/server.js` file.

// ```javascript
// // In backend/server.js
// import stripeRoutes from './routes/stripeRoutes.js'; // <-- Import the new routes

// // ... (your existing code)

// // --- API Routes ---
// app.use('/api/auth', authRoutes);
// app.use('/api/brandkits', brandKitRoutes);
// app.use('/api/stripe', stripeRoutes); // <-- Add this line to use the Stripe routes

// // ... (the rest of your server code)
