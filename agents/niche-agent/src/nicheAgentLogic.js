export async function nicheAgentLogic(input) {
  // Extract user message text
  const text =
    input?.message?.parts
      ?.map((p) => p.text)
      .join(" ")
      .toLowerCase() || "";
  console.log("👉 Extracted text:", text);

  // Prepare default niches
  const niches = [];

  // Niche 1: Digital Transformation
  if (
    text.includes("technology") ||
    text.includes("digital") ||
    text.includes("automation")
  ) {
    niches.push({
      name: "Digital Transformation & Efficiency Consulting",
      why: "You have deep expertise in technology and operations.",
      problemsSolved: ["Outdated systems", "Operational bottlenecks"],
      audienceFit: "Companies seeking digital transformation",
      positioning: "Transformation catalyst integrating tech + culture",
      monetization: ["Digital audits", "Workshops", "Retainers"],
      transformationPitch:
        "Transform operations from outdated to outstanding through modern tech and efficiency.",
      uniqueDifferentiator:
        "Blend of technology & human-centered change management",
      marketDemand: "High and growing due to ongoing digital disruption",
      caveats: "Resistance from traditional leadership, long sales cycles",
      validationPlan: [
        "Identify 10 potential companies",
        "Offer free initial digital audits",
        "Provide consultation session for tailored transformation plan",
      ],
    });
  }

  // Niche 2: Financial Strategy
  if (
    text.includes("finance") ||
    text.includes("money") ||
    text.includes("cash flow")
  ) {
    niches.push({
      name: "Financial Strategy & Compliance Consulting",
      why: "Strong background in finance and risk management.",
      problemsSolved: ["Regulatory compliance", "Cash flow optimization"],
      audienceFit: "Businesses needing financial guidance",
      positioning: "Financial strategist and compliance expert",
      monetization: [
        "Compliance audits",
        "Financial strategy sessions",
        "Retainers",
      ],
      transformationPitch:
        "Optimize finances and ensure compliance to drive growth.",
      uniqueDifferentiator:
        "Combination of financial expertise and strategic planning",
      marketDemand: "Increasing need due to complex regulations",
      caveats: "Market crowded with finance consultants",
      validationPlan: [
        "Analyze 5 target companies' financials",
        "Offer free financial strategy consultation",
        "Propose customized financial optimization plan",
      ],
    });
  }

  // Default fallback
  if (niches.length === 0) {
    niches.push({
      name: "General Entrepreneurship & Startup Course",
      why: "No strong keywords detected, general consulting advice provided.",
      problemsSolved: ["Startup strategy", "Business planning"],
      audienceFit: "Entrepreneurs & startups",
      positioning: "General startup advisor",
      monetization: ["Workshops", "Online course", "Consulting sessions"],
      transformationPitch:
        "Get actionable insights to launch or grow your startup.",
      uniqueDifferentiator: "Flexible guidance for early-stage founders",
      marketDemand: "General demand for entrepreneurship guidance",
      caveats: "Less tailored without specific expertise input",
      validationPlan: [
        "Survey audience about startup challenges",
        "Offer initial consultation",
        "Develop tailored strategy based on feedback",
      ],
    });
  }

  // Build Markdown report
  const markdown = niches
    .map(
      (n, i) => `
# 💼 Niche ${i + 1}: ${n.name}

## 🔗 Why This Niche Fits Me
${n.why}

## 🎯 Who I Help
${n.audienceFit}

## 🧩 Problems I Solve
${n.problemsSolved.join(", ")}

## 🧠 Positioning Angle
${n.positioning}

## 📦 Delivery & Monetization Models
${n.monetization.map((m) => `- ${m}`).join("\n")}

## 💬 Transformation Pitch
${n.transformationPitch}

## 🌟 Unique Differentiator
${n.uniqueDifferentiator}

## 📈 Market Demand & Timing
${n.marketDemand || "High demand in current market"}

## ⚠️ Caveats & Considerations
${n.caveats || "None"}

## ✅ 7-Day Niche Validation Plan
${n.validationPlan
  .map((s) => `Step ${n.validationPlan.indexOf(s) + 1}: ${s}`)
  .join("\n")}
`
    )
    .join("\n---\n");

  return { recommendation: markdown };
}
