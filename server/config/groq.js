// config/groq.js
module.exports = {
  GROQ_MODEL: process.env.GROQ_MODEL || "llama3-8b-8192",
  TEMPERATURE: process.env.GROQ_TEMPERATURE ? parseFloat(process.env.GROQ_TEMPERATURE) : 0.5,
  MAX_TOKENS: process.env.GROQ_MAX_TOKENS ? parseInt(process.env.GROQ_MAX_TOKENS) : 2048,
  LLM_MODEL: process.env.GROQ_MODEL || "llama3-8b-8192"
};
