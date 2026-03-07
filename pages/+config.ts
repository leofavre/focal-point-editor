import type { Config } from "vike/types";
import vikeReact from "vike-react/config";

export default {
  extends: [vikeReact],
  title: "Focal Point Editor",
  ssr: false, // process.env.E2E !== "true",
} satisfies Config;
