import {
  IconArrowLeft,
  IconCreditCard,
  IconDashboard,
  IconSettings,
  IconUser,
  IconUsers
} from "@tabler/icons-react";

interface NavSection {
  title: string;
  items: NavItem[];
}

interface NavItem {
  id?: string;
  title: string;
  url: string;
  icon?: React.ComponentType<any>;
  isBackButton?: boolean;
  disabled?: boolean;
  shortcut?: string;
}

interface NavConfig {
  path: string;
  sections: NavSection[];
}

export const navigationConfig: Record<string, NavConfig> = {
  canvas: {
    path: "/canvas",
    sections: [
      {
        title: "Core",
        items: [
          {
            title: "My files",
            url: "/",
            icon: IconDashboard,
            shortcut: "⌘D"
          }
        ]
      },
      {
        title: "Manage",
        items: [
          {
            title: "Members",
            url: "/settings/members",
            icon: IconUsers,
            shortcut: "⌘M"
          },
          {
            title: "Billing",
            url: "/settings/billing",
            icon: IconCreditCard,
            shortcut: "⌘B"
          }
        ]
      }
    ]
  },

  settings: {
    path: "/settings",
    sections: [
      {
        title: "Core",
        items: [
          {
            title: "Back",
            url: "/",
            icon: IconArrowLeft,
            isBackButton: true
          },
          {
            title: "Personal",
            url: "/",
            icon: IconUser,
            shortcut: "⌘P"
          }
        ]
      },
      {
        title: "Manage",
        items: [
          {
            title: "Members",
            url: "/settings/members",
            icon: IconUsers,
            shortcut: "⌘M"
          },
          {
            title: "Billing",
            url: "/settings/billing",
            icon: IconCreditCard,
            shortcut: "⌘B"
          }
        ]
      }
    ]
  }
};
