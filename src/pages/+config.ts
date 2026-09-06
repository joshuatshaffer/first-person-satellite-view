import vikeReact from "vike-react/config";
import type { Config } from "vike/types";

export default {
  title: "Satellite View 3D",
  extends: [vikeReact],
  // Reference the favicon of the host site to prevent requests to
  // `/favicon.ico`.
  favicon: "/images/favicon.png",
} satisfies Config;
