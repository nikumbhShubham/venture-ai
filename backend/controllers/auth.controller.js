import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists!");
  }

  const user = await User.create({
    name,
    email,
    password,
    subscriptionPlan: "free",         
    subscriptionStatus: "inactive",   
    credits: 5,                       
  });

  if (user) {
    const token = generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      credits: user.credits,
      subscriptionPlan: user.subscriptionPlan,
      subscriptionStatus: user.subscriptionStatus,
      stripeCustomerId: user.stripeCustomerId,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data!");
  }
};

const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    const token = generateToken(res, user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      credits: user.credits,
      subscriptionPlan: user.subscriptionPlan,
      subscriptionStatus: user.subscriptionStatus,
      stripeCustomerId: user.stripeCustomerId,
      token,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
};

const getUserProfile = async (req, res) => {
  const user = req.user; // from protect middleware

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      credits: user.credits,
      subscriptionPlan: user.subscriptionPlan,
      subscriptionStatus: user.subscriptionStatus,
      stripeCustomerId: user.stripeCustomerId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};

export { registerUser, authUser, getUserProfile };
