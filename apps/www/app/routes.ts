import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("layout.tsx", [index("page.tsx")]),
  layout("(full-width)/layout.tsx", [
    route("terms", "(full-width)/terms.tsx"),
    route("privacy", "(full-width)/privacy.tsx")
  ])
] satisfies RouteConfig;
