const fs = require("fs");
const path = require("path");
const seoData = require("./dev-toolbox/seo-data");
require("dotenv").config();

const baseUrl = new URL(process.env.BASE_PATH, process.env.HOST_URL).href;

function generateSitemap(toolList, baseUrl) {
  const urls = Object.entries(toolList).map(([toolName, toolData]) => {
    return `<url>
      <loc>${baseUrl}/${toolData.path}</loc>
    </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.join("")}
  </urlset>`;
}

const sitemap = generateSitemap(seoData, baseUrl);

fs.writeFileSync(path.join(__dirname, "../public", "sitemap.xml"), sitemap);

console.log("sitemap.xml generated successfully");
