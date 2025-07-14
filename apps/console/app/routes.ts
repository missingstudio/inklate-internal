import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
  route("login", "(auth)/login/page.tsx"),
  route("signup", "(auth)/signup/page.tsx"),
  route("verify-email", "(auth)/verify-email/page.tsx"),
  route("forget-password", "(auth)/forget-password/page.tsx"),
  route("reset-password", "(auth)/reset-password/page.tsx"),
  route("accept-invitation/:id", "(auth)/accept-invitation/[id]/page.tsx"),
  route("create-organization", "(dashboard)/create-organization/page.tsx"),

  layout("(dashboard)/layout.tsx", [
    index("(dashboard)/files/home.tsx"),
    layout("(dashboard)/files/layout.tsx", [
      ...prefix("files", [
        index("(dashboard)/files/page.tsx"),
        route("new", "(dashboard)/files/new-file.tsx"),
        route(":fileId", "(dashboard)/files/[fileId]/page.tsx")
      ])
    ]),
    layout(
      "(dashboard)/settings/layout.tsx",
      prefix("settings", [
        index("(dashboard)/settings/page.tsx"),

        // Account Settings
        route("profile", "(dashboard)/settings/profile/page.tsx")
      ])
    )
  ]),

  layout("(full-width)/layout.tsx", [
    route("terms", "(full-width)/terms.tsx"),
    route("privacy", "(full-width)/privacy.tsx")
  ])
] satisfies RouteConfig;
