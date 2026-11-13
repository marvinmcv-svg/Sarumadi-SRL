import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: "Sarumadi",
    description: "Herramientas, cerrajería, grifería y más en Santa Cruz, Bolivia.",
    lang: "es-BO",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f1ec",
    theme_color: "#14171a",
    icons: [{ src: "/brand/icon.png", sizes: "270x270", type: "image/png" }],
  };
}
