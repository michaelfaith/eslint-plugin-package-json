import { OGImageRoute } from "astro-og-canvas";
import { getCollection } from "astro:content";

const paths = await getCollection("docs");
const pages = Object.fromEntries(
  paths.map(({ data, id }) => {
    return [id, { data }] as const;
  }),
);

export const { GET, getStaticPaths } = await OGImageRoute({
  getImageOptions: (_, { data }) => ({
    bgGradient: [
      [30, 30, 46],
      [30, 30, 46],
    ],
    description: data.description,
    font: {
      description: {
        color: [205, 214, 244],
      },
      title: {
        color: [203, 166, 247],
      },
    },

    format: "WEBP",
    logo: {
      path: "./site/src/assets/logo/logo-dark.png",
      size: [228],
    },
    title: data.title,
  }),
  pages,
  param: "path",
});
