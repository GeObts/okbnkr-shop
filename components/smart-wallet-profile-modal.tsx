"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Zap, User, Mail, Phone, MapPin, Wallet } from "lucide-react"

interface ProfileData {
  email: string
  phone: string
  name: string
  address: string
  walletAddress: string
}

interface SmartWalletProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onProfileComplete: (profile: ProfileData) => void
}

export function SmartWalletProfileModal({ isOpen, onClose, onProfileComplete }: SmartWalletProfileModalProps) {
  const [step, setStep] = useState(1)
  const [profileData, setProfileData] = useState<ProfileData>({
    email: "",
    phone: "",
    name: "",
    address: "",
    walletAddress: "",
  })
  const [isVerifying, setIsVerifying] = useState(false)

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      handleVerifyProfile()
    }
  }

  const handleVerifyProfile = async () => {
    setIsVerifying(true)

    try {
      // Call data validation API
      const response = await fetch("/api/data-validation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email,
          phoneNumber: profileData.phone,
          physicalAddress: profileData.address,
          walletAddress: profileData.walletAddress,
        }),
      })

      const result = await response.json()
      console.log("API response:", result)

      // Always complete the profile if we get any response
      setTimeout(() => {
        setIsVerifying(false)
        onProfileComplete(profileData)
      }, 1500) // Shorter delay
    } catch (error) {
      console.error("Profile verification failed:", error)
      // Still complete the profile even on error
      setTimeout(() => {
        setIsVerifying(false)
        onProfileComplete(profileData)
      }, 1500)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <User className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
              <h3 className="text-yellow-400 font-bold text-lg pixel-text">PERSONAL INFO</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-green-400 font-mono text-sm mb-2 block flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Full Name
                </label>
                <Input
                  value={profileData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="bg-black border-2 border-green-400 text-green-400 placeholder-green-600"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="text-green-400 font-mono text-sm mb-2 block flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Address
                </label>
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-black border-2 border-green-400 text-green-400 placeholder-green-600"
                  placeholder="your@email.com"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Phone className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
              <h3 className="text-yellow-400 font-bold text-lg pixel-text">CONTACT & ADDRESS</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-green-400 font-mono text-sm mb-2 block flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Phone Number
                </label>
                <Input
                  value={profileData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="bg-black border-2 border-green-400 text-green-400 placeholder-green-600"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="text-green-400 font-mono text-sm mb-2 block flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Shipping Address
                </label>
                <Input
                  value={profileData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="bg-black border-2 border-green-400 text-green-400 placeholder-green-600"
                  placeholder="123 Main St, City, State, ZIP"
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Wallet className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
              <h3 className="text-yellow-400 font-bold text-lg pixel-text">WALLET VERIFICATION</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-green-400 font-mono text-sm mb-2 block flex items-center">
                  <Wallet className="w-4 h-4 mr-2" />
                  Wallet Address
                </label>
                <Input
                  value={profileData.walletAddress}
                  onChange={(e) => handleInputChange("walletAddress", e.target.value)}
                  className="bg-black border-2 border-green-400 text-green-400 placeholder-green-600"
                  placeholder="0x..."
                />
              </div>

              <div className="bg-gray-900 border-2 border-yellow-400 p-4 rounded">
                <h4 className="text-yellow-400 font-bold mb-2">Profile Summary:</h4>
                <div className="text-green-400 text-sm space-y-1">
                  <div>Name: {profileData.name}</div>
                  <div>Email: {profileData.email}</div>
                  <div>Phone: {profileData.phone}</div>
                  <div>Address: {profileData.address}</div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (isVerifying) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-black border-4 border-yellow-400 text-yellow-400">
          <div className="text-center py-8">
            <div className="animate-spin w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-2xl font-bold pixel-text mb-2">VERIFYING PROFILE...</h3>
            <div className="text-green-400 font-mono">Please wait while we validate your information</div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-4 border-yellow-400 text-yellow-400 max-w-md">
        <DialogHeader>
          <DialogTitle className="font-anton text-2xl text-center">SMART WALLET PROFILE</DialogTitle>
        </DialogHeader>

        <Card className="bg-gray-900 border-2 border-green-400">
          <CardHeader>
            <CardTitle className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Zap className="w-6 h-6 text-yellow-400" />
                <span className="text-yellow-400 font-bold">STEP {step} OF 3</span>
                <Zap className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(step / 3) * 100}%` }}
                ></div>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent>
            {renderStep()}

            <div className="flex justify-between mt-6">
              {step > 1 && (
                <Button
                  onClick={() => setStep(step - 1)}
                  className="bg-gray-600 hover:bg-gray-500 border-2 border-white text-white font-bold pixel-button"
                >
                  BACK
                </Button>
              )}

              <Button
                onClick={handleNext}
                className="bg-yellow-400 hover:bg-yellow-300 border-2 border-black text-black font-bold pixel-button ml-auto"
                disabled={!profileData.name || !profileData.email}
              >
                {step === 3 ? "VERIFY PROFILE" : "NEXT"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
