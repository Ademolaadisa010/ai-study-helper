import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "API key not configured. Add GEMINI_API_KEY to .env.local" },
      { status: 500 }
    );
  }

  // 2. Parse and validate request body
  let prompt: string;
  try {
    const body = await req.json();
    prompt = body.prompt;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
    return NextResponse.json(
      { error: "Prompt is required" },
      { status: 400 }
    );
  }

  if (prompt.length > 20000) {
    return NextResponse.json(
      { error: "Notes are too long. Please shorten them and try again." },
      { status: 400 }
    );
  }

  // 3. Call Gemini API
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,      // balanced creativity
            maxOutputTokens: 1024, // enough for summaries + questions
          },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT",        threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_HATE_SPEECH",       threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          ],
        }),
      }
    );

    // 4. Handle Gemini API errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData?.error?.message || "Gemini API error";

      // Give friendly messages for common errors
      if (response.status === 400) {
        return NextResponse.json(
          { error: "Your notes could not be processed. Try shortening them." },
          { status: 400 }
        );
      }
      if (response.status === 403) {
        return NextResponse.json(
          { error: "Invalid API key. Check your GEMINI_API_KEY in .env.local" },
          { status: 403 }
        );
      }
      if (response.status === 429) {
        return NextResponse.json(
          { error: "Too many requests. Please wait a moment and try again." },
          { status: 429 }
        );
      }

      console.error("Gemini API error:", message);
      return NextResponse.json({ error: message }, { status: 502 });
    }

    // 5. Parse response
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    // Check if Gemini blocked the response
    if (!text) {
      const blockReason = data.candidates?.[0]?.finishReason;
      if (blockReason === "SAFETY") {
        return NextResponse.json(
          { error: "The AI couldn't process this content. Try different notes." },
          { status: 422 }
        );
      }
      return NextResponse.json(
        { error: "No response from AI. Please try again." },
        { status: 502 }
      );
    }

    // 6. Return in the same shape the frontend expects
    return NextResponse.json({
      content: [{ text }],
    });

  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}