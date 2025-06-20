import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // This endpoint can be used for server-side OnchainKit configuration if needed
    // The API key should only be used on the server side
    const config = {
      chain: "base",
      projectId: "5a7733b3bfb91a62c18adcb839e7299e",
      // API key is kept server-side only
    }

    return NextResponse.json({ config })
  } catch (error) {
    console.error("OnchainKit config error:", error)
    return NextResponse.json({ error: "Configuration error" }, { status: 500 })
  }
}
