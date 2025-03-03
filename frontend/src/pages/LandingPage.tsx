import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Features } from "../components/landing-page/feature";
import { Brokers } from "../components/landing-page/brokers";
import { Testimonials } from "../components/landing-page/testimonials";
import { Footer } from "../components/landing-page/footer";
import { Header } from "../components/landing-page/headers";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen font-gothic flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-slate-50 py-12 md:py-20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="space-y-6">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  Welcome to Trade Moai
                </h1>
                <p className="max-w-[600px] text-gray-600 md:text-xl/relaxed">
                  A full options trading system - learn how to trade properly by
                  learning our trading system and supercharge your trading
                  journey with our MOAi trading journal.
                </p>
                <p className="text-sm mb-4 text-gray-500">
                  Moai (模合, Mo-ai) are social support groups that form in
                  order to provide varying support from social, financial,
                  health, or spiritual interests. Moai means "meeting for a
                  common purpose" in Japanese.
                </p>
                <Link to="/signup">
                  <Button
                    size="lg"
                    className="bg-blue-600 mt-3 hover:bg-blue-700"
                  >
                    Start For Free
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/placeholder.svg"
                  alt="Trading Platform Preview"
                  width={580}
                  height={420}
                  className="rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        <Features />
        <Brokers />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
