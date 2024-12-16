import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const client = new OpenAI({
  baseURL: 'https://api.studio.nebius.ai/v1/',
  apiKey: process.env.NEBIUS_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { companyName, destination, circuit, selectedLocations, arrivalMethod, duration } = await req.json()

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

    Please format the itinerary using Markdown for easy rendering.`

    const completion = await client.chat.completions.create({
      temperature: 0.6,
      max_tokens: 1250,
      top_p: 0.9,
      top_k: 50,
      model: 'meta-llama/Meta-Llama-3.1-70B-Instruct-fast',
      messages: [
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
  - Provide a detailed day-by-day breakdown of activities.
  - Include descriptions of each location.
  - Add information about wildlife, landscapes, and cultural experiences specific to the chosen destinations.
- Human-like Output: Use conversational and natural language to mimic human travel planners. Avoid robotic or overly generic responses.
- Formatting: Use Markdown for content to enable easy rendering on the app.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const generatedItinerary = completion.choices[0].message.content

    return NextResponse.json({ content: generatedItinerary })
  } catch (error) {
    console.error('Error generating safari itinerary:', error)
    return NextResponse.json({ error: 'Error generating safari itinerary' }, { status: 500 })
  }
}
