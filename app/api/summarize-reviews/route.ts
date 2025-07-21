import { NextRequest, NextResponse } from "next/server";
import { InferenceClient } from "@huggingface/inference";

export async function POST(req: NextRequest) {
  try {
    const { reviews } = await req.json();

    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
      return NextResponse.json({ error: "Dữ liệu đánh giá không hợp lệ" }, { status: 400 });
    }

    if (!process.env.HF_API_TOKEN) {
      return NextResponse.json({ error: "Khóa API Hugging Face chưa được cấu hình" }, { status: 500 });
    }

    // Optional: Translate Vietnamese to English for better summarization
    const translateToEnglish = async (text: string) => {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-vi-en",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: text }),
        }
      );
      const data = await response.json();
      return data[0]?.translation_text || text;
    };

    const reviewContents = reviews.join(" ").slice(0, 4000); // Limit to 4000 characters
    const translatedReviews = await translateToEnglish(reviewContents); // Translate to English

    const client = new InferenceClient(process.env.HF_API_TOKEN);

    const output = await client.textGeneration({
      model: "google/gemma-2-2b",
      inputs: `Summarize the following user reviews into a single, coherent paragraph.
- Avoid repeating the same information or phrases.
- Combine similar points into one sentence.
- Focus on the overall sentiment, main strengths, and any common feedback.
- Write in natural, fluent English as if explaining to a friend.

Reviews:
${translatedReviews}`,
      parameters: {
        max_new_tokens: 120,
        temperature: 0.7,
      },
      // provider: "featherless-ai", // Optional
    });

    return NextResponse.json({ summary: output.generated_text });
  } catch (error) {
    console.error("Error summarizing reviews:", error);
    return NextResponse.json({ error: "Could not summarize reviews" }, { status: 500 });
  }
}
