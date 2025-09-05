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
      <button
        onClick={handleStart}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Start Workflow
      </button>
      <p className="mt-2 font-medium">{status}</p>
      <pre className="mt-4 bg-gray-100 p-4 rounded">{logs.join("\n")}</pre>
    </div>
  );
}

export default Dashboard;
