export async function getAIRecommendations(userPrompt) {
  try {
    const response = await fetch('https://api.cohere.com/v1/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_COHERE_KEY}`,
        'X-Client-Name': 'inkscroll'
      },
      body: JSON.stringify({
        model: 'command-a-03-2025',
        message: userPrompt,
        preamble: `You are an expert manga, manhwa, and manhua 
          recommendation assistant for InkScroll. 
          When the user describes what they want to read, 
          respond with ONLY a valid JSON array of 5 title 
          names that best match their request.
          Format: ["Title 1", "Title 2", "Title 3", "Title 4", "Title 5"]
          No explanation, no markdown, no backticks.
          Just the raw JSON array.
          Focus on well-known titles that exist on AniList.`,
      })
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('Cohere API error:', err);
      throw new Error('Cohere request failed');
    }

    const data = await response.json();
    const text = data.text;
    const clean = text.replace(/```json|```/g, '').trim();
    const titles = JSON.parse(clean);
    return titles;

  } catch (error) {
    console.error('AI error:', error);
    throw new Error('AI recommendations failed');
  }
}
