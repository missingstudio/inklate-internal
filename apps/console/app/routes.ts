import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("layout.tsx", [
    index("page.tsx"),
    route("canvas", "(dashboard)/canvas/page.tsx"),
    route("canvas/new", "(dashboard)/canvas/new-canvas.tsx"),
    route("canvas/:canvasId", "(dashboard)/canvas/[canvasId]/page.tsx")
  ]),

  route("signin", "(auth)/signin/page.tsx"),
  route("signup", "(auth)/signup/page.tsx"),
  route("verify-email", "(auth)/verify-email/page.tsx"),
  route("forget-password", "(auth)/forget-password/page.tsx"),
  route("reset-password", "(auth)/reset-password/page.tsx"),
  route("accept-invitation/:id", "(auth)/accept-invitation/[id]/page.tsx"),

  layout("(full-width)/layout.tsx", [
    route("terms", "(full-width)/terms.tsx"),
    route("privacy", "(full-width)/privacy.tsx")
  ])
] satisfies RouteConfig;
