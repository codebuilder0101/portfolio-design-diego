import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Diego Ferreira dos Santos",
    short_name: "Diego Ferreira",
    description: "Edição sênior de foto, imagem e vídeo · Criação visual com IA",
    lang: "pt-BR",
    start_url: "/",
    display: "browser",
    background_color: "#f6f2ea",
    theme_color: "#f6f2ea",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
