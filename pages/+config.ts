import type { Config } from "vike/types";
import vikePhoton from "vike-photon/config";
import vikeReact from "vike-react/config";

export default {
  extends: [vikeReact, vikePhoton],
  title: "Focal Point Editor",
  ssr: process.env.E2E !== "true",
} satisfies Config;
