import { NextResponse } from "next/server";

const googleApiKey = process.env.GEMINI_API_KEY;

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { content } = await req.json();
    const prompt = `
      Based on the following user input for a social messaging platform post, generate an engaging and thought-provoking continuation or response. The content should:
      1. Be suitable for a diverse audience
      2. Avoid personal or sensitive topics
      3. Focus on universal themes that encourage friendly interaction and curiosity
      4. Contribute to a positive and welcoming conversational environment
      5. Be relevant to the user's initial input
      6. Be concise, ideally not exceeding 2-3 sentences

      User input: "${content}"

      Generated continuation or response:
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${googleApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch from Google API: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text.trim();

    return NextResponse.json({ suggestion: generatedText });
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
