import { Worker } from "bullmq";
import path from "path";
import { execa } from "execa";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import BrandKit from "../models/brandKit.model.js";
import { createClient } from "redis";
import { fileURLToPath } from "url";

dotenv.config();
connectDB();

const redisConnection = {
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
};

const publisher = createClient({
  url: `redis://${redisConnection.host}:${redisConnection.port}`,
});
publisher.on("error", (err) => console.log("Redis connection error", err));
(async () => {
  await publisher.connect();
  console.log("Redis publisher connected");
})();

console.log("worker is starting...");

const worker = new Worker(
  "generation-queue",
  async (job) => {
    // const { brandKitId, businessIdea } = job.data;
    const { brandKitId, businessIdea, userId } = job.data; // <-- Get userId from job data
    console.log(`[worker] Processing job for brandkit ID : ${brandKitId}`);

    try {
      const pythonAgentPath = path.resolve("../venture_ai_core/main.py");

      const { stdout } = await execa("python", [pythonAgentPath, businessIdea]);
      const aiResult = JSON.parse(stdout);

      const normalizeMap = (obj, fallback = {}) => {
        if (!obj || typeof obj !== "object" || Array.isArray(obj))
          return fallback;
        const clean = {};
        for (const [key, value] of Object.entries(obj)) {
          if (typeof key === "string" && value) clean[key] = String(value);
        }
        return clean;
      };

      // ✅ Sanitize Maps and Arrays
      const safeColorPalette = normalizeMap(aiResult.color_palette, {
        primary: "#000000",
        secondary: "#FFFFFF",
        accent1: "#CCCCCC",
        accent2: "#999999",
      });

      const safeFontPairing = normalizeMap(aiResult.font_pairing, {
        heading: "Roboto",
        body: "Open Sans",
      });

      const updatedKit = await BrandKit.findByIdAndUpdate(brandKitId, {
        status: "completed",
        brandName: aiResult.brand_name || "Untitled",
        targetPersona: aiResult.target_persona || "",
        brandStory: aiResult.brand_story || "",
        marketPositioning: aiResult.market_positioning || "",
        logoPrompt: aiResult.logo_prompt || "",
        logoConcept: aiResult.logo_concept || "demoLogo.png",
        colorPalette: safeColorPalette, // ✅ sanitized
        fontPairing: safeFontPairing, // ✅ sanitized
        marketingChannels: Array.isArray(aiResult.marketing_channels)
          ? aiResult.marketing_channels
          : [],
        contentPillars: Array.isArray(aiResult.content_pillars)
          ? aiResult.content_pillars
          : [],
        postIdeas: Array.isArray(aiResult.post_ideas)
          ? aiResult.post_ideas
          : [],
        finalReport: aiResult.final_report || "",
      });

      console.log(
        `[worker] Successfully completed job for brandkit ID: ${brandKitId}`
      );

      const message = JSON.stringify({
        event: "brandKitCompleted",
        data: { userId, kit: updatedKit },
      });
      await publisher.publish("realtime-events", message);
    } catch (error) {
      console.error(
        `[worker] job failed for brandkit ID: ${brandKitId}`,
        error.stderr || error.message
      );

      await BrandKit.findByIdAndUpdate(brandKitId, {
        status: "failed",
        errorMessage: error.stderr || error.message,
      });
      const message = JSON.stringify({
        event: "brandKitFailed",
        data: { userId, brandKitId },
      });
      await publisher.publish("realtime-events", message);
    }
  },
  { connection: redisConnection });

worker.on("completed", (job) => {
  console.log(`job ${job.id} has completed!`);
});

worker.on("failed", (job, err) => {
  console.log(`job ${job.id} has failed with ${err.message}`);
});
