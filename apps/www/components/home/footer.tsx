import { ChevronsUpDown } from "lucide-react";
import { Button } from "@inklate/ui/button";
import { cn } from "@inklate/ui/lib/utils";
import { Label } from "@inklate/ui/label";
import { Input } from "@inklate/ui/input";
import { Link } from "react-router";

const links = [
  {
    group: "Product",
    items: [
      {
        title: "Features",
        to: "#"
      },
      {
        title: "Solution",
        to: "#"
      },
      {
        title: "Customers",
        to: "#"
      },
      {
        title: "Pricing",
        to: "#"
      },
      {
        title: "Help",
        to: "#"
      },
      {
        title: "About",
        to: "#"
      }
    ]
  },
  {
    group: "Solution",
    items: [
      {
        title: "Startup",
        to: "#"
      },
      {
        title: "Freelancers",
        to: "#"
      },
      {
        title: "Organizations",
        to: "#"
      },
      {
        title: "Students",
        to: "#"
      },
      {
        title: "Collaboration",
        to: "#"
      },
      {
        title: "Design",
        to: "#"
      },
      {
        title: "Management",
        to: "#"
      }
    ]
  },
  {
    group: "Company",
    items: [
      {
        title: "About",
        to: "#"
      },
      {
        title: "Careers",
        to: "#"
      },
      {
        title: "Blog",
        to: "#"
      },
      {
        title: "Press",
        to: "#"
      },
      {
        title: "Contact",
        to: "#"
      },
      {
        title: "Help",
        to: "#"
      }
    ]
  },
  {
    group: "Legal",
    items: [
      {
        title: "Licence",
        to: "#"
      },
      {
        title: "Privacy",
        to: "#"
      },
      {
        title: "Cookies",
        to: "#"
      },
      {
        title: "Security",
        to: "#"
      }
    ]
  }
];

export default function FooterSection() {
  return (
    <footer className="border-t border-gray-100 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-8 py-16">
        <div className="space-y-12">
          {/* Header section with logo and social links */}
          <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-between">
            <Link
              to="/"
              aria-label="Inklate home"
              className="text-xl font-semibold text-neutral-900 dark:text-white"
            >
              Inklate
            </Link>

            <div className="flex gap-6">
              <Link
                to="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X/Twitter"
                className="text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M10.488 14.651L15.25 21h7l-7.858-10.478L20.93 3h-2.65l-5.117 5.886L8.75 3h-7l7.51 10.015L2.32 21h2.65zM16.25 19L5.75 5h2l10.5 14z"
                  ></path>
                </svg>
              </Link>
              <Link
                to="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"
                  ></path>
                </svg>
              </Link>
              <Link
                to="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
                  ></path>
                </svg>
              </Link>
            </div>
          </div>

          {/* Links section */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {links.map((linkGroup, index) => (
              <div key={index} className="space-y-4">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  {linkGroup.group}
                </h3>
                <ul className="space-y-3">
                  {linkGroup.items.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        to={link.to}
                        className="text-sm text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter section */}
          <div className="border-t border-gray-200 pt-8 dark:border-zinc-700">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Stay updated
                </h3>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                  Get the latest news and updates from Inklate.
                </p>
              </div>

              <form className="flex w-full max-w-sm gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="h-9 flex-1 border-gray-200 text-sm dark:border-zinc-700"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="h-9 bg-neutral-900 px-4 text-sm text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-gray-100"
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-200 pt-8 text-center dark:border-zinc-700">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              © 2024 Inklate. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
