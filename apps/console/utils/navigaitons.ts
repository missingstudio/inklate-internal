import {
  IconArrowLeft,
  IconCreditCard,
  IconDashboard,
  IconUser,
  IconUsers,
  IconMail
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
  files: {
    path: "/files",
    sections: [
      {
        title: "Home",
        items: [
          {
            title: "My files",
            url: "/files",
            icon: IconDashboard,
            shortcut: "⌘D"
          }
        ]
      }
    ]
  },

  settings: {
    path: "/settings",
    sections: [
      {
        title: "Navigation",
        items: [
          {
            title: "Back to files",
            url: "/",
            icon: IconArrowLeft,
            isBackButton: true,
            shortcut: "⌘←"
          }
        ]
      },
      {
        title: "Account",
        items: [
          {
            title: "Profile",
            url: "/settings/profile",
            icon: IconUser,
            shortcut: "⌘P"
          }
        ]
      }
    ]
  }
};
