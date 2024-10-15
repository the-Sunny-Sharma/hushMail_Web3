import { NextResponse } from "next/server";

const googleApiKey = process.env.GEMINI_API_KEY;

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { postContent, userResponse } = await req.json();
    const prompt = `
      Given the following post content and user's initial response, generate a thoughtful and engaging continuation or improvement to the user's response. The generated content should:
      1. Be relevant to the original post
      2. Expand on or refine the user's initial thoughts
      3. Be suitable for a diverse audience
      4. Avoid personal or sensitive topics
      5. Contribute to a positive and constructive conversation
      6. Be concise, ideally not exceeding 2-3 sentences

      Original post: "${postContent}"
      User's initial response: "${userResponse}"

      Generated continuation or improvement:
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
