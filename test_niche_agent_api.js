// Test script to demonstrate sending data to the niche-agent server
const axios = require('axios');

const BASE_API_URL = "http://localhost:5000"; // Backend URL

// Sample form data that would be collected from the frontend
const sampleFormData = [
  {
    questionId: "q1",
    category: "Platform & Expertise Development",
    question: "What specific problems or inefficiencies have you successfully solved in your career?",
    answer: "I've helped companies streamline their customer service processes by implementing automated ticketing systems, reducing response times by 60% and improving customer satisfaction scores."
  },
  {
    questionId: "q2",
    category: "Platform & Expertise Development",
    question: "What emerging technologies or trends are you most passionate about or experienced with?",
    answer: "I'm deeply experienced with AI and automation tools, particularly in the context of business process optimization and digital transformation initiatives."
  },
  {
    questionId: "q3",
    category: "Platform & Expertise Development",
    question: "What type of clients or companies do you enjoy working with most?",
    answer: "I thrive working with mid-sized companies that are ready to modernize but need guidance on how to implement changes without disrupting their operations."
  },
  {
    questionId: "q4",
    category: "Platform & Expertise Development",
    question: "What is your preferred way of delivering value to clients?",
    answer: "I prefer a combination approach - starting with comprehensive audits to identify opportunities, then providing ongoing implementation guidance and workshops for cultural transformation."
  },
  {
    questionId: "q5",
    category: "Market Fit & Business Design",
    question: "What is your personal story or background that makes you unique in the consulting space?",
    answer: "I transitioned from a traditional corporate role to consulting after successfully leading digital transformation initiatives that saved my company millions while improving employee satisfaction."
  },
  {
    questionId: "q6",
    category: "Market Fit & Business Design",
    question: "What are your financial goals for your consulting business?",
    answer: "I aim to build a sustainable consulting practice that generates $200K+ annually through a mix of project work, retainers, and workshops."
  },
  {
    questionId: "q7",
    category: "Market Fit & Business Design",
    question: "What are your biggest concerns or fears about starting a consulting business?",
    answer: "My main concern is finding the right balance between helping clients achieve results while maintaining my own work-life balance and avoiding burnout."
  }
];

async function testNicheAgentAPI() {
  console.log("🚀 Testing Niche Agent API Integration...\n");

  try {
    console.log("📤 Sending form data to backend...");
    console.log("Form data:", JSON.stringify(sampleFormData, null, 2));
    console.log("");

    // Send the request to the backend
    const response = await axios.post(`${BASE_API_URL}/niche`, {
      formData: sampleFormData,
      selectedAssets: [], // Optional: Add selected assets if needed
      email: "test@example.com"
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    console.log("✅ Success! Received response from niche agent:");
    console.log("Status:", response.data.status);
    console.log("");

    // Extract and display the recommendation
    const recommendation = response.data.response.result.recommendation;
    console.log("📋 Generated Niche Recommendations:");
    console.log("=" .repeat(80));
    console.log(recommendation);
    console.log("=" .repeat(80));

  } catch (error) {
    console.error("❌ Error testing niche agent API:");
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received. Make sure the backend server is running on port 5000");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error:", error.message);
    }
  }
}

// Function to test the complete flow
async function testCompleteFlow() {
  console.log("🧪 Testing Complete Niche Agent Flow\n");
  
  // Step 1: Test if backend is running
  try {
    await axios.get(`${BASE_API_URL}/health`);
    console.log("✅ Backend server is running");
  } catch (error) {
    console.log("❌ Backend server is not running. Please start it first:");
    console.log("   cd backend && npm start");
    return;
  }

  // Step 2: Test if niche agent is running
  try {
    await axios.get("http://localhost:3013/.well-known/agent-card.json");
    console.log("✅ Niche agent is running");
  } catch (error) {
    console.log("❌ Niche agent is not running. Please start it first:");
    console.log("   cd agents/niche-agent && npm start");
    return;
  }

  // Step 3: Test the API call
  await testNicheAgentAPI();
}

// Run the test
if (require.main === module) {
  testCompleteFlow();
}

module.exports = {
  testNicheAgentAPI,
  testCompleteFlow,
  sampleFormData
};
