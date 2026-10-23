import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Alexis — Your study companion",
    short_name: "Alexis",
    description: "Learn deeper, not harder. Your personal study companion.",
    start_url: "/",
    display: "standalone",
    background_color: "#F6F4EC",
    theme_color: "#09231B",
    icons: [
      {
        src: "/brand/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
