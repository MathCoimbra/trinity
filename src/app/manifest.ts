import type { MetadataRoute } from "next";
import { getStoreInfo } from "@/lib/catalog/repository";

export default function manifest(): MetadataRoute.Manifest {
  const store = getStoreInfo();
  return {
    name: store.name,
    short_name: "Trinity",
    description: store.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0b",
    theme_color: "#0a0a0b",
    lang: "pt-BR",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/apple-icon.png", type: "image/png", sizes: "180x180" },
    ],
  };
}
