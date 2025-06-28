import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  index("page.tsx"),
  layout("(full-width)/layout.tsx", [
    route("terms", "(full-width)/terms.tsx"),
    route("privacy", "(full-width)/privacy.tsx")
  ]),

  route("login", "(auth)/login/page.tsx")
] satisfies RouteConfig;
