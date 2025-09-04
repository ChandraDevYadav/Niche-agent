# How to Send Data to Niche-Agent Server

This guide explains how to send form data to the niche-agent server to generate comprehensive consulting niche recommendations like the Consulting Niche Agent.

## Architecture Overview

The system consists of three main components:

1. **Frontend** - Collects user form data and sends it to the backend
2. **Backend** - Processes the request and forwards it to the niche-agent
3. **Niche Agent** - Generates the actual niche recommendations

## Data Flow

```
Frontend Form → Backend API → Niche Agent → Backend → Frontend Display
```

## 1. Frontend Implementation

### Form Data Structure

The frontend collects form data in this structure:

```javascript
const formData = {
  "q1": "User's answer to question 1",
  "q2": "User's answer to question 2",
  // ... more questions
};
```

### Sending Data to Backend

```javascript
import axios from "axios";

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    // Prepare the form data in the format expected by the backend
    const qaPairs = questions.map(q => ({
      questionId: q.id,
      category: q.section,
      question: q.question,
      answer: formData[q.id]?.trim() || ""
    }));

    // Send data to the backend
    const response = await axios.post(`${BASE_API_URL}/niche`, {
      formData: qaPairs,
      selectedAssets: [], // Optional: Add selected assets if needed
      email: "user@example.com" // Replace with actual user email
    }, {
      headers: {
        "Content-Type": "application/json",
        // Add authentication headers if needed
        // "Authorization": `Bearer ${token}`
      }
    });

    // Extract the recommendation from the response
    const recommendation = response.data.response.result.recommendation;
    setResult(recommendation);

  } catch (err) {
    console.error("Error generating niche recommendation:", err);
    setError(err.response?.data?.error || "Failed to generate niche recommendation");
  } finally {
    setLoading(false);
  }
};
```

## 2. Backend API Endpoint

### Request Format

The backend expects a POST request to `/niche` with this structure:

```javascript
{
  "formData": [
    {
      "questionId": "q1",
      "category": "Platform & Expertise Development",
      "question": "What specific problems or inefficiencies have you successfully solved in your career?",
      "answer": "User's response here..."
    },
    // ... more question-answer pairs
  ],
  "selectedAssets": [], // Optional: Array of selected assets
  "email": "user@example.com"
}
```

### Backend Controller

```javascript
// backend/controllers/NicheController.js
export const generateNicheResult = async (req, res) => {
  const { formData, selectedAssets } = req.body;
  const email = req.user.email;
  const userId = req.user.id;

  let previewText = "";
  if (selectedAssets?.length) {
    previewText = selectedAssets
      .map((a) => `${a.category}: ${a.content}`)
      .join(" and ");
  }

  try {
    // Send request to niche agent
    const a2aResponse = await a2aClient.send({
      jsonrpc: "2.0",
      method: "generateNiche",
      params: { formData, previewText, userEmail: email },
      id: 1,
    });

    const recommendation = a2aResponse?.result?.recommendation;

    // Save to database
    const updatedDoc = await FYCNiche.findOneAndUpdate(
      { userId },
      {
        email,
        userId,
        qaPairs: formData,
        gptResponse: recommendation,
        updatedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    res.json({
      status: "sent",
      response: { jsonrpc: "2.0", result: { recommendation }, id: 1 },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate niche recommendation" });
  }
};
```

## 3. Niche Agent Implementation

### Agent Setup

The niche agent runs on port 3013 and handles the `generateNiche` method:

```javascript
// agents/niche-agent/src/index.js
const requestHandler = new DefaultRequestHandler(async (request) => {
  const ctx = new RequestContext(request);
  
  // Handle the generateNiche method specifically
  if (request.method === "generateNiche") {
    const { formData, previewText, userEmail } = request.params;
    const result = await generateConsultingNiche(formData, previewText, userEmail);
    return resultManager.createSuccessResult(ctx, { recommendation: result });
  }
  
  // Fallback for other methods
  const result = await nicheAgentLogic(request.params);
  return resultManager.createSuccessResult(ctx, result);
});
```

### Niche Generation Logic

The agent generates comprehensive niche recommendations:

