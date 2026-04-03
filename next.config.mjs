import mdx from "@next/mdx";

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {},
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  transpilePackages: ["next-mdx-remote"],
  outputFileTracingIncludes: {
    "/api/routes/stream-response": [
      "src/app/blog/posts/**/*",
      "src/app/projects/content/**/*",
      "public/resume-context.md",
    ],
  },
};

export default withMDX(nextConfig);
