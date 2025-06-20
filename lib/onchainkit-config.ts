// Server-side only configuration
export const getOnchainKitConfig = () => {
  // This function should only be called on the server
  if (typeof window !== "undefined") {
    throw new Error("OnchainKit API key should not be accessed on the client")
  }

  return {
    apiKey: process.env.ONCHAINKIT_API_KEY, // Note: removed NEXT_PUBLIC_ prefix
    projectId: "5a7733b3bfb91a62c18adcb839e7299e",
  }
}
