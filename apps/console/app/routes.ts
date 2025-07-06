import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
  route("signin", "(auth)/signin/page.tsx"),
  route("signup", "(auth)/signup/page.tsx"),
  route("verify-email", "(auth)/verify-email/page.tsx"),
  route("forget-password", "(auth)/forget-password/page.tsx"),
  route("reset-password", "(auth)/reset-password/page.tsx"),
  route("accept-invitation/:id", "(auth)/accept-invitation/[id]/page.tsx"),
  route("create-organization", "(dashboard)/create-organization/page.tsx"),

  layout("(dashboard)/layout.tsx", [
    layout("(dashboard)/canvas/layout.tsx", [
      index("(dashboard)/canvas/page.tsx"),
      ...prefix("canvas", [
        route("new", "(dashboard)/canvas/new-canvas.tsx"),
        route(":canvasId", "(dashboard)/canvas/[canvasId]/page.tsx")
      ])
    ]),
    layout(
      "(dashboard)/settings/layout.tsx",
      prefix("settings", [index("(dashboard)/settings/page.tsx")])
    )
  ]),

  layout("(full-width)/layout.tsx", [
    route("terms", "(full-width)/terms.tsx"),
    route("privacy", "(full-width)/privacy.tsx")
  ])
] satisfies RouteConfig;
