import type { GetStaticPathsOptions } from "astro";

import { getStaticPaths } from "../pages/og/[...path]";

const routes = await getStaticPaths({} as GetStaticPathsOptions);

const paths = new Set(routes.map(({ params }) => params.path));

export function getOpenGraphImageUrl(path: string) {
  const normalizedPath = path.replace(/^\//, "").replace(/\/$/, "");

  const ogPath = `${normalizedPath}.png`;
  return paths.has(ogPath) ? `/og/${ogPath}` : "images/social.png";
}
