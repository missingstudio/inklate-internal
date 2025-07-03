import { Mail, SendHorizonal } from "lucide-react";
import { Button } from "@inklate/ui/button";

export default function CallToAction() {
  return (
    <section className="border-t border-gray-100 bg-white py-16 md:py-24 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold text-neutral-900 lg:text-5xl dark:text-white">
            Start Building
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
            Join thousands of developers who are already transforming their creative workflows with
            our AI-powered platform.
          </p>

          <form action="" className="mx-auto mt-12 max-w-md">
            <div className="relative flex items-center rounded-lg border border-gray-200 bg-white shadow-sm focus-within:border-neutral-400 focus-within:ring-2 focus-within:ring-neutral-100 dark:border-zinc-700 dark:bg-zinc-950 dark:focus-within:border-zinc-600 dark:focus-within:ring-zinc-800">
              <Mail className="pointer-events-none absolute left-4 h-5 w-5 text-neutral-500 dark:text-neutral-400" />

              <input
                placeholder="Your email address"
                className="h-12 w-full bg-transparent pr-4 pl-12 text-neutral-900 placeholder-neutral-500 focus:outline-none dark:text-white dark:placeholder-neutral-400"
                type="email"
              />

              <div className="p-2">
                <Button
                  aria-label="Get started"
                  size="sm"
                  className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-gray-100"
                >
                  <span className="hidden sm:block">Get Started</span>
                  <SendHorizonal className="h-4 w-4 sm:hidden" strokeWidth={2} />
                </Button>
              </div>
            </div>
          </form>

          <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
            Free trial. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
}
