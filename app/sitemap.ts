import { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://stackaudit.app", lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: "https://stackaudit.app/audit", lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: "https://stackaudit.app/audit/sample", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://stackaudit.app/resources", lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
  ]
}
