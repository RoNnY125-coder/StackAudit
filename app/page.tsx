import TopBar from "@/components/layout/TopBar"
import Hero from "@/components/landing/Hero"
import Ticker from "@/components/landing/Ticker"
import Footer from "@/components/layout/Footer"
import dynamic from "next/dynamic"

const HowItWorks = dynamic(() => import("@/components/landing/HowItWorks"))

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <main className="flex-1" id="main-content">
        <Hero />
        <Ticker />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  )
}
