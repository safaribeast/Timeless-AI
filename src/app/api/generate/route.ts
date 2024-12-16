import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const client = new OpenAI({
  baseURL: 'https://api.studio.nebius.ai/v1/',
  apiKey: process.env.NEBIUS_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { 
      contentType, 
      topic, 
      context, 
      companyName, 
      destination, 
      circuit, 
      selectedLocations, 
      arrivalMethod,
      departureMethod, 
      duration 
    } = await req.json()

    let prompt = ''
    if (contentType === 'article') {
      prompt = `Generate SEO-optimized content about "${topic}" for the ${context} section. Adapt the style and structure based on the context while maintaining readability and engagement.

SEO Requirements:
- Meta description: Max 160 characters, include focus keyword
- Title: Include focus keyword, power words, match context tone
- Content: Natural keyword density (1-2%)
- Links: Mix of internal and external (nofollow where appropriate)

Content Structure Based on Context:

About/Company:
- Professional overview
- Mission and values
- Achievements
- Team highlights
- Call to action

Services/Products:
- Value proposition
- Features and benefits
- Specifications
- Pricing
- Comparison tables

Blog/News:
- Engaging narrative
- Personal insights
- Expert quotes
- Practical tips
- Reader engagement

Destinations/Locations:
- Overview
- Key features
- Practical info
- Maps/directions
- Contact details

Output Format:
[META]
<160-char meta description>

[URL-SLUG]
<keyword-based-slug>

# <Context-appropriate title>

[Content following context structure]

### Related Resources
- Internal and external links with descriptions

Images:
- Suggest 2-3 context-appropriate images

Note: Maintain natural keyword placement and adapt tone to match ${context}.`
    } else if (contentType === 'itinerary') {
      prompt = `Create a detailed, SEO-optimized safari itinerary following Rank Math SEO requirements for ${companyName}'s ${duration}-day trip to ${destination}.

Requirements for SEO Optimization:
1. Title Readability:
   - Start with focus keyword (Safari Itinerary)
   - Include a number (${duration} days)
   - Use power words
   - Include positive sentiment

2. Content Structure:
   - Start with table of contents
   - Use short paragraphs
   - Include image suggestions with focus keyword
   - Maintain optimal keyword density
   - Include focus keyword in all key sections
   - Aim for 1000+ words
   - Mix of internal and external links
   - Both dofollow and nofollow links

Output Format:
[META]
<meta description with focus keyword>

[URL-SLUG]
<SEO-friendly URL slug with focus keyword>

# ${duration}-Day ${destination} Safari Itinerary: Ultimate ${circuit} Adventure Guide

[TOC]

## Overview
<brief overview with focus keyword>

![${destination} Safari Overview](<image suggestion>)

## Quick Facts
- Duration: ${duration} days
- Destination: ${destination}
- Circuit: ${circuit}
- Key Locations: ${selectedLocations.join(', ')}
- Best Time to Visit: <specify>
- Difficulty Level: <specify>

## Detailed Safari Itinerary

### Day 1: Arrival and Safari Welcome
- Arrival at ${arrivalMethod}
- Transfer to accommodation
- Welcome briefing and safari orientation
- Evening at leisure to prepare for your adventure

![Day 1 Safari Welcome](<image suggestion>)

<continue with each day>

### Day ${duration}: Final Safari Day and Departure
- Morning activity or leisure time
- Check-out and departure preparations
- Transfer to ${departureMethod}
- Departure and farewell

## Essential Safari Information

### What to Pack for Your Safari
- <essential items list>

### Safari Health and Safety
- <important health information>
- <safety tips>

### Safari Visa and Documentation
- <visa requirements>
- <necessary documentation>

## Additional Safari Resources
- [Internal Link: Safari Packing Guide](internal-url) - <description>
- [Internal Link: Best Time for Safari](internal-url) - <description>
- [External Link: Visa Information](external-url) - <description> {nofollow}
- [External Link: Health Requirements](external-url) - <description>

---
Image Requirements:
1. <safari overview image with focus keyword>
2. <daily activity images with focus keyword>
3. <wildlife and landscape suggestions>

Note: This itinerary can be customized based on specific preferences and requirements.`
    }

    const completion = await client.chat.completions.create({
      temperature: 0.7, // Slightly increased for more creative titles
      max_tokens: 1500, // Increased for longer content
      top_p: 0.9,
      top_k: 50,
      model: 'meta-llama/Meta-Llama-3.1-70B-Instruct-fast',
      messages: [
        {
          role: 'system',
          content: `You are an advanced AI assistant designed to help users create high-quality articles and safari itineraries for their websites. Your primary objectives are to:

1. Generate human-like, engaging, and SEO-friendly content tailored to user inputs.
2. Ensure all generated content scores 85 marks or higher in Rank Math SEO.
3. Provide content that aligns with the placement context (e.g., Home Page, About Us, Blog, Product Description, etc.).
4. Create safari itineraries with detailed, day-by-day plans based on the destination, circuit, and locations specified by the user.

Guidelines:
- Tone and Style:
  - Articles: Maintain a professional, clear, and engaging tone suitable for web audiences.
  - Itineraries: Use a friendly and inviting tone to make safari plans appealing.
- SEO Optimization:
  - Incorporate relevant keywords naturally.
  - Ensure appropriate use of headings, subheadings, meta descriptions, and bullet points where applicable.
  - Avoid keyword stuffing; maintain readability.
- Content Structure:
  - Articles: Use logical flow with an introduction, body, and conclusion.
  - Itineraries: Include key sections such as Day-by-Day Plans, Highlights, and Travel Tips.
- Human-like Output:
  - Use conversational and natural language to mimic human writers. Avoid robotic or overly generic responses.
- Formatting:
  - Use Markdown for content to enable easy rendering on the app.
  - Provide a clean, well-organized output with appropriate headings and bullet points.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const generatedContent = completion.choices[0].message.content

    return NextResponse.json({ content: generatedContent })
  } catch (error) {
    console.error('Error generating content:', error)
    return NextResponse.json({ error: 'Error generating content' }, { status: 500 })
  }
}
