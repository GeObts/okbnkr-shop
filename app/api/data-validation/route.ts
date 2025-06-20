import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    console.log("Data validation request:", data)

    // Extract user data from Smart Wallet Profiles request
    const { requestedInfo } = data
    const { email, phoneNumber, name, physicalAddress, walletAddress } = requestedInfo || {}

    // Format the address properly
    const formatAddress = (addr: any) => {
      if (!addr) return "N/A"
      const parts = []
      if (addr.street1) parts.push(addr.street1)
      if (addr.street2) parts.push(addr.street2)
      if (addr.city) parts.push(addr.city)
      if (addr.state) parts.push(addr.state)
      if (addr.postalCode) parts.push(addr.postalCode)
      if (addr.country) parts.push(addr.country)
      return parts.join(", ")
    }

    // Format phone number
    const formatPhone = (phone: any) => {
      if (!phone) return "N/A"
      return phone.number || phone
    }

    // Prepare email content
    const emailBody = `
🛍️ NEW ORDER RECEIVED via OKBNKR SHOP

👤 Customer Details:
Name: ${name || "N/A"}
Email: ${email || "N/A"}
Phone: ${formatPhone(phoneNumber)}
Address: ${formatAddress(physicalAddress)}
Wallet: ${walletAddress || "N/A"}

🎉 Get ready to fulfill the order!

---
This order was placed through the OKBNKR SHOP Smart Wallet checkout system.
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
        throw new Error(`Resend API error: ${emailResponse.status} - ${errorText}`)
      }

      const emailResult = await emailResponse.json()
      console.log("Order notification email sent successfully:", emailResult)
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError)
      return NextResponse.json(
        {
          status: "error",
          error: "Failed to send email notification",
          details: emailError instanceof Error ? emailError.message : "Unknown email error",
        },
        { status: 500 },
      )
    }

    // Validate the data for Smart Wallet Profiles
    const errors: Record<string, any> = {}

    // Validate email
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        errors.email = "Invalid email format"
      }
    } else {
      errors.email = "Email is required"
    }

    // Validate phone number
    if (phoneNumber) {
      const phoneNum = phoneNumber.number || phoneNumber
      if (!phoneNum || phoneNum.length < 10) {
        errors.phoneNumber = { number: "Phone number must be at least 10 digits" }
      }
    } else {
      errors.phoneNumber = { number: "Phone number is required" }
    }

    // Validate name
    if (!name || name.trim().length < 2) {
      errors.name = "Full name is required (minimum 2 characters)"
    }

    // Validate physical address
    if (physicalAddress) {
      if (!physicalAddress.street1) {
        errors.physicalAddress = { street1: "Street address is required" }
      }
      if (!physicalAddress.city) {
        errors.physicalAddress = { ...errors.physicalAddress, city: "City is required" }
      }
      if (!physicalAddress.postalCode) {
        errors.physicalAddress = { ...errors.physicalAddress, postalCode: "Postal code is required" }
      }
      if (!physicalAddress.country) {
        errors.physicalAddress = { ...errors.physicalAddress, country: "Country is required" }
      }
    } else {
      errors.physicalAddress = { street1: "Physical address is required" }
    }

    // Validate wallet address
    if (!walletAddress || !walletAddress.startsWith("0x") || walletAddress.length !== 42) {
      errors.walletAddress = "Valid wallet address is required"
    }

    // If there are validation errors, return them
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 })
    }

    // SUCCESS: Return the original transaction calls for execution
    return NextResponse.json({
      status: "ok",
      request: {
        calls: data.calls,
        chainId: data.chainId,
        version: data.version,
      },
    })
  } catch (error) {
    console.error("Data validation error:", error)
    return NextResponse.json(
      {
        status: "error",
        error: "Server error validating data",
        details: error instanceof Error ? error.message : "Unknown server error",
      },
      { status: 500 },
    )
  }
}
