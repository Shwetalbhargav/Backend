const express = require("express");
const cors = require("cors");

const app = express();

// Configure CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

// API endpoint
app.post("/api/download-image", async (req, res) => {
  try {
    const fetch = (await import("node-fetch")).default; // Dynamic import for node-fetch
    const apiSecret = "your_api_secret_here"; // Replace with a secure method to fetch the API secret
    const apiUrl = "https://testd5-img.azurewebsites.net/api/imgdownload";

    // Fetch data from external API
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ api: apiSecret }),
    });

    // Capture and log response details
    const responseText = await response.text();
    if (!response.ok) {
      console.error(`External API Error: ${response.status} ${response.statusText}`);
      console.error(`Error Details: ${responseText}`);
      throw new Error(`External API error: ${response.status} ${response.statusText}`);
    }

    // Parse JSON response
    const data = JSON.parse(responseText);

    if (!data.image) {
      throw new Error("No image data received from external API.");
    }

    // Send the response back to the frontend
    res.json(data);
  } catch (error) {
    console.error("Error in /api/download-image:", error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
