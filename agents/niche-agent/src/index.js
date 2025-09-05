// server.js
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
import { nicheAgentLogic } from "./nicheAgentLogic.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const taskStore = new InMemoryTaskStore();
const eventBus = new DefaultExecutionEventBus();
const eventBusManager = new DefaultExecutionEventBusManager(eventBus);
const resultManager = new ResultManager(taskStore, eventBusManager);

const requestHandler = new DefaultRequestHandler(async (request) => {
  const ctx = new RequestContext(request);
  const result = await nicheAgentLogic(request.params);
  return resultManager.createSuccessResult(ctx, result);
});

const transportHandler = new JsonRpcTransportHandler(requestHandler);

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
app.listen(PORT, () =>
  console.log(`🚀 Niche Agent running on http://localhost:${PORT}`)
);
