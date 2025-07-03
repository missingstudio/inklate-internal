import { Cpu, Zap } from "lucide-react";

export default function Features() {
  return (
    <section className="border-t border-gray-100 bg-white py-16 md:py-24 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-8">
        <div className="space-y-16">
          <h2 className="max-w-3xl text-4xl font-bold text-neutral-900 lg:text-5xl dark:text-white">
            The Lyra ecosystem brings together our models.
          </h2>

          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
                Lyra is evolving to be more than just the models.{" "}
                <span className="font-semibold text-neutral-900 dark:text-white">
                  It supports an entire ecosystem
                </span>{" "}
                — from products to the APIs and platforms helping developers and businesses
                innovate.
              </p>
              <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
                It supports an entire ecosystem — from products to the APIs and platforms helping
                developers and businesses innovate with cutting-edge AI technology.
              </p>

              <div className="grid grid-cols-1 gap-6 pt-8 sm:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-zinc-800">
                      <Zap className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Fast</h3>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Lightning-fast performance with optimized workflows that deliver results in
                    seconds.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-zinc-800">
                      <Cpu className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                      Powerful
                    </h3>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Enterprise-grade processing power that scales with your business needs.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:pl-8">
              <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 dark:border-zinc-700 dark:bg-zinc-900/50">
                <img
                  src="/charts.webp"
                  className="hidden rounded-lg dark:block"
                  alt="Analytics dashboard illustration"
                  width={1207}
                  height={929}
                />
                <img
                  src="/charts-light.webp"
                  className="rounded-lg dark:hidden"
                  alt="Analytics dashboard illustration"
                  width={1207}
                  height={929}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
