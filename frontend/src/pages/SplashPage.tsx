import { Navigation } from "@/components/navigation";
import { Logo } from "@/components/logo";
import { PaintOverlay } from "@/components/paint-overlay";
import image from "@/assets/person.png";
import logo from "@/assets/logo.png";
import smily from "@/assets/smile.png";
export default function SplashPage() {
  return (
    <div className="min-h-screen bg-white relative w-full">
      <PaintOverlay />
      <Navigation />
      <main className="w-full px-12 py-6">
        <div className="flex mx-auto flex-row items-center ">
          <div className="max-w-3xl">
            <img src={logo} width={360} alt="" />
            <h1 className="text-4xl font-bold text-blue-600 mb-4">
              Welcome to Trade MOAI
            </h1>
            <p className="text-base text-gray-600 mb-6">
              A full options trading system - learn how to trade properly while
              leveraging our MOAI trading journal
            </p>
            <div className="bg-gray-50 text-sm p-3 rounded-lg">
              <p className="text-gray-700 mb-2">
                Moai (模合, Mo-ai) are social support groups that form in order
                to provide varying support from social, financial, health, or
                spiritual interests. Moai means "meeting for a common purpose"
                in Japanese
              </p>
            </div>
          </div>

          <div className=" relative flex flex-col items-center">
            <div className="absolute flex flex-col items-center -bottom-32 -left-[19rem]">
              <img src={smily} alt="Trader figure" />
              <div className="font-semibold mt-2 w-full text-center text-sm  text-blue-900">
                This is the options trader you in male form
              </div>
            </div>
            <img src={image} alt="Trader figure" width={330} />
            <div className="font-semibold w-[70%] text-center text-sm  text-blue-900">
              Click on one of the colors to the right and circle all the places
              that trading hurt you.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
