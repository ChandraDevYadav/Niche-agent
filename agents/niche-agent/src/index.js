import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import {
  DefaultRequestHandler,
  JsonRpcTransportHandler,
  InMemoryTaskStore,
  DefaultExecutionEventBus,
  DefaultExecutionEventBusManager,
  ResultManager,
  RequestContext,
} from "@a2a-js/sdk/server";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve agent card
app.get("/.well-known/agent-card.json", (req, res) => {
  const cardPath = path.join(__dirname, ".well-known", "agent-card.json");
  const card = fs.readFileSync(cardPath, "utf-8");
  res.type("json").send(card);
});

// === Core Agent Setup ===
const taskStore = new InMemoryTaskStore();
const eventBus = new DefaultExecutionEventBus();
const eventBusManager = new DefaultExecutionEventBusManager(eventBus);
const resultManager = new ResultManager(taskStore, eventBusManager);

// Custom agent logic
async function nicheAgentLogic(input) {
  console.log("👉 Niche Agent received input:", input);
  if (input.topic?.toLowerCase().includes("linux")) {
    return {
      recommendation: "Linux Foundation Certified System Administrator Course",
    };
  } else if (input.topic?.toLowerCase().includes("cloud")) {
    return { recommendation: "Cloud Native Kubernetes Fundamentals" };
  }
  return { recommendation: "Consulting Niche Agent Connected successfully!" };
}

// Request handler
const requestHandler = new DefaultRequestHandler(async (request) => {
  const ctx = new RequestContext(request);
  const result = await nicheAgentLogic(request.params);
  return resultManager.createSuccessResult(ctx, result);
});

// Transport handler for JSON-RPC
const transportHandler = new JsonRpcTransportHandler(requestHandler);

// **Inbox endpoint** for gateway messages
app.post("/message/send", async (req, res) => {
  try {
    const result = await transportHandler.handle(req.body);
    res.json(result);
  } catch (err) {
    console.error("❌ Error handling request:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3014;
app.listen(PORT, () => {
  console.log(`🚀 Niche Agent running on http://localhost:${PORT}`);
});
