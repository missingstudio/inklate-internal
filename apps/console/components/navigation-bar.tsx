import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@inklate/ui/breadcrumb";
import { SidebarTrigger } from "@inklate/ui/sidebar";
import React, { useEffect, useState } from "react";
import { Separator } from "@inklate/ui/separator";
import { ThemeSwitcher } from "./theme-switcher";
import { Link, useLocation } from "react-router";

export function AppNavigationBar() {
  const [breadcrumbItems, setBreadcrumbItems] = useState<{ title: string; url: string }[]>([]);
  const path = useLocation().pathname;

  useEffect(() => {
    const paths = path.split("/").filter(Boolean); // Remove empty strings
    const breadcrumbs = paths.map((segment, index) => {
      const url = `/${paths.slice(0, index + 1).join("/")}`;

      return {
        title: capitalize(breadcrumbsMap[segment] || segment),
        url
      };
    });
    setBreadcrumbItems(breadcrumbs);
  }, [path]);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        {breadcrumbItems.length > 1 && (
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        )}
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbItems.map((item, index) => (
              <React.Fragment key={item.url}>
                <BreadcrumbItem>
                  <Link to={item.url}>
                    <BreadcrumbPage>{item.title}</BreadcrumbPage>
                  </Link>
                </BreadcrumbItem>
                {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}

const breadcrumbsMap: Record<string, string> = {
  files: "Files",
  settings: "Settings",
  profile: "Profile"
};

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
