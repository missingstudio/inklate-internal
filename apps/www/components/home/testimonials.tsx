import { Avatar, AvatarFallback, AvatarImage } from "@inklate/ui/avatar";
import { Card, CardContent, CardHeader } from "@inklate/ui/card";

export default function Testimonials() {
  return (
    <section className="border-t border-gray-100 bg-white py-16 md:py-24 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-8">
        <div className="space-y-16">
          <div className="mx-auto max-w-3xl space-y-6 text-center">
            <h2 className="text-4xl font-bold text-neutral-900 lg:text-5xl dark:text-white">
              Built by makers, loved by thousands of developers
            </h2>
            <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
              Inklate is evolving to be more than just the models. It supports an entire ecosystem
              from APIs to platforms helping developers and businesses innovate.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
            <Card className="border border-gray-200 bg-white shadow-sm sm:col-span-2 lg:row-span-2 dark:border-zinc-700 dark:bg-zinc-950">
              <CardHeader className="pb-4">
                <div className="text-sm font-semibold text-neutral-900 dark:text-white">Nike</div>
              </CardHeader>
              <CardContent className="space-y-6">
                <blockquote className="space-y-6">
                  <p className="text-lg font-medium text-neutral-900 dark:text-white">
                    "Inklate has transformed the way I develop creative workflows. Their AI-powered
                    canvas and extensive automation capabilities have significantly accelerated our
                    design process. The flexibility to customize every aspect allows us to create
                    unique user experiences."
                  </p>

                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src="https://tailus.io/images/reviews/shekinah.webp"
                        alt="Shekinah Tshiokufila"
                      />
                      <AvatarFallback>ST</AvatarFallback>
                    </Avatar>
                    <div>
                      <cite className="text-sm font-semibold text-neutral-900 dark:text-white">
                        Shekinah Tshiokufila
                      </cite>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">
                        Software Engineer
                      </div>
                    </div>
                  </div>
                </blockquote>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 bg-white shadow-sm md:col-span-2 dark:border-zinc-700 dark:bg-zinc-950">
              <CardContent className="space-y-6 pt-6">
                <blockquote className="space-y-6">
                  <p className="text-lg font-medium text-neutral-900 dark:text-white">
                    "Inklate is really extraordinary and very practical. No need to break your head.
                    A real game-changer for creative automation."
                  </p>

                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src="https://tailus.io/images/reviews/jonathan.webp"
                        alt="Jonathan Yombo"
                      />
                      <AvatarFallback>JY</AvatarFallback>
                    </Avatar>
                    <div>
                      <cite className="text-sm font-semibold text-neutral-900 dark:text-white">
                        Jonathan Yombo
                      </cite>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">
                        Software Engineer
                      </div>
                    </div>
                  </div>
                </blockquote>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-950">
              <CardContent className="space-y-6 pt-6">
                <blockquote className="space-y-6">
                  <p className="text-neutral-900 dark:text-white">
                    "Great work on the AI canvas. This is one of the best creative workflow tools
                    that I have seen so far!"
                  </p>

                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src="https://tailus.io/images/reviews/yucel.webp"
                        alt="Yucel Faruksahan"
                      />
                      <AvatarFallback>YF</AvatarFallback>
                    </Avatar>
                    <div>
                      <cite className="text-sm font-semibold text-neutral-900 dark:text-white">
                        Yucel Faruksahan
                      </cite>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">
                        Creator, Tailkits
                      </div>
                    </div>
                  </div>
                </blockquote>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-950">
              <CardContent className="space-y-6 pt-6">
                <blockquote className="space-y-6">
                  <p className="text-neutral-900 dark:text-white">
                    "The automation capabilities are incredible. Perfect for scaling creative
                    workflows across teams."
                  </p>

                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src="https://tailus.io/images/reviews/rodrigo.webp"
                        alt="Rodrigo Aguilar"
                      />
                      <AvatarFallback>RA</AvatarFallback>
                    </Avatar>
                    <div>
                      <cite className="text-sm font-semibold text-neutral-900 dark:text-white">
                        Rodrigo Aguilar
                      </cite>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">
                        Creator, TailwindAwesome
                      </div>
                    </div>
                  </div>
                </blockquote>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
