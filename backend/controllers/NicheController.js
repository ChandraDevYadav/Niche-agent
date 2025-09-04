import FYCNiche from "../models/NicheModel.js";
import { A2AClient } from "@a2a-js/sdk";

// Consulting Niche Agent endpoint
const consultingAgentUrl =
  process.env.CONSULTING_AGENT_URL || "http://localhost:3013/a2a";
const a2aClient = new A2AClient({ endpoint: consultingAgentUrl });

export const generateNicheResult = async (req, res) => {
  const { formData, selectedAssets } = req.body;
  const email = req.user.email;
  const userId = req.user.id;

  let previewText = "";
  if (selectedAssets?.length) {
    previewText = selectedAssets
      .map((a) => `${a.category}: ${a.content}`)
      .join(" and ");
  }

  try {
    const a2aResponse = await a2aClient.send({
      jsonrpc: "2.0",
      method: "generateNiche",
      params: { formData, previewText, userEmail: email },
      id: 1,
    });

    const recommendation = a2aResponse?.result?.recommendation;

    const updatedDoc = await FYCNiche.findOneAndUpdate(
      { userId },
      {
        email,
        userId,
        qaPairs: formData,
        gptResponse: recommendation,
        updatedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    res.json({
      status: "sent",
      response: { jsonrpc: "2.0", result: { recommendation }, id: 1 },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate niche recommendation" });
  }
};

export const getUserData = async (req, res) => {
  const userId = req.user.id;
  try {
    const userData = await FYCNiche.findOne({ userId });
    if (!userData)
      return res.status(404).json({ message: "User data not found" });
    res.json(userData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
};

export const deleteUserData = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await FYCNiche.updateOne(
      { userId },
      { $unset: { gptResponse: "" } }
    );
    if (result.modifiedCount === 1)
      return res.json({ message: "User data reset successfully" });
    res.status(404).json({ message: "User data not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to reset user data" });
  }
};

export const getUserAssets = async (req, res) => {
  const userId = req.user.id;
  try {
    const assets = await FYCNiche.find({ userId }, { gptResponse: 1 });
    res.json(assets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user assets" });
  }
};
