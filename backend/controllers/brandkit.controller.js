import BrandKit from "../models/brandKit.model.js";
import User from "../models/user.model.js";
import {generationQueue} from '../workers/generationQueue.js'

const createBrandKit = async (req, res) => {
  const { businessIdea } = req.body;
  if (!businessIdea) {
    res.status(400);
    throw new Error("business idea is required");
  }
  const user = await User.findById(req.user._id);

  if (!user || user.credits < 1) {
    res.status(402);
    throw new Error("You have ran out of credits!! please upgrade your plan");
  }

  const brandKit = await BrandKit.create({
    user: req.user._id,
    businessIdea: businessIdea,
    status: "pending",
    brandName: "Generating...",
    targetPersona: "Generating...",
    brandStory: "Generating...",
    logoPrompt: "Generating...",
    logoConcept: "demoLogo.png",
  });

  if (brandKit) {
    user.credits -= 1;
    await user.save();

    await generationQueue.add("generateBrandKit", {
      brandKitId: brandKit._id,
      businessIdea: businessIdea,
    });
    console.log(`[Queue] Added job for BrandKit ID: ${brandKit._id}`);

    res.status(202).json({
      message:
        "Brand kit generation has started. It will appear on your dashboard shortly.",
      brandKitId: brandKit._id,
      creditsRemaining: user.credits,
    });
  }else{
    res.status(400);
    throw new Error("Invalid brandKit data!!");
  }
};

const getUserBrandKits=async(req,res)=>{
    const brandKits=await BrandKit.find({user:req.user._id}).sort({createdAt:-1});
    res.json(brandKits);
}

const getBrandKitsbyId=async(req,res)=>{
    const brandKit=await BrandKit.findById(req.params.id);
    if(brandKit && brandKit.user.toString()==req.user._id.toString()){
        res.json(brandKit);
    }else{
        res.status(400);
        throw new Error("brandKit not found!!");
    }
}


export default {createBrandKit, getBrandKitsbyId,getUserBrandKits};
