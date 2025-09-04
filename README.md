# Niche Agent Integration Guide

This guide shows you how to send form data to the niche-agent server to generate comprehensive consulting niche recommendations like the Consulting Niche Agent.

## 🚀 Quick Start

### 1. Start the Services

```bash
# Start the Niche Agent (Port 3013)
cd agents/niche-agent
npm install
npm start

# Start the Backend (Port 5000)
cd backend
npm install
npm start

# Start the Frontend (Port 3000)
cd frontend
npm install
npm start
```

### 2. Test the Integration

```bash
# Run the test script
node test_niche_agent_api.js
```

## 📋 How It Works

### Data Flow

```
Frontend Form → Backend API → Niche Agent → Backend → Frontend Display
```

### 1. Frontend Collects Data

The frontend collects user responses to questions about their expertise, goals, and preferences.

### 2. Backend Processes Request

The backend receives the form data and forwards it to the niche agent using JSON-RPC.

### 3. Niche Agent Generates Recommendations

The niche agent analyzes the data and generates comprehensive consulting niche recommendations.

### 4. Response Displayed

The generated recommendations are returned to the frontend and displayed to the user.

## 🔧 API Integration

### Frontend Code Example

```javascript
import axios from "axios";

const handleSubmit = async (e) => {
  e.preventDefault();

  // Prepare form data
  const qaPairs = questions.map((q) => ({
    questionId: q.id,
    category: q.section,
    question: q.question,
    answer: formData[q.id]?.trim() || "",
  }));

  // Send to backend
  const response = await axios.post(`${BASE_API_URL}/niche`, {
    formData: qaPairs,
    selectedAssets: [],
    email: "user@example.com",
  });

  // Get recommendation
  const recommendation = response.data.response.result.recommendation;
  setResult(recommendation);
};
```

### Backend Endpoint

**POST** `/niche`

**Request Body:**

```json
{
  "formData": [
    {
      "questionId": "q1",
      "category": "Platform & Expertise Development",
      "question": "What specific problems or inefficiencies have you successfully solved in your career?",
      "answer": "User's response here..."
    }
  ],
  "selectedAssets": [],
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "status": "sent",
  "response": {
    "jsonrpc": "2.0",
    "result": {
      "recommendation": "# 💼 Niche 1: Digital Transformation & Efficiency Consulting..."
    },
    "id": 1
  }
}
```

## 📊 Generated Output

The niche agent generates comprehensive recommendations including:

- **5 Detailed Niche Recommendations** with sections:

  - Why This Niche Fits Me
  - Who I Help
  - Problems I Solve
  - Positioning Angle
  - Delivery & Monetization Models
  - Transformation Pitch
  - Unique Differentiator
  - Market Demand & Timing
  - Caveats & Considerations
  - Long-Term Evolution
  - 7-Day Niche Validation Plan

- **Comparison Matrix** comparing all niches
- **Final Recommendation** with specific guidance

## 🛠️ Customization

### Modify Niche Recommendations

Edit `agents/niche-agent/src/index.js` to customize the niche recommendations:

```javascript
const niches = [
  {
    name: "Your Custom Niche",
    fit: "Why this niche fits...",
    target: "Who you help...",
    // ... more properties
  },
];
```

### Add New Questions

Update the questions array in the frontend component:

```javascript
const questions = [
  {
    id: "q8",
    section: "New Section",
    question: "Your new question?",
    description: "Question description",
  },
];
```

## 🧪 Testing

### Manual Testing

1. Fill out the form in the frontend
2. Submit the form data
3. Check the generated recommendations

### Automated Testing

Run the test script:

```bash
node test_niche_agent_api.js
```

## 🔍 Troubleshooting

### Common Issues

1. **Backend not running**

   - Error: "No response received"
   - Solution: Start the backend server

2. **Niche agent not running**

   - Error: "Failed to generate niche recommendation"
   - Solution: Start the niche agent

3. **Port conflicts**
   - Error: "Address already in use"
   - Solution: Change ports in the configuration

### Debug Logs

Check the console output for:

- Backend: Request processing logs
- Niche Agent: Processing logs
- Frontend: Network request logs

## 📁 File Structure

```
niche-agent/
├── agents/niche-agent/
│   ├── src/index.js          # Niche agent implementation
│   └── .well-known/agent-card.json
├── backend/
│   ├── controllers/NicheController.js
│   └── routes/NicheRoute.js
├── frontend/
│   └── src/components/ConsultingNicheForm.jsx
├── test_niche_agent_api.js   # Test script
└── NICHE_AGENT_INTEGRATION_GUIDE.md
```

## 🚀 Production Deployment

### Environment Variables

Set these environment variables:

```bash
# Backend
CONSULTING_AGENT_URL=http://your-niche-agent-url:3013/a2a
MONGODB_URI=your-mongodb-connection-string

# Niche Agent
PORT=3013
```

### Security Considerations

- Implement proper authentication
- Use HTTPS in production
- Add rate limiting
- Validate all input data
- Add request logging

## 📞 Support

For issues or questions:

1. Check the troubleshooting section
2. Review the logs for error messages
3. Test with the provided test script
4. Verify all services are running

## 📚 Additional Resources

- [NICHE_AGENT_INTEGRATION_GUIDE.md](NICHE_AGENT_INTEGRATION_GUIDE.md) - Detailed technical guide
- [test_niche_agent_api.js](test_niche_agent_api.js) - API testing script
- [frontend/src/components/ConsultingNicheForm.jsx](frontend/src/components/ConsultingNicheForm.jsx) - Frontend implementation
