
// import * as cheerio from "cheerio";
// import { NextRequest, NextResponse } from "next/server";

// async function fetchPageContent(url: string): Promise<string> {
//   try {
//     const response = await fetch(url);
//     if (!response.ok) {
//       throw new Error(`Failed to fetch page: ${response.statusText}`);
//     }
//     const html = await response.text();
//     const $ = cheerio.load(html);

//     // Remove script and style tags
//     $("script, style").remove();

//     // Get text from the body
//     return $("body").text().replace(/\s\s+/g, ' ').trim();
//   } catch (error) {
//     console.error("Error fetching page content:", error);
//     return "";
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const { url } = await req.json();
//     if (!url) {
//       return NextResponse.json({ error: "URL is required" }, { status: 400 });
//     }

//     const pageContent = await fetchPageContent(url);
//     if (!pageContent) {
//       return NextResponse.json({ error: "Could not retrieve content from URL" }, { status: 500 });
//     }

//     const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY!);
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     const prompt = `Based on the following website content, please write a concise, neutral, and professional company description in Vietnamese. Focus on what the company does, its main products or services, and its target audience. Limit the description to 2-3 sentences.\n\nWebsite Content:\n"""\n${pageContent.substring(0, 8000)}\n"""`;

//     const result = await model.generateContent(prompt);
//     const summary = result.response.text();

//     return NextResponse.json({ summary });
//   } catch (error) {
//     console.error("Error summarizing URL:", error);
//     return NextResponse.json({ error: "Failed to summarize content" }, { status: 500 });
//   }
// } 