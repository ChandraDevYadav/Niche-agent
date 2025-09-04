import React, { useState } from "react";
import { startWorkflow } from "../api";

function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState("");

  const handleStart = async () => {
    setStatus("Starting workflow...");
    setLogs([]);

    const topic = "AI Consulting"; // Example topic
    const result = await startWorkflow(topic);

    if (result.success) {
      setStatus("Workflow started successfully!");
      setLogs((prev) => [...prev, JSON.stringify(result.data, null, 2)]);
    } else {
      setStatus("Failed to start workflow.");
      setLogs((prev) => [...prev, `Error: ${result.error}`]);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center gap-3">
        <div className="bg-white/60 p-6 rounded shadow-md w-full">
          <h1 className="text-xl font-semibold mb-2">
            Find your Consulting Niche Agent
          </h1>
          <p className="text-[16px] text-gray-700 font-medium mb-4">
            The Find your Consulting Niche Agent is a smart tool designed to
            help you identify the ideal consulting practice based on your
            expertise, interests, and professional goals.
          </p>
          <button
            onClick={handleStart}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Connect
          </button>
        </div>
        <div className="bg-white/60 p-6 rounded shadow-md w-full">
          <h1 className="text-xl font-semibold mb-2">
            Find your Speaker Identity Agent
          </h1>
          <p className="text-[16px] text-gray-700 font-medium mb-4">
            The Find your Speaker identity Agent is a powerful tool to help you
            create a personalized speaking practice tailored to your expertise,
            passion, and professional goals.
          </p>
          <button
            onClick={handleStart}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Connect
          </button>
        </div>
        <div className="bg-white/60 p-6 rounded shadow-md w-full">
          <h1 className="text-xl font-semibold mb-2">Course Quiz Agent</h1>
          <p className="text-[16px] text-gray-700 font-medium mb-4">
            The Course Quiz Agent is an innovative tool designed to simplify
            quiz creation. Users can paste or upload transcripts, and the tool
            will automatically generate
          </p>
          <button
            onClick={handleStart}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Connect
          </button>
        </div>
      </div>
      <p className="mt-2 font-medium">{status}</p>
      <pre className="mt-4 bg-gray-100 p-4 rounded">{logs.join("\n")}</pre>
    </div>
  );
}

export default Dashboard;
