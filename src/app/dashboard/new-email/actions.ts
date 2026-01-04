"use server";

import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateEmailAction(formData: FormData) {
  const userRole = formData.get("userRole") as string;
  const recipientRole = formData.get("recipientRole") as string;
  const tone = formData.get("tone") as string;
  const details = formData.get("details") as string;

  if (!details) return null;

  const prompt = `Write an email from a ${userRole} to a ${recipientRole}. 
  The tone should be ${tone}. 
  The email must address the following details: ${details}.
  Return only the email body text.`;

  try {
    const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
    });

    return completion.choices[0].message.content;
  } catch (e) {
    console.error(e);
    return "Error generating email. Please check your API Key.";
  }
}