import CallToAction from "./call-to-action";
import { Navigations } from "./navigations";
import Testimonials from "./testimonials";
import { HeroSection } from "./hero";
import Features from "./features";
import Footer from "./footer";
import React from "react";

export function Home() {
  return (
    <div className="relative bg-white dark:bg-zinc-950">
      <Navigations />
      <HeroSection />
      <Features />
      <Testimonials />
      <CallToAction />
      <Footer />
    </div>
  );
}
