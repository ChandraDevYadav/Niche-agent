import React, { useState } from "react";
// eslint-disable-next-line
import { motion, AnimatePresence } from "framer-motion";
import { LuCopy } from "react-icons/lu";
import { FiDownload } from "react-icons/fi";

const BASE_API_URL = "http://localhost:3013";

export default function ConsultingNicheChat() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
    q6: "",
    q7: "",
  });
  const [loading, setLoading] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);

  const questions = [
    {
      id: "q1",
      section: "Platform & Expertise Development",
      question:
        "What specific problems or inefficiencies have you successfully solved in your career?",
      description:
        "Think about times when you identified bottlenecks and implemented solutions that improved processes or outcomes.",
    },
    {
      id: "q2",
      section: "Platform & Expertise Development",
      question:
        "What emerging technologies or trends are you most passionate about or experienced with?",
      description:
        "Consider AI, automation, digital transformation, remote work tools, or other modern business solutions.",
    },
    {
      id: "q3",
      section: "Platform & Expertise Development",
      question:
        "What type of clients or companies do you enjoy working with most?",
      description:
        "Think about company size, industry, culture, or specific challenges that energize you.",
    },
    {
      id: "q4",
      section: "Platform & Expertise Development",
      question: "What is your preferred way of delivering value to clients?",
      description:
        "Consider workshops, ongoing consulting, audits, implementation guidance, or strategic planning.",
    },
    {
      id: "q5",
      section: "Market Fit & Business Design",
      question:
        "What is your personal story or background that makes you unique in the consulting space?",
      description:
        "Share experiences, education, career transitions, or unique perspectives that set you apart.",
    },
    {
      id: "q6",
      section: "Market Fit & Business Design",
      question: "What are your financial goals for your consulting business?",
      description:
        "Consider revenue targets, pricing models, and the lifestyle you want to create.",
    },
    {
      id: "q7",
      section: "Market Fit & Business Design",
      question:
        "What are your biggest concerns or fears about starting a consulting business?",
      description:
        "Be honest about what worries you - this helps identify potential obstacles and solutions.",
    },
  ];

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = { text: inputMessage, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setLoading(true);

    try {
      const payload = {
        jsonrpc: "2.0",
        id: 1,
        method: "handleMessage",
        params: { topic: inputMessage },
      };

      const response = await fetch("http://localhost:3013/inbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();
      const botResponse = {
        text: data?.result?.recommendation || "No recommendation returned.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, botResponse]);

      // Set the analysis result for left panel
      if (data?.result?.recommendation) {
        setAnalysisResult(data.result.recommendation);
      }
      // eslint-disable-next-line
    } catch (_error) {
      const errorMessage = {
        text: "Sorry, I couldn't process your request. Please try again.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const topic = questions
        .map((q) => `${q.question} Answer: ${formData[q.id]}`)
        .join("\n");

      const payload = {
        jsonrpc: "2.0",
        id: 1,
        method: "handleMessage",
        params: { topic },
      };

      const response = await fetch("http://localhost:3013/inbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();
      const result =
        data?.result?.recommendation || "No recommendation returned.";

      // Set analysis result for left panel
      setAnalysisResult(result);
      setShowForm(false);

      // Add success message to chat
      const successMessage = {
        text: "Analysis complete! Check the left panel for your detailed niche recommendations.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, successMessage]);
      // eslint-disable-next-line
    } catch (_error) {
      const errorMessage = {
        text: "Failed to generate analysis. Please try again.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (questionId, value) => {
    setFormData((prev) => ({ ...prev, [questionId]: value }));
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus("Copied to clipboard!");
      setTimeout(() => setCopyStatus(""), 2000);
      // eslint-disable-next-line
    } catch (_err) {
      setCopyStatus("Failed to copy");
      setTimeout(() => setCopyStatus(""), 2000);
    }
  };

  const downloadAsText = (text, filename = "consulting-niche-analysis.txt") => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const startNicheAnalysis = () => {
    setShowForm(true);
    const welcomeMessage = {
      text: "Great! I'll help you discover your consulting niche. Please answer the following questions in the form below.",
      sender: "bot",
    };
    setMessages((prev) => [...prev, welcomeMessage]);
  };

  const clearAnalysis = () => {
    setAnalysisResult(null);
  };

  return (
    <motion.div
      className="min-h-[97%] flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      {/* <motion.div
        className="bg-white/80 backdrop-blur-sm shadow-soft rounded-xl p-6 mx-6 my-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
      >
        <motion.h1
          className="text-3xl font-bold text-primary-900 mb-2 text-start"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <span className="text-gray-700">Consulting Niche Discovery</span>
        </motion.h1>
        <motion.p
          className="text-gray-600 text-start"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Chat with the AI agent and get detailed niche analysis results
        </motion.p>
      </motion.div> */}

      {/* Main Content - Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 p-6 gap-4 overflow-hidden">
        {/* Left Panel - Analysis Results */}
        <motion.div
          className="col-span-5 lg:col-span-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-strong p-6 flex flex-col h-[500px]"
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
        >
          <div className="flex justify-between items-center mb-6">
            <motion.h2
              className="text-2xl font-bold text-gray-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Analysis Results
            </motion.h2>
            {analysisResult && (
              <motion.button
                onClick={clearAnalysis}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm transition-all duration-200 hover:shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Clear
              </motion.button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {analysisResult ? (
              <motion.div
                key="results"
                className="flex-1 overflow-y-auto no-scrollbar"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="flex justify-end space-x-4 py-4 border-b pl-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <motion.button
                    onClick={() => copyToClipboard(analysisResult)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-primary-700 flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <LuCopy />
                    Copy
                  </motion.button>
                  <motion.button
                    onClick={() => downloadAsText(analysisResult)}
                    className="px-4 py-2 bg-accent-600 text-gray-700 bg-white/80 rounded-md hover:bg-accent-700 flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiDownload />
                    Download
                  </motion.button>
                </motion.div>
                <div className="prose max-w-none text-gray-700">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: analysisResult
                        .replace(/\n/g, "<br>")
                        .replace(
                          /#{1,6}\s+(.+)/g,
                          "<h3 class='text-lg font-semibold text-gray-700 mt-6 mb-3'>$1</h3>"
                        )
                        .replace(
                          /\*\*(.+?)\*\*/g,
                          "<strong class='font-semibold text-gray-700'>$1</strong>"
                        ),
                    }}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty-state"
                className="flex-1 flex items-center justify-center text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="text-center"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <motion.div
                    className="text-6xl mb-4"
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 3,
                      ease: "easeInOut",
                    }}
                  >
                    📊
                  </motion.div>
                  <motion.p
                    className="text-lg text-gray-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Your analysis results will appear here
                  </motion.p>
                  <motion.p
                    className="text-sm mt-2 text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    Start a chat or use the form to generate insights
                  </motion.p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Right Panel - Chat Interface */}
        <motion.div
          className="col-span-5 lg:col-span-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-strong p-6 flex flex-col h-[500px]"
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
        >
          {/* Messages Area */}
          <motion.div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`max-w-xs lg:max-w-md rounded-lg p-4 shadow-md ${
                    message.sender === "user"
                      ? "shadow-primary-200/40"
                      : "shadow-gray-200/60"
                  } ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-primary-600 to-primary-500 text-white"
                      : "bg-gradient-to-r from-gray-50 to-white text-gray-800"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </motion.div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <motion.div
                  className="bg-gradient-to-r from-gray-50 to-white text-gray-800 rounded-lg p-4 shadow-md"
                  animate={{
                    opacity: [0.7, 1, 0.7],
                    scale: [0.98, 1, 0.98],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut",
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>

          {/* Consulting Niche Agent Button */}
          {!showForm && (
            <motion.div
              className="flex justify-start mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                onClick={startNicheAnalysis}
                className="p-1.5 px-3 text-sm text-gray-700 border border-primary-300 rounded-full font-semibold bg-gradient-to-r from-primary-50 to-white hover:shadow-md transition-all duration-300 hover:border-primary-400"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ✨ Consulting Niche Agent
              </motion.button>
            </motion.div>
          )}

          {/* Form or Input Area */}
          {showForm ? (
            <motion.div
              className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-inner-soft border border-gray-100"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.h3
                className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2"
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <span className="animate-pulse">💡</span>Complete the form for
                detailed analysis:
              </motion.h3>
              <div className="max-h-64 overflow-y-auto pr-2">
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {questions.map((q, index) => (
                    <div key={q.id} className="mb-4 ml-2">
                      <motion.label
                        className="block text-sm font-medium text-gray-700 mb-2"
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {index + 1}. {q.question}
                      </motion.label>
                      <motion.p
                        className="text-xs text-gray-500 mb-2 italic"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.8 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                      >
                        {q.description}
                      </motion.p>
                      <motion.textarea
                        value={formData[q.id]}
                        onChange={(e) =>
                          handleInputChange(q.id, e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-200 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm shadow-inner-soft bg-white transition-all duration-200 hover:border-primary-300"
                        rows="2"
                        placeholder="Type your answer here..."
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                        whileFocus={{
                          scale: 1.01,
                          boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
                        }}
                      />
                    </div>
                  ))}
                </form>
              </div>
              <div className="flex space-x-4 pt-4">
                <motion.button
                  onClick={handleFormSubmit}
                  disabled={loading}
                  className="relative flex items-center justify-center gap-2 px-6 py-2
             text-white rounded-md disabled:opacity-50 text-sm
             shadow-md transition-all duration-300
             bg-gradient-to-r from-yellow-400 to-pink-500
             hover:bg-gradient-to-b hover:from-red-500 hover:to-green-500"
                  whileHover={{ scale: loading ? 1 : 1.03 }}
                  whileTap={{ scale: loading ? 1 : 0.97 }}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      {/* Loader */}
                      <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin border-white"></div>
                      <span>Analyzing...</span>
                    </div>
                  ) : (
                    "Generate Analysis"
                  )}
                </motion.button>

                <motion.button
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm transition-all duration-200"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleSendMessage}
              className="flex space-x-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <motion.input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 px-4 py-2 cursor-not-allowed border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-gray-50 shadow-inner-soft"
                disabled
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              />
              <motion.button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                className="px-6 py-2 bg-gray-700 to-primary-500 text-white rounded-lg hover:from-primary-700 hover:to-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-md hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Send
              </motion.button>
            </motion.form>
          )}

          {/* Copy Status */}
          {copyStatus && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mt-2 p-2 rounded text-center text-sm shadow-md ${
                copyStatus.includes("Failed")
                  ? "bg-red-100 text-red-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {copyStatus}
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
