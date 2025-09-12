import Stripe from 'stripe'
import User from '../models/user.model.js'

const stripe= new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession=async(req, res)=>{
    const {priceId}=req.body;
    const user= await User.findById(req.user._id);

    if(!user){
        return res.status(404).send('User not found!!');
    }

    try {
        let stripeCustomerId=user.stripeCustomerId;

        if(!stripeCustomerId){
            console.log('creating new customer ID for user:',user.email)
           const customer= await stripe.customers.create({
                email:user.email,
                name:user.name,
                metadata:{
                    userId:user._id.toString()
                }
            })
            stripeCustomerId=customer.id;
            user.stripeCustomerId=stripeCustomerId;
            await user.save();
            console.log('New Stripe customer created and saved:', stripeCustomerId);
        }

        const session=await stripe.checkout.sessions.create({
            mode:'subscription',
            payment_method_types:['card'],
            customer:stripeCustomerId,
            line_items:[{price:priceId, quantity:1}],
            success_url:`${process.env.FRONTEND_URL}/dashboard?/payment_success=true`,
            cancel_url:`${process.env.FRONTEND_URL}/pricing?/payment_canceled=true`,
            metadata:{userId:user._id.toString()}
        });

        // res.send({session:session.url});
        res.send({ url: session.url });

    } catch (error) {
        console.error('Stripe session error:', error);
        res.status(500).send('Internal Server Error');        
    }

};

export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, // raw buffer, not parsed JSON
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata.userId;

        const user = await User.findById(userId);
        if (user) {
          user.subscriptionPlan = "pro";
          user.credits = (user.credits || 0) + 50;
          user.stripeSubscriptionId = session.subscription;
          user.stripeCustomerId = session.customer;
          user.subscriptionStatus = "active";
          await user.save();
          console.log(` User ${userId} upgraded to Pro.`);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const user = await User.findOne({ stripeCustomerId: invoice.customer });
        if (user) {
          user.subscriptionStatus = "past_due";
          await user.save();
          console.log(` User ${user._id} payment failed.`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const user = await User.findOne({ stripeCustomerId: subscription.customer });
        if (user) {
          user.subscriptionPlan = "free";
          user.credits = 5;
          user.subscriptionStatus = "canceled";
          user.stripeSubscriptionId = undefined;
          await user.save();
          console.log(` User ${user._id} downgraded to Free.`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    res.status(500).send("Webhook handler failed");
  }
};
