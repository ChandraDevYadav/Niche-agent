const BASE_URL = "http://localhost:5000";

export async function startWorkflow(topic, retries = 3, delayMs = 2000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`${BASE_URL}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Gateway responded with status ${response.status}: ${errorText}`
        );
      }

      const data = await response.json();
      return { success: true, data };
    } catch (err) {
      console.error(`Attempt ${attempt} failed: ${err.message}`);
      if (attempt < retries) {
        await new Promise((res) => setTimeout(res, delayMs));
      } else {
        return { success: false, error: err.message };
      }
    }
  }
}
