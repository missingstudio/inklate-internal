"use client";

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@inklate/ui/sidebar";
import { OrganizationSwitcher } from "./organization-switcher";
import { useOrganizations } from "~/hooks/use-organizations";
import { IconHelp, IconSettings } from "@tabler/icons-react";
import { NavMain } from "~/components/sidebar/nav-main";
import { useSession } from "~/lib/auth-client";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import * as React from "react";

const data = {
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
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
        <NavMain />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={session?.user as any} />
      </SidebarFooter>
    </Sidebar>
  );
}
