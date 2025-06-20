import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    console.log("Smart Wallet Profile data received:", data)

    // Extract user data - handle different possible data structures
    let userData = data
    if (data.requestedInfo) {
      userData = data.requestedInfo
    }

    const { email, phoneNumber, name, physicalAddress, walletAddress } = userData

    // Format the address properly
    const formatAddress = (addr: any) => {
      if (!addr) return "N/A"
      if (typeof addr === "string") return addr

      const parts = []
      if (addr.street1) parts.push(addr.street1)
      if (addr.street2) parts.push(addr.street2)
      if (addr.city) parts.push(addr.city)
      if (addr.state) parts.push(addr.state)
      if (addr.postalCode) parts.push(addr.postalCode)
      if (addr.country) parts.push(addr.country)
      return parts.length > 0 ? parts.join(", ") : "N/A"
    }

    // Format phone number
    const formatPhone = (phone: any) => {
      if (!phone) return "N/A"
      if (typeof phone === "string") return phone
      return phone.number || phone
    }

    // Prepare email content
    const emailBody = `
🛍️ NEW ORDER RECEIVED via OKBNKR SHOP

👤 Customer Details:
Name: ${name || "N/A"}
Email: ${email || "N/A"}
Phone: ${formatPhone(phoneNumber)}
Shipping Address: ${formatAddress(physicalAddress)}
Wallet Address: ${walletAddress || "N/A"}

🎉 Get ready to fulfill the order!

---
This order was placed through the OKBNKR SHOP Smart Wallet checkout system.
Order Time: ${new Date().toLocaleString()}
    `

    // Send email notification using Resend
    try {
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer re_7C5QfR8P_9n2nQ3xFoZu5mFYRQvEGZjoY`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "onboarding@resend.dev",
          to: "basednouns@protonmail.com",
          subject: "New Order – OKBNKR SHOP",
          text: emailBody,
        }),
      })

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text()
        console.error("Resend API error:", errorText)
        // Don't fail the entire request if email fails
      } else {
        const emailResult = await emailResponse.json()
        console.log("Order notification email sent successfully:", emailResult)
      }
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError)
      // Don't fail the entire request if email fails
    }

    // Always return success to prevent getting stuck
    return NextResponse.json({ status: "ok" }, { status: 200 })
  } catch (error) {
    console.error("Data validation error:", error)
    // Even on error, return ok to prevent getting stuck
    return NextResponse.json({ status: "ok" }, { status: 200 })
  }
}
