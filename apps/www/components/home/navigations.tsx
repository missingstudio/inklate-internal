import { ThemeSwitcher } from "../theme-switcher";
import { Button } from "@inklate/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "react-router";
import * as React from "react";

const menuItems = [
  { name: "Features", href: "#" },
  { name: "Solution", href: "#" },
  { name: "Pricing", href: "#" },
  { name: "About", href: "#" }
];

export const Navigations = () => {
  const [menuState, setMenuState] = React.useState(false);

  return (
    <header className="border-b border-gray-100 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <nav data-state={menuState && "active"} className="group w-full">
        <div className="mx-auto max-w-7xl px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex w-full justify-between lg:w-auto">
              <Link
                to="/"
                aria-label="home"
                className="flex items-center text-xl font-semibold text-neutral-900 dark:text-white"
              >
                Inklate
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="m-auto h-6 w-6 duration-200 group-data-[state=active]:scale-0 group-data-[state=active]:rotate-180 group-data-[state=active]:opacity-0" />
                <X className="absolute inset-0 m-auto h-6 w-6 scale-0 -rotate-180 opacity-0 duration-200 group-data-[state=active]:scale-100 group-data-[state=active]:rotate-0 group-data-[state=active]:opacity-100" />
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:gap-6">
              <ul className="flex gap-8 text-sm font-medium">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.href}
                      className="text-neutral-600 transition-colors duration-200 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-3 border-l border-gray-200 pl-6 dark:border-zinc-700">
                <ThemeSwitcher />
                <Button
                  asChild
                  size="sm"
                  className="rounded-lg bg-neutral-900 px-4 py-2 font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-gray-100"
                >
                  <Link to="#demo">Join Waitlist</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div
            className={`lg:hidden ${menuState ? "block" : "hidden"} border-t border-gray-100 dark:border-zinc-800`}
          >
            <div className="space-y-6 py-6">
              <ul className="space-y-4">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.href}
                      className="block text-base font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                      onClick={() => setMenuState(false)}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 dark:border-zinc-800">
                <ThemeSwitcher />
                <Button
                  asChild
                  size="sm"
                  className="w-full rounded-lg bg-neutral-900 px-4 py-2 font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-gray-100"
                >
                  <Link to="#demo" onClick={() => setMenuState(false)}>
                    Join Waitlist
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
