"use client";

import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
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
      location.pathname.startsWith(config.path)
    );

    const currentSection = section?.[0] || "canvas";
    if (navigationConfig[currentSection]) {
      const items = [...navigationConfig[currentSection].sections];
      return { currentSection, navItems: items };
    } else {
      return {
        currentSection: "",
        navItems: []
      };
    }
  }, [location.pathname]);

  const showCreateButton = currentSection === "canvas";
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {showCreateButton && (
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <SidebarMenuButton
                tooltip="Create new canvas"
                className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 cursor-pointer duration-200 ease-linear"
                onClick={() => navigate("/canvas/new")}
              >
                <IconCirclePlusFilled />
                <span>Create new canvas</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
        {navItems.map((section) => (
          <SidebarMenu key={section.title}>
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
        ))}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
