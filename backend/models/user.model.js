import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define constants for our subscription plans
const FREE_CREDITS = 5;
const PRO_CREDITS = 50;

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        
        // --- NEW SAAS FIELDS ---
        
        subscriptionPlan: {
            type: String,
            enum: ['free', 'pro', 'enterprise'],
            default: 'free',
        },
        credits: {
            type: Number,
            default: FREE_CREDITS, // New users start with 5 free credits
        },
        
        // These fields are for integrating with a payment provider like Stripe later
        stripeCustomerId: {
            type: String,
        },
        stripeSubscriptionId: {
            type: String,
        },
        subscriptionStatus: {
            type: String,
            enum: ['active', 'inactive', 'past_due', 'canceled'],
            default: 'inactive',
        },
    },
    {
        timestamps: true,
    }
);

// This "pre-save hook" for password hashing remains unchanged
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// This method for password matching remains unchanged
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;

