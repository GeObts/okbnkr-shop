"use client"

import React from "react"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Wallet connection error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-yellow-400 flex items-center justify-center">
          <div className="text-center p-8 border-4 border-yellow-400 bg-gray-900">
            <h2 className="text-2xl font-bold pixel-text mb-4">SYSTEM ERROR</h2>
            <p className="text-green-400 font-mono mb-4">Wallet connection failed. Please refresh the page.</p>
            <Button
              onClick={() => this.setState({ hasError: false })}
              className="bg-yellow-400 text-black hover:bg-yellow-300 border-2 border-black font-bold pixel-button"
            >
              RETRY CONNECTION
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
