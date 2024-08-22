// app/api/generate/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-2024-08-06',
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: "Generate a title, description, and suggested price for this item. Respond in JSON format with keys 'title', 'description', and 'price'. Do not include any markdown formatting in your response.",
            },
            {
              type: 'image_url',
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
    });

    const content = response.choices[0].message.content;
    console.log('Raw content from OpenAI:', content);

    // Remove any potential markdown formatting
    const cleanedContent = content?.replace(/```json\n?|\n?```/g, '').trim();
    console.log('Cleaned content:', cleanedContent);

    let parsedContent;
    try {
      if (cleanedContent === undefined) {
        throw new Error('Content is undefined');
      }
      parsedContent = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      return NextResponse.json(
        { error: 'Failed to parse OpenAI response' },
        { status: 500 }
      );
    }

    return NextResponse.json(parsedContent);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Failed to generate listing' },
      { status: 500 }
    );
  }
}
