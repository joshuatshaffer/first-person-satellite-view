import type { Config } from "vike/types";

export default {
  // The first person sky view uses many browser APIs and very little can be
  // server-rendered anyway.
  ssr: false,
} satisfies Config;
