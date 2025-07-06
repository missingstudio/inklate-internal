"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@inklate/ui/sidebar";
import { IconFileStack, IconHelp, IconInnerShadowTop, IconSettings } from "@tabler/icons-react";
import { OrganizationSwitcher } from "./organization-switcher";
import { useOrganizations } from "~/hooks/use-organizations";
import { NavMain } from "~/components/sidebar/nav-main";
import { useSession } from "~/lib/auth-client";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import { Link } from "react-router";
import * as React from "react";

const data = {
  user: {
    name: "Praveen Yadav",
    email: "pyadav@gmail.com",
    avatar: "/images/icon.png"
  },
  navMain: [
    {
      title: "My files",
      url: "#",
      icon: IconFileStack
    }
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp
    }
  ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { organizations, activeOrganization, setActiveOrganization } = useOrganizations();
  const { data: session } = useSession();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <OrganizationSwitcher
          organizations={organizations}
          activeOrganization={activeOrganization}
          setActiveOrganization={setActiveOrganization}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={session?.user as any} />
      </SidebarFooter>
    </Sidebar>
  );
}
