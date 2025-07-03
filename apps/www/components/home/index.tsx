import CallToAction from "./call-to-action";
import Testimonials from "./testimonials";
import { HeroSection } from "./hero";
import Features from "./features";
import Footer from "./footer";

export function Home() {
  return (
    <>
      <HeroSection />
      <Features />
      <Testimonials />
      <CallToAction />
      <Footer />
    </>
  );
}
