import TopBar from "@/components/layout/TopBar"
import Hero from "@/components/landing/Hero"
import Ticker from "@/components/landing/Ticker"
import HowItWorks from "@/components/landing/HowItWorks"
import SocialProof from "@/components/landing/SocialProof"
import Footer from "@/components/layout/Footer"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <main className="flex-1" id="main-content">
        <Hero />
        <Ticker />
        <HowItWorks />
        <SocialProof />
      </main>
      <Footer />
    </div>
  )
}
