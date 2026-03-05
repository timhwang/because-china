import { readFileSync } from "fs";
import Anthropic from "@anthropic-ai/sdk";
import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { generateJustification } from "./api/_shared.js";

// Load .env file for local dev
try {
  const envFile = readFileSync(join(dirname(fileURLToPath(import.meta.url)), ".env"), "utf8");
  for (const line of envFile.split("\n")) {
    const [key, ...vals] = line.split("=");
    if (key && vals.length) process.env[key.trim()] = vals.join("=").trim();
  }
} catch {}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

app.post("/api/generate", async (req, res) => {
  const { input } = req.body;
  if (!input) {
    return res.status(400).json({ error: "Missing input" });
  }

  try {
    const client = new Anthropic();
    const result = await generateJustification(client, input);
    res.json(result);
  } catch (error) {
    console.error("Claude API error:", error);
    res.status(500).json({ error: "Failed to generate justification. Check your ANTHROPIC_API_KEY." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
