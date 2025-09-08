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

    colorPalette: { type: Map, of: String, default: {} },
    fontPairing: { type: Map, of: String, default: {} },
    marketPositioning: { type: String, default: "" },
    marketingChannels: { type: [String], default: [] },
    contentPillars: { type: [String], default: [] },
    postIdeas: { type: [String], default: [] },
    finalReport: { type: String, default: "" },
    errorMessage: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const BrandKit = mongoose.model("BrandKit", brandKitSchema);
export default BrandKit;
