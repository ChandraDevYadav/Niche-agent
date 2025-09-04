import mongoose from "mongoose";

const nicheSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  email: { type: String, required: true },
  qaPairs: { type: Array, default: [] },
  gptResponse: { type: String, default: "" },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("FYCNiche", nicheSchema);
