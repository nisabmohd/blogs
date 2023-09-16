import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import path from "path";
import { promises as fs } from "fs";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrism from "rehype-prism-plus";

type MDXFrontmatter = {
  title: string;
  slug: string;
  description: string;
  author: string;
  published: number;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getAllMetaData() {
  const contentDir = path.join(process.cwd(), "src/content");
  const files = await fs.readdir(contentDir);
  const result = Promise.all(
    files.map(async (file) => {
      const fileContent = await fs.readFile(contentDir + `/${file}`, "utf8");
      const { frontmatter } = await compileMDX<MDXFrontmatter>({
        source: fileContent,
        options: {
          parseFrontmatter: true,
        },
      });
      return frontmatter;
    })
  );
  (await result).sort((a, b) => b.published - a.published);
  return result;
}

export async function readMDX(slug: string) {
  const contentDir = path.join(process.cwd(), "src/content");
  const files = await fs.readdir(contentDir);
  const result = Promise.all(
    files.map(async (file) => {
      const fileContent = await fs.readFile(contentDir + `/${file}`, "utf8");
      const parsed = await compileMDX<MDXFrontmatter>({
        source: fileContent,
        options: {
          parseFrontmatter: true,
          mdxOptions: {
            rehypePlugins: [rehypePrism],
            remarkPlugins: [remarkGfm],
          },
        },
      });
      return parsed;
    })
  );
  return (await result).find((item) => item.frontmatter.slug == slug);
}
