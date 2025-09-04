import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import {
  DefaultRequestHandler,
  JsonRpcTransportHandler,
  InMemoryTaskStore,
  DefaultExecutionEventBus,
  DefaultExecutionEventBusManager,
  ResultManager,
  RequestContext,
} from "@a2a-js/sdk/server";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve agent card
app.get("/.well-known/agent-card.json", (req, res) => {
  const cardPath = path.join(process.cwd(), ".well-known", "agent-card.json");
  const card = fs.readFileSync(cardPath, "utf-8");
  res.type("json").send(card);
});

// Core Agent Setup
const taskStore = new InMemoryTaskStore();
const eventBus = new DefaultExecutionEventBus();
const eventBusManager = new DefaultExecutionEventBusManager(eventBus);
const resultManager = new ResultManager(taskStore, eventBusManager);

// Use your existing quiz logic here
async function quizAgentLogic(input) {
  console.log("👉 Quiz Agent received input:", input);

  // Example simple passthrough
  if (input.topic?.toLowerCase().includes("math")) {
    return { quiz: "What is 2 + 2?" };
  }
  return { quiz: "Default quiz question from quiz-agent" };
}

// Request handler
const requestHandler = new DefaultRequestHandler(async (request) => {
  const ctx = new RequestContext(request);
  const result = await quizAgentLogic(request.params);
  return resultManager.createSuccessResult(ctx, result);
});

// Transport handler for JSON-RPC
const transportHandler = new JsonRpcTransportHandler(requestHandler);

// Inbox endpoint for gateway messages
app.post("/message/send", async (req, res) => {
  try {
    const result = await transportHandler.handle(req.body);
    res.json(result);
  } catch (err) {
    console.error("❌ Error handling request:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 6070;
app.listen(PORT, () => {
  console.log(`🚀 Quiz Agent running on http://localhost:${PORT}`);
});
