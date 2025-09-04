import express from "express";
import cors from "cors";
import { A2AClient } from "@a2a-js/sdk/client";
import crypto from "crypto";

const PORT = 5000;
const app = express();
app.use(cors());
app.use(express.json());

const AGENT_CARD_URL = "http://localhost:3013/.well-known/agent-card.json";

// Helper: fetch with retries
async function fetchAgentCardWithRetry(url, retries = 1, delayMs = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      const client = await A2AClient.fromCardUrl(url);
      console.log("✅ Agent card fetched successfully");
      return client;
    } catch (err) {
      console.error(`⚠️ Fetch attempt ${i + 1} failed: ${err.message}`);
      if (i < retries - 1) {
        console.log(`⏳ Retrying in ${delayMs}ms...`);
        await new Promise((res) => setTimeout(res, delayMs));
      } else {
        throw new Error(`Failed to fetch agent card after ${retries} attempts`);
      }
    }
  }
}

app.post("/start", async (req, res) => {
  try {
    const { topic } = req.body;
    const client = await fetchAgentCardWithRetry(AGENT_CARD_URL);

    const response = await client.sendMessage({
      message: {
        messageId: crypto.randomUUID(),
        role: "user",
        kind: "message",
        parts: [{ kind: "text", text: topic }],
      },
    });

    res.json({ status: "sent", response });
  } catch (err) {
    console.error("❌ Error starting workflow:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () =>
  console.log(`Gateway running on http://localhost:${PORT}`)
);
