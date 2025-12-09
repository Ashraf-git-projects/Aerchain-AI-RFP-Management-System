import OpenAI from "openai";

export const generateRfpFromText = async (description) => {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You are an expert procurement assistant. Always respond with a single JSON object only. Keys: title (string), requirements (array of strings), budget (number or null), deliveryTime (string or null), paymentTerms (string or null), warranty (string or null). Do not include any extra keys."
      },
      {
        role: "user",
        content: description
      }
    ]
  });

  const text = response.choices[0].message.content;
  return JSON.parse(text);
};
