const express = require("express");
const path = require("path");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;
const HOST="0.0.0.0"

//app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// API route to get data from Flask
app.get("/get-data", async (req, res) => {
  try {
    const response = await axios.get("http://backend:5000/people");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Flask server not reachable" });
  }
});

app.listen(PORT, () => {
  console.log(`Express running at http://${HOST}:${PORT}`);
});
process.on("SIGINT", () => {
  console.log("Shutting down Express server...");
  process.exit(0);
});
