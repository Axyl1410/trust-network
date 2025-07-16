import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY!;
const GOOGLE_CSE_ID = process.env.GOOGLE_CSE_ID!;

export async function POST(req: NextRequest) {
  const { website } = await req.json();

  if (!website) {
    return NextResponse.json({ error: 'Missing website' }, { status: 400 });
  }

  const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CSE_ID}&q=${encodeURIComponent(website)}`;

  try {
    const res = await fetch(searchUrl);
    const data = await res.json();

    let foundItem = null;
    if (data.items && Array.isArray(data.items)) {
      foundItem = data.items.find((item: any) => item.link.includes(website));
    }

    if (foundItem) {
      return NextResponse.json({
        verified: true,
        info: {
          title: foundItem.title,
          snippet: foundItem.snippet,
          link: foundItem.link
        }
      });
    } else {
      return NextResponse.json({ verified: false });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to verify website' }, { status: 500 });
  }
} 