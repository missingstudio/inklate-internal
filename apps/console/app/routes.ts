import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("layout.tsx", [index("page.tsx")]),

  route("signin", "(auth)/signin/page.tsx"),
  route("signup", "(auth)/signup/page.tsx"),
  route("verify-email", "(auth)/verify-email/page.tsx"),

  layout("(full-width)/layout.tsx", [
    route("terms", "(full-width)/terms.tsx"),
    route("privacy", "(full-width)/privacy.tsx")
  ]),

  layout("(dashboard)/canvas/layout.tsx", [
    route("canvas", "(dashboard)/canvas/page.tsx"),
    route("canvas/:canvasId", "(dashboard)/canvas/[canvasId]/page.tsx")
  ])
] satisfies RouteConfig;
