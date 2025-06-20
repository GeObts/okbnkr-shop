export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-yellow-400 text-4xl font-bold mb-4">
            ╔══════════════════════════════════════════════════════════════╗
            <br />║ PRIVACY POLICY v3.0 ║
            <br />║ OK$BANKR SHOP SYSTEM ║
            <br />
            ╚══════════════════════════════════════════════════════════════╝
          </div>
          <div className="text-yellow-400 font-anton text-2xl">COMPUTER DOCUMENTATION</div>
          <div className="text-green-400 text-sm mt-2">LAST UPDATED: {new Date().toLocaleDateString()}</div>
        </div>

        <div className="space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-yellow-400 font-bold text-lg mb-4">
              ┌─ SMART WALLET PROFILES DATA COLLECTION ─────────────────────┐
            </h2>
            <div className="pl-4 space-y-2 border-l-2 border-green-400">
              <p>
                <span className="text-yellow-400 font-bold">EMAIL ADDRESS:</span> Required for order confirmations,
                shipping updates, and optional marketing communications
              </p>
              <p>
                <span className="text-yellow-400 font-bold">PHONE NUMBER:</span> Used for delivery coordination,
                customer service, and urgent order updates
              </p>
              <p>
                <span className="text-yellow-400 font-bold">FULL NAME:</span> Required for shipping labels, personalized
                service, and payment processing
              </p>
              <p>
                <span className="text-yellow-400 font-bold">PHYSICAL ADDRESS:</span> Necessary for product delivery, tax
                calculations, and shipping compliance
              </p>
              <p>
                <span className="text-yellow-400 font-bold">WALLET ADDRESS:</span> Used for payment processing, order
                verification, and blockchain transaction tracking
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-yellow-400 font-bold text-lg mb-4">
              ┌─ WHY WE COLLECT YOUR DATA ──────────────────────────────────┐
            </h2>
            <div className="pl-4 space-y-2 border-l-2 border-blue-400">
              <p>
                <span className="text-blue-400 font-bold">LIGHTNING-FAST CHECKOUT:</span> Save your information securely
                for instant future purchases using Smart Wallet Profiles
              </p>
              <p>
                <span className="text-blue-400 font-bold">ORDER FULFILLMENT:</span> Ship products to your address and
                provide tracking information
              </p>
              <p>
                <span className="text-blue-400 font-bold">CUSTOMER SERVICE:</span> Contact you about orders, resolve
                issues, and provide support
              </p>
              <p>
                <span className="text-blue-400 font-bold">MARKETING COMMUNICATIONS:</span> Send updates about new
                products, sales, and promotions (opt-out available)
              </p>
              <p>
                <span className="text-blue-400 font-bold">LEGAL COMPLIANCE:</span> Meet tax reporting, regulatory
                requirements, and fraud prevention
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-yellow-400 font-bold text-lg mb-4">
              ┌─ SMART WALLET PROFILES INTEGRATION ─────────────────────────┐
            </h2>
            <div className="pl-4 space-y-2 border-l-2 border-purple-400">
              <p>
                <span className="text-purple-400 font-bold">SECURE STORAGE:</span> Your shipping information is stored
                securely using Coinbase's Smart Wallet Profiles system
              </p>
              <p>
                <span className="text-purple-400 font-bold">ONE-CLICK CHECKOUT:</span> Returning customers can complete
                purchases instantly without re-entering information
              </p>
              <p>
                <span className="text-purple-400 font-bold">ADDRESS VALIDATION:</span> We validate shipping addresses to
                ensure accurate delivery
              </p>
              <p>
                <span className="text-purple-400 font-bold">PROFILE VERIFICATION:</span> Data is verified through our
                callback API for accuracy and fraud prevention
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-yellow-400 font-bold text-lg mb-4">
              ┌─ DATA SHARING AND THIRD PARTIES ───────────────────────────┐
            </h2>
            <div className="pl-4 space-y-2 border-l-2 border-red-400">
              <p>
                <span className="text-red-400 font-bold">SHIPPING PROVIDERS:</span> Address and contact information
                shared with carriers (UPS, FedEx, USPS) for delivery
              </p>
              <p>
                <span className="text-red-400 font-bold">PAYMENT PROCESSORS:</span> Financial data processed through
                Coinbase Commerce and Base network
              </p>
              <p>
                <span className="text-red-400 font-bold">BLOCKCHAIN RECORDS:</span> Transaction data permanently
                recorded on Base blockchain for transparency
              </p>
              <p>
                <span className="text-red-400 font-bold">NO MARKETING SALES:</span> We NEVER sell your personal data to
                third-party marketers or advertisers
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-yellow-400 font-bold text-lg mb-4">
              ┌─ YOUR RIGHTS AND CONTROLS ──────────────────────────────────┐
            </h2>
            <div className="pl-4 space-y-2 border-l-2 border-cyan-400">
              <p>
                <span className="text-cyan-400 font-bold">ACCESS:</span> Request a complete copy of all data we have
                about you
              </p>
              <p>
                <span className="text-cyan-400 font-bold">MODIFY:</span> Update your profile information, shipping
                address, or contact details at any time
              </p>
              <p>
                <span className="text-cyan-400 font-bold">DELETE:</span> Request complete account and data deletion
                (some transaction records may remain on blockchain)
              </p>
              <p>
                <span className="text-cyan-400 font-bold">PORTABILITY:</span> Export your data in machine-readable
                format for transfer to other services
              </p>
              <p>
                <span className="text-cyan-400 font-bold">OPT-OUT:</span> Unsubscribe from marketing emails while
                keeping essential order communications
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-yellow-400 font-bold text-lg mb-4">
              ┌─ SECURITY MEASURES ─────────────────────────────────────────┐
            </h2>
            <div className="pl-4 space-y-2 border-l-2 border-orange-400">
              <p>
                <span className="text-orange-400 font-bold">ENCRYPTION:</span> All personal data encrypted in transit
                using TLS and at rest using AES-256
              </p>
              <p>
                <span className="text-orange-400 font-bold">SMART CONTRACTS:</span> Payment processing secured by
                audited smart contracts on Base network
              </p>
              <p>
                <span className="text-orange-400 font-bold">ACCESS CONTROLS:</span> Limited employee access to personal
                data with audit logging
              </p>
              <p>
                <span className="text-orange-400 font-bold">REGULAR AUDITS:</span> Security reviews, penetration
                testing, and compliance assessments
              </p>
              <p>
                <span className="text-orange-400 font-bold">INCIDENT RESPONSE:</span> 24/7 monitoring and rapid response
                to security threats
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-yellow-400 font-bold text-lg mb-4">
              ┌─ COOKIES AND TRACKING ──────────────────────────────────────┐
            </h2>
            <div className="pl-4 space-y-2 border-l-2 border-pink-400">
              <p>
                <span className="text-pink-400 font-bold">ESSENTIAL COOKIES:</span> Required for shopping cart,
                checkout, and basic site functionality
              </p>
              <p>
                <span className="text-pink-400 font-bold">ANALYTICS:</span> Anonymous usage data to improve site
                performance and user experience
              </p>
              <p>
                <span className="text-pink-400 font-bold">NO TRACKING:</span> We do not use third-party tracking pixels
                or advertising cookies
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-yellow-400 font-bold text-lg mb-4">
              ┌─ CONTACT INFORMATION ───────────────────────────────────────┐
            </h2>
            <div className="pl-4 space-y-2 border-l-2 border-white">
              <p>
                <span className="text-white font-bold">PRIVACY OFFICER:</span> privacy@okbankrshop.com
              </p>
              <p>
                <span className="text-white font-bold">CUSTOMER SERVICE:</span> support@okbankrshop.com
              </p>
              <p>
                <span className="text-white font-bold">DATA REQUESTS:</span> data@okbankrshop.com
              </p>
              <p>
                <span className="text-white font-bold">MAILING ADDRESS:</span> OK$BANKR SHOP, 123 Crypto Street, Base
                City, BC 12345
              </p>
            </div>
          </section>

          <div className="text-center mt-12 text-yellow-400 border-4 border-yellow-400 p-4">
            <div className="text-2xl font-bold mb-2">
              ═══════════════════════════════════════════════════════════════
            </div>
            <p className="text-lg font-bold">SYSTEM STATUS: ACTIVE</p>
            <p>LAST UPDATED: {new Date().toLocaleDateString()}</p>
            <p>VERSION: 3.0.1</p>
            <p>CONTACT: privacy@okbankrshop.com</p>
            <div className="text-2xl font-bold mt-2">
              ═══════════════════════════════════════════════════════════════
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <a
            href="/"
            className="bg-yellow-400 text-black px-6 py-3 font-bold pixel-text border-4 border-black hover:bg-yellow-300 transition-colors inline-block"
          >
            ← RETURN TO SHOP
          </a>
        </div>
      </div>
    </div>
  )
}
