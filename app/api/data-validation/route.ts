import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json()
    console.log("Data validation request:", requestData)

    // Extract user data from Smart Wallet Profiles request
    const { requestedInfo } = requestData
    const { email, phoneNumber, name, physicalAddress, walletAddress } = requestedInfo || {}

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
      if (!phoneNumber.number || phoneNumber.number.length < 10) {
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

    // Store user data (in production, save to database)
    const userData = {
      email,
      phoneNumber: phoneNumber?.number,
      name,
      address: {
        street1: physicalAddress?.street1,
        street2: physicalAddress?.street2,
        city: physicalAddress?.city,
        state: physicalAddress?.state,
        postalCode: physicalAddress?.postalCode,
        country: physicalAddress?.country,
      },
      walletAddress,
      timestamp: new Date().toISOString(),
    }

    console.log("User data validated and stored:", userData)

    // SUCCESS: Return the original transaction calls for execution
    return NextResponse.json({
      request: {
        calls: requestData.calls,
        chainId: requestData.chainId,
        version: requestData.version,
      },
    })
  } catch (error) {
    console.error("Data validation error:", error)
    return NextResponse.json(
      {
        errors: { server: "Server error validating data" },
      },
      { status: 500 },
    )
  }
}
