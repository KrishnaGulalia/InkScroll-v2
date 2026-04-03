const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;

const SYSTEM_PROMPT = `You are an expert manga/manhwa/manhua recommendation assistant for InkScroll. When the user describes what they want, respond with ONLY a valid JSON array of 5 search terms or titles that match their request. Format: ["title1", "title2", "title3", "title4", "title5"]
No explanation, no markdown, just the JSON array.`;

export async function askGemini(userPrompt) {
  const key = import.meta.env.VITE_GEMINI_KEY;
  if (!key || key === 'your_key_here') {
    throw new Error('Gemini API key not configured. Add VITE_GEMINI_KEY to your .env file.');
  }

  const res = await fetch(`${GEMINI_URL}?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 256,
      },
    }),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.error?.message || `Gemini error: ${res.status}`);
  }

  const json = await res.json();
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text || '';

  // Extract JSON array from response (handle possible markdown wrapping)
  const match = text.match(/\[[\s\S]*?\]/);
  if (!match) throw new Error('Unexpected Gemini response format');

  try {
    return JSON.parse(match[0]);
  } catch {
    throw new Error('Failed to parse Gemini response');
  }
}
