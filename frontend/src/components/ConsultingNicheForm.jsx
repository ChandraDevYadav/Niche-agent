import React, { useState } from "react";
import axios from "axios";

const BASE_API_URL = "http://localhost3013"; // Backend URL

export default function ConsultingNicheForm() {
  const [formData, setFormData] = useState({
    // Platform & Expertise Development
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    // Market Fit & Business Design
    q5: "",
    q6: "",
    q7: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sample questions based on the Consulting Niche Agent
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

  const handleInputChange = (questionId, value) => {
    setFormData((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare the form data in the format expected by the backend
      const qaPairs = questions.map((q) => ({
        questionId: q.id,
        category: q.section,
        question: q.question,
        answer: formData[q.id]?.trim() || "",
      }));

      // Send data to the backend
      const response = await axios.post(
        `${BASE_API_URL}/niche`,
        {
          formData: qaPairs,
          selectedAssets: [], // You can add selected assets here if needed
          email: "user@example.com", // Replace with actual user email
        },
        {
          headers: {
            "Content-Type": "application/json",
            // Add authentication headers if needed
            // "Authorization": `Bearer ${token}`
          },
        }
      );

      // Extract the recommendation from the response
      const recommendation = response.data.response.result.recommendation;
      setResult(recommendation);
    } catch (err) {
      console.error("Error generating niche recommendation:", err);
      setError(
        err.response?.data?.error || "Failed to generate niche recommendation"
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      q1: "",
      q2: "",
      q3: "",
      q4: "",
      q5: "",
      q6: "",
      q7: "",
    });
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Find Your Consulting Niche Agent
        </h1>

        <p className="text-gray-600 mb-8">
          Answer the questions below to generate a personalized consulting niche
          discovery. Your responses will be sent to the niche-agent server to
          generate comprehensive recommendations.
        </p>

        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Platform & Expertise Development Section */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h2 className="text-xl font-semibold text-blue-600 mb-4">
                Platform & Expertise Development
              </h2>
              <p className="text-gray-600 mb-4">
                Define how you serve clients, align with market trends, and
                position your consulting brand.
              </p>

              {questions.slice(0, 4).map((q) => (
                <div key={q.id} className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {q.question}
                  </label>
                  <p className="text-xs text-gray-500 mb-2 italic">
                    {q.description}
                  </p>
                  <textarea
                    value={formData[q.id]}
                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Share your thoughts here..."
                  />
                </div>
              ))}
            </div>

            {/* Market Fit & Business Design Section */}
            <div className="border-l-4 border-green-500 pl-4">
              <h2 className="text-xl font-semibold text-green-600 mb-4">
                Market Fit & Business Design
              </h2>
              <p className="text-gray-600 mb-4">
                Identify your ideal audience, speaking style, and personal
                story.
              </p>

              {questions.slice(4).map((q) => (
                <div key={q.id} className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {q.question}
                  </label>
                  <p className="text-xs text-gray-500 mb-2 italic">
                    {q.description}
                  </p>
                  <textarea
                    value={formData[q.id]}
                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows="3"
                    placeholder="Share your thoughts here..."
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Reset Form
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50"
              >
                {loading ? "Generating..." : "Generate Niche Strategy"}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Your Consulting Niche Discovery
              </h2>
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Start Over
              </button>
            </div>

            {error ? (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800">{error}</p>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6">
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: result
                      .replace(/\n/g, "<br>")
                      .replace(/#{1,6}\s+(.+)/g, "<h3>$1</h3>")
                      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"),
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
