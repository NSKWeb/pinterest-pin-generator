import { MetadataRoute } from "next";

const baseUrl = "https://multitool.example.com";

const pages = [
  "",
  "/asphalt-calculator",
  "/car-speed-test",
  "/flight-speed-estimator",
  "/one-rep-max",
  "/sat-score-estimator",
  "/couple-name-generator",
  "/headcanon-generator",
  "/surname-generator",
  "/about-us",
  "/privacy-policy",
  "/disclaimer",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: page === "" ? 1 : 0.8,
    alternates: {
      languages: {
        en: `${baseUrl}${page}`,
      },
    },
  }));
}
