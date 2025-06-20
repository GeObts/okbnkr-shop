import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    console.log("Smart Wallet Profile data received:", data)

    // Extract profile data from the request
    const profileData = data.requestedInfo || data

    const { email, phoneNumber, name, physicalAddress } = profileData

    console.log("Profile collected:", {
      email,
      phoneNumber: phoneNumber?.number || phoneNumber,
      name,
      address: physicalAddress,
    })

    // Here you could:
    // 1. Save to database
    // 2. Send confirmation email
    // 3. Process order fulfillment
    // 4. Update inventory

    // For now, just log the successful collection
    console.log("Profile data successfully processed")

    // Return success to complete the Smart Wallet Profiles flow
    return NextResponse.json({ status: "ok" })
  } catch (error) {
    console.error("Profile callback error:", error)
    // Still return ok to prevent blocking the user flow
    return NextResponse.json({ status: "ok" })
  }
}