```javascript
async function generateConsultingNiche(formData, previewText, userEmail) {
  // Extract key information from form data
  const answers = {};
  if (formData && Array.isArray(formData)) {
    formData.forEach(qa => {
      if (qa.questionId && qa.answer) {
        answers[qa.questionId] = qa.answer;
      }
    });
  }

  // Generate comprehensive niche recommendations
  const niches = [
    {
      name: "Digital Transformation & Efficiency Consulting",
      fit: "Your experience with solving inefficiencies...",
      target: "Mid-sized companies in traditional industries...",
      // ... more niche details
    },
    // ... more niches
  ];

  // Generate markdown response
  let response = "";
  niches.forEach((niche, index) => {
    response += `# 💼 Niche ${index + 1}: ${niche.name}\n\n`;
    response += `## 🔗 Why This Niche Fits Me  \n${niche.fit}\n\n`;
    // ... more sections
  });

  return response;
}
```

## 4. Response Format

The niche agent returns a comprehensive markdown response that includes:

- **5 Detailed Niche Recommendations** with sections like:
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

## 5. Example Response

```markdown
# 💼 Niche 1: Digital Transformation & Efficiency Consulting

## 🔗 Why This Niche Fits Me  
Your experience with solving inefficiencies and bottlenecks aligns perfectly with businesses seeking digital transformation.

## 🎯 Who I Help  
Mid-sized companies in traditional industries that are looking to modernize their operations and improve efficiency.

## 🧩 Problems I Solve  
Inefficiencies in operations, outdated technology systems, and resistance to change within organizations.

## 🧠 Positioning Angle  
Position yourself as a transformation catalyst who not only implements technology but also fosters a culture of innovation and agility.

## 📦 Delivery & Monetization Models  
- Comprehensive digital audits
- Retainer-based implementation guidance
- Workshops for cultural transformation

## 💬 Transformation Pitch  
"Transform your business operations from outdated to outstanding, driving growth through modern technology and efficient processes."

## 🌟 Unique Differentiator  
Your ability to blend technology with human-centered change management.

## 📈 Market Demand & Timing  
With ongoing digital disruption, businesses are increasingly seeking expertise in digital transformation to stay competitive.

## ⚠️ Caveats & Considerations  
Potential resistance from traditional leadership and long sales cycles.

## 🧱 Long-Term Evolution  
Develop a scalable digital transformation framework that can be productized into a service offering.

## ✅ 7-Day Niche Validation Plan  
Step 1: Identify and reach out to 10 potential companies within your network.  
Step 2: Offer free initial digital audits to these companies.  
Step 3: Provide a consultation session to discuss audit results and propose a tailored digital transformation plan.

---

### 📊 Niche Comparison Matrix

| # | Niche Name | Revenue Potential | Alignment with Strengths | Sales Difficulty | Speed to Validate |
|---|------------|-------------------|---------------------------|------------------|-------------------|
| 1 | Digital Transformation & Efficiency Consulting | High | High | Medium | Medium |

### 🎯 Final Recommendation: "If I Were You"  
I recommend starting with **Niche 1: Digital Transformation & Efficiency Consulting**...
```

## 6. Running the System

### Start the Niche Agent
```bash
cd agents/niche-agent
npm install
npm start
# Agent runs on http://localhost:3013
```

### Start the Backend
```bash
cd backend
npm install
npm start
# Backend runs on http://localhost:5000
```

### Start the Frontend
```bash
cd frontend
npm install
npm start
# Frontend runs on http://localhost:3000
```

## 7. Testing the Integration

You can test the complete flow by:

1. Filling out the form in the frontend
2. Submitting the form data
3. Checking the backend logs for the request
4. Checking the niche agent logs for processing
5. Viewing the generated recommendation in the frontend

## 8. Customization

To customize the niche recommendations:

1. **Modify the niches array** in `agents/niche-agent/src/index.js`
2. **Add new question types** in the frontend form
3. **Update the response format** to include additional sections
4. **Add more sophisticated logic** based on user responses

## 9. Error Handling

The system includes comprehensive error handling:

- **Frontend**: Displays user-friendly error messages
- **Backend**: Returns structured error responses
- **Agent**: Logs detailed error information

## 10. Security Considerations

- Implement proper authentication for the backend API
- Validate all input data
- Use HTTPS in production
- Implement rate limiting
- Add request logging and monitoring
