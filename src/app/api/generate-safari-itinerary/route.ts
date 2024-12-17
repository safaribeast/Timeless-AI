import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const MAX_RETRIES = 3;
const TIMEOUT = 60000; // 60 seconds

const client = new OpenAI({
  baseURL: 'https://api.studio.nebius.ai/v1/',
  apiKey: process.env.NEBIUS_API_KEY,
  timeout: TIMEOUT,
});

async function generateWithRetry(messages: any[], retries = MAX_RETRIES) {
  try {
    const completion = await client.chat.completions.create({
      temperature: 0.7,
      max_tokens: 1250,
      top_p: 0.9,
      model: 'meta-llama/Meta-Llama-3.1-70B-Instruct-fast',
      messages,
    });

    if (!completion.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from API');
    }

    return completion.choices[0].message.content;
  } catch (error: any) {
    if (retries > 0) {
      // Wait for 1 second before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
      return generateWithRetry(messages, retries - 1);
    }
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.NEBIUS_API_KEY) {
      return NextResponse.json(
        { error: 'API key is not configured' },
        { status: 500 }
      );
    }

    const { companyName, destination, circuit, selectedLocations, arrivalMethod, duration } = await req.json();

    if (!companyName || !destination || !selectedLocations) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const prompt = `Generate a detailed safari itinerary for ${companyName} with the following details:
    Destination: ${destination}
    Circuit: ${circuit}
    Locations: ${selectedLocations.join(', ')}
    Arrival Method: ${arrivalMethod}
    Duration: ${duration} days

    The itinerary should include:
    1. An overview of the entire trip
    2. Day-by-day breakdown of activities
    3. Descriptions of each location
    4. Customized content based on the selected destination (e.g., mentions of the Big Five for Tanzania)
    5. Additional information such as best time to visit, recommended gear, health precautions, and visa requirements

    Please format the itinerary using Markdown for easy rendering.`;

    const messages = [
      {
        role: 'system',
        content: `You are an advanced AI assistant specialized in creating detailed and engaging safari itineraries for East Africa. Your primary objectives are to:

1. Generate human-like, engaging, and SEO-friendly safari itineraries tailored to user inputs.
2. Ensure all generated content scores 85 marks or higher in Rank Math SEO.
3. Provide content that is specific to the selected destinations, circuits, and locations.
4. Create detailed day-by-day plans based on the duration specified by the user.

Guidelines:
- Tone and Style: Use a friendly and inviting tone to make the safari plans appealing and exciting.
- SEO Optimization:
  - Incorporate relevant keywords naturally.
  - Ensure appropriate use of headings, subheadings, and bullet points where applicable.
  - Avoid keyword stuffing; maintain readability.
- Content Structure:
  - Include an overview of the entire trip.
  - Provide detailed day-by-day breakdowns.
  - Add relevant travel tips and recommendations.
  - Format output in Markdown for easy rendering.`
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const content = await generateWithRetry(messages);
    
    return NextResponse.json({ content });
  } catch (error: any) {
    console.error('Error generating safari itinerary:', error);
    return NextResponse.json(
      { error: 'Failed to generate safari itinerary. Please try again.' },
      { status: 500 }
    );
  }
}
