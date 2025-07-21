// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { i } from "motion/react-client";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   try {
//     const { reviews } = await req.json();

//     if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
//       return NextResponse.json({ error: "Invalid reviews data" }, { status: 400 });
//     }

//     const genAI = new GoogleGenerativeAI({
//       apiKey: process.env.GEMINI_API_KEY!,
//     });

//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     const prompt = `Tóm tắt các đánh giá sau đây thành một đoạn ngắn bằng tiếng Việt:\n\n---\n${reviews.join("\n---\n")}`;

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const summary = await response.text();

//     return NextResponse.json({ summary });
//   } catch (error) {
//     console.error("Error summarizing reviews:", error);
//     return NextResponse.json({ error: "Failed to summarize reviews" }, { status: 500 });
//   }
// }
