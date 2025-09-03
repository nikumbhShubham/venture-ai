import mongoose from "mongoose";

const brandKitSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    businessIdea: {
      type: String,
      required: true,
    },
    brandName: {
      type: String,
      required: true,
    },
    targetPersona: {
      type: String,
      required: true,
    },
    brandStory: {
      type: String,
      required: true,
    },
    logoPrompt: {
      type: String,
      required: true,
    },
    logoConcept: {
      // This will store the base64 encoded string of the generated image
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    errorMessage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const BrandKit = mongoose.model("BrandKit", brandKitSchema);
export default BrandKit;
