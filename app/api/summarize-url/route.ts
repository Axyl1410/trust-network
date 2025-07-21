import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	// Example: just return a static message
	return NextResponse.json({ message: "Summarized!" });
}
