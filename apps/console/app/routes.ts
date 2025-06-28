import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  index("page.tsx"),
  layout("(full-width)/layout.tsx", [
    route("terms", "(full-width)/terms.tsx"),
    route("privacy", "(full-width)/privacy.tsx")
  ]),

  route("signin", "(auth)/signin/page.tsx"),
  route("signup", "(auth)/signup/page.tsx"),
  route("verify-email", "(auth)/verify-email/page.tsx")
] satisfies RouteConfig;
