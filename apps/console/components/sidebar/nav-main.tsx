"use client";

import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@inklate/ui/sidebar";
import { useNavigate, useLocation } from "react-router";
import { navigationConfig } from "~/utils/navigaitons";
import { useMemo } from "react";

export function NavMain() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { currentSection, navItems } = useMemo(() => {
    // Find which section we're in based on the pathname
    const section = Object.entries(navigationConfig).find(([, config]) =>
      pathname.startsWith(config.path)
    );

    const currentSection = section?.[0] || "files";
    if (navigationConfig[currentSection]) {
      const items = [...navigationConfig[currentSection].sections];
      return { currentSection, navItems: items };
    } else {
      return {
        currentSection: "",
        navItems: []
      };
    }
  }, [pathname]);

  const showCreateButton = currentSection === "files";
  return (
    <>
      {showCreateButton && (
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="flex items-center gap-2">
                <SidebarMenuButton
                  tooltip="Create new file"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 cursor-pointer duration-200 ease-linear"
                  onClick={() => navigate("/files/new")}
                >
                  <IconCirclePlusFilled />
                  <span>Create new file</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      )}
      {navItems.map((section) => (
        <SidebarGroup key={section.title}>
          <SidebarGroupLabel className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            {section.title}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {section.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className="cursor-pointer"
                    isActive={pathname === item.url}
                    onClick={() => navigate(item.url)}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}
