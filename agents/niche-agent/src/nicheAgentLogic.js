export async function nicheAgentLogic(input) {
  console.log("👉 Received in Niche Agent:", input);

  if (input.expertise?.toLowerCase().includes("technology")) {
    return {
      recommendation: "Digital Transformation & Efficiency Consulting",
      why: "You have deep expertise in technology and operations.",
      problemsSolved: ["Outdated systems", "Operational bottlenecks"],
      audienceFit: input.audience,
    };
  }

  if (input.expertise?.toLowerCase().includes("finance")) {
    return {
      recommendation: "Financial Strategy & Compliance Consulting",
      why: "Strong background in finance and risk management.",
      problemsSolved: ["Regulatory compliance", "Cash flow optimization"],
      audienceFit: input.audience,
    };
  }

  return {
    recommendation: "General Consulting Strategy",
    note: "Please refine your inputs for a more tailored niche.",
  };
}
