import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, LineChart, TrendingUp } from "lucide-react";

export function Features() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32" id="features">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Trade Moai Journaling Features
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Any trader, whether levering our system or their own, needs to be
              journaling and reviewing their trades. Learning from your trades,
              be it emotional, mental, technical, or quality setups, is key to
              becoming a consistent profitable trader.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
          <Card className="relative overflow-hidden">
            <CardContent className="flex flex-col items-center space-y-2 p-6 text-center">
              <BarChart3 className="h-12 w-12 text-blue-600" />
              <h3 className="text-xl font-bold">Upload & Analyze</h3>
              <p className="text-sm text-gray-500">
                Upload your trades for the day and Moai Journal will prepare the
                chart for you to give your analysis and thoughts.
              </p>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden">
            <CardContent className="flex flex-col items-center space-y-2 p-6 text-center">
              <LineChart className="h-12 w-12 text-blue-600" />
              <h3 className="text-xl font-bold">Track Progress</h3>
              <p className="text-sm text-gray-500">
                Review your stats over time as the data you gather becomes a
                tool you will leverage to become a better, consistent, and
                profitable trader.
              </p>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden">
            <CardContent className="flex flex-col items-center space-y-2 p-6 text-center">
              <TrendingUp className="h-12 w-12 text-blue-600" />
              <h3 className="text-xl font-bold">Learn & Grow</h3>
              <p className="text-sm text-gray-500">
                Learn from Team Moai - if you need an edge and profitable system
                or if you want to supplement your current system with additional
                strategies.
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          <div className="flex flex-col items-center space-y-2">
            <span className="text-4xl font-bold text-blue-600">12%</span>
            <span className="text-sm text-gray-500">Average Return</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <span className="text-4xl font-bold text-blue-600">87%</span>
            <span className="text-sm text-gray-500">Success Rate</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <span className="text-4xl font-bold text-blue-600">$5000</span>
            <span className="text-sm text-gray-500">Avg Monthly Profit</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <span className="text-4xl font-bold text-blue-600">43,770</span>
            <span className="text-sm text-gray-500">Active Users</span>
          </div>
        </div>
      </div>
    </section>
  );
}
