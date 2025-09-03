import { Worker } from "bullmq";
import path from "path";
import { execa } from "execa";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import BrandKit from "../models/brandKit.model.js";

// import agent from "../../venture_ai_core/"

dotenv.config();
connectDB();

const redisConnection = {
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
};

console.log("worker is starting...");

const worker = new Worker("generation-queue", async (job) => {
  const { brandKitId, businessIdea } = job.data;
  console.log(`[worker] Processing job for brandkit ID : ${brandKitId}`);

  try { 
    const pythonAgentPath = path.resolve('../venture_ai_core/main.py');

    const { stdout } = await execa("python", [pythonAgentPath, businessIdea]);

    const aiResult = JSON.parse(stdout);

    await BrandKit.findByIdAndUpdate(brandKitId, {
      status: "completed",
      brandName: aiResult.brand_name,
      targetPersona: aiResult.target_persona,
      brandStory: aiResult.brand_story,
      logoPrompt: aiResult.logo_prompt,
      logoConcept: aiResult.logo_concept,
    });

    console.log(`[worker] Successfully completed job for brandkit ID: ${brandKitId}`)

  } catch (error) {
    console.error(`[worker] job failed for brandkit ID: ${brandKitId}`,error);

    await BrandKit.findByIdAndUpdate(brandKitId,{
        status:'failed',
        errorMessage:error.stderr || error.message,
    })

  }
},{connection:redisConnection});

worker.on('completed',job =>{
    console.log(`job ${job.id} has completed!`);
})

worker.on('failed',(job,err)=>{
    console.log(`job ${job.id} has failed with ${err.message}`);
})

