import Anthropic from "@anthropic-ai/sdk";
import { generateJustification } from "./_shared.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { input } = req.body;
  if (!input) {
    return res.status(400).json({ error: "Missing input" });
  }

  try {
    const client = new Anthropic();
    const justification = await generateJustification(client, input);
    res.json({ justification });
  } catch (error) {
    console.error("Claude API error:", error);
    res.status(500).json({ error: "Failed to generate justification." });
  }
}
