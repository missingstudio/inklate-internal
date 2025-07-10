import { AnimatedGroup } from "../animated-group";
import { JoinWaitList } from "./join-waitlist";
import { Variants } from "motion/react";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      y: 12
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        bounce: 0.3,
        duration: 1.5
      }
    }
  } as Variants
};

export const HeroSection = () => {
  return (
    <main className="relative z-10">
      <section className="relative bg-white/90 px-6 py-24 lg:py-32 dark:bg-zinc-950/95">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl">
            <AnimatedGroup variants={transitionVariants}>
              <h1 className="text-center text-5xl leading-tight font-bold tracking-tight text-zinc-900 md:text-6xl dark:text-white">
                Build creative{" "}
                <span className="relative">
                  <span className="relative z-10 text-zinc-600 dark:text-zinc-400">workflows</span>
                  <div className="absolute -bottom-2 left-0 h-3 w-full bg-[#A3FF12] opacity-30" />
                </span>{" "}
                <span className="text-zinc-600 dark:text-zinc-400">with Infinite AI Canvas.</span>
              </h1>

              <p className="mx-auto mt-8 max-w-2xl text-center text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                Inklate's AI-powered canvas is now available and ready to revolutionize the way you
                think about creative automation and visual workflow building.
              </p>
            </AnimatedGroup>

            <JoinWaitList />
            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 0.8
                    }
                  }
                },
                ...transitionVariants
              }}
              className="mt-20 grid gap-8 md:grid-cols-3"
            >
              <div className="group">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#A3FF12] to-[#8FE510]">
                  <div className="h-6 w-6 rounded bg-white/20" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-white">
                  A WORLD OF POSSIBILITIES →
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Discover our advanced AI models and creative automation technologies.
                </p>
              </div>

              <div className="group">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#B794F6]">
                  <div className="h-6 w-6 rounded bg-white/20" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-white">
                  QUALITY YOU CAN TRUST →
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Explore our enterprise-grade workflows and advanced integration options.
                </p>
              </div>

              <div className="group">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#A3FF12] to-[#8FE510]">
                  <div className="h-6 w-6 rounded bg-white/20" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-white">
                  GET YOUR WORKFLOWS FASTER →
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Professional-grade automation, lightning delivery: 6 business days max.
                </p>
              </div>
            </AnimatedGroup>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 bg-gray-50/90 py-16 dark:border-zinc-800 dark:bg-zinc-900/90">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-lg font-medium text-zinc-600 dark:text-zinc-400">
            Your favorite companies are our partners.
          </h2>
          <div className="mx-auto mt-12 flex max-w-5xl flex-wrap items-center justify-center gap-x-12 gap-y-8 opacity-60 grayscale sm:gap-x-16 sm:gap-y-12">
            <img
              className="h-5 w-fit dark:invert"
              src="https://html.tailus.io/blocks/customers/nvidia.svg"
              alt="Nvidia Logo"
              height="20"
              width="auto"
            />
            <img
              className="h-4 w-fit dark:invert"
              src="https://html.tailus.io/blocks/customers/column.svg"
              alt="Column Logo"
              height="16"
              width="auto"
            />
            <img
              className="h-4 w-fit dark:invert"
              src="https://html.tailus.io/blocks/customers/github.svg"
              alt="GitHub Logo"
              height="16"
              width="auto"
            />
            <img
              className="h-5 w-fit dark:invert"
              src="https://html.tailus.io/blocks/customers/nike.svg"
              alt="Nike Logo"
              height="20"
              width="auto"
            />
            <img
              className="h-4 w-fit dark:invert"
              src="https://html.tailus.io/blocks/customers/laravel.svg"
              alt="Laravel Logo"
              height="16"
              width="auto"
            />
            <img
              className="h-7 w-fit dark:invert"
              src="https://html.tailus.io/blocks/customers/lilly.svg"
              alt="Lilly Logo"
              height="28"
              width="auto"
            />
            <img
              className="h-5 w-fit dark:invert"
              src="https://html.tailus.io/blocks/customers/lemonsqueezy.svg"
              alt="Lemon Squeezy Logo"
              height="20"
              width="auto"
            />
            <img
              className="h-6 w-fit dark:invert"
              src="https://html.tailus.io/blocks/customers/openai.svg"
              alt="OpenAI Logo"
              height="24"
              width="auto"
            />
            <img
              className="h-4 w-fit dark:invert"
              src="https://html.tailus.io/blocks/customers/tailwindcss.svg"
              alt="Tailwind CSS Logo"
              height="16"
              width="auto"
            />
            <img
              className="h-5 w-fit dark:invert"
              src="https://html.tailus.io/blocks/customers/vercel.svg"
              alt="Vercel Logo"
              height="20"
              width="auto"
            />
            <img
              className="h-5 w-fit dark:invert"
              src="https://html.tailus.io/blocks/customers/zapier.svg"
              alt="Zapier Logo"
              height="20"
              width="auto"
            />
          </div>
        </div>
      </section>
    </main>
  );
};
