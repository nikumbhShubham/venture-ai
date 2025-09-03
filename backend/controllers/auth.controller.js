import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("user already exists!!");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    const token = generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      credits: user.credits,
      token: token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data!!");
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
      token: token,
    });
  } else {
    res.status(401); // 401 Unauthorized
    throw new Error("Invalid email or password");
  }
};

const getUserProfile = async (req, res) => {
    // The user object is attached to the request in the 'protect' middleware
    const user = req.user; 
    
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            credits: user.credits,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};

export {registerUser,authUser,getUserProfile};
