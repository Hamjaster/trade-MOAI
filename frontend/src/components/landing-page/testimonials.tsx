"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, User } from "lucide-react";
import { useState } from "react";

const testimonials = [
  {
    content:
      "Trade Moai has completely transformed how I approach trading. The journaling features are invaluable.",
    author: "Trading Expert",
    duration: "Trading for 2 years",
  },
  {
    content:
      "The analytics and insights provided by Trade Moai have helped me become a more consistent trader.",
    author: "Options Trader",
    duration: "Trading for 5 months",
  },
  // Add more testimonials as needed
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((current) => (current + 1) % testimonials.length);
  };

  const previous = () => {
    setCurrentIndex(
      (current) => (current - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter">Testimonials</h2>
          <p className="text-gray-500">Let's hear what our team members say</p>
        </div>
        <div className="mx-auto max-w-4xl py-12">
          <div className="relative">
            <Card>
              <CardContent className="flex flex-col items-center p-6">
                <blockquote className="mb-6 text-center text-lg text-gray-600">
                  "{testimonials[currentIndex].content}"
                </blockquote>
                <div className="flex items-center space-x-2">
                  <User className="h-10 w-10 rounded-full bg-gray-100 p-2" />
                  <div className="text-left">
                    <div className="font-semibold">
                      {testimonials[currentIndex].author}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testimonials[currentIndex].duration}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <button
              onClick={previous}
              className="absolute left-0 top-1/2 -translate-y-1/2 transform rounded-full bg-white p-2 shadow-lg"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={next}
              className="absolute right-0 top-1/2 -translate-y-1/2 transform rounded-full bg-white p-2 shadow-lg"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
