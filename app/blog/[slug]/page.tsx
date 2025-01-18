import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache, PropsWithChildren } from "react";
import { getAllBlogs, getBlogFromSlug } from "~/lib/markdown";

const getBlogFromSlugCache = cache(getBlogFromSlug);

export default async function BlogPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;

  const { slug } = params;

  const res = await getBlogFromSlugCache(slug);
  if (!res) notFound();
  const { content } = res;
  return (
    <>
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold">{res.frontmatter.title}</h2>
        <p className="text-sm text-neutral-800 dark:text-neutral-200 font-medium">
          {new Date(res.frontmatter.published).toDateString()}
        </p>
      </div>
      <Typography>{content}</Typography>
    </>
  );
}

function Typography({ children }: PropsWithChildren) {
  return (
    <div className="text-inherit prose prose-neutral dark:prose-invert dark:prose-pre:prose-code:bg-neutral-900 dark:prose-pre:bg-neutral-950 prose-pre:prose-code:bg-neutral-50 prose-pre:bg-neutral-50 prose-pre:font-mono prose-code:font-mono prose-code:font-medium underline-offset-2 prose-code:text-sm prose-code:leading-[1.625rem] dark:prose-code:text-white prose-code:text-black prose-code:py-[0.0991rem] prose-code:px-1.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none prose-img:rounded-md prose-img:border prose-pre:border dark:prose-pre:border-neutral-800 dark:prose-img:border-neutral-800 min-w-full">
      {children}
    </div>
  );
}

export async function generateStaticParams() {
  const blogs = await getAllBlogs();
  return blogs.map((blog) => ({
    slug: blog.frontmatter.slug,
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  const { slug } = params;

  const blog = await getBlogFromSlugCache(slug);
  if (!blog) return {};
  const ogImage = `https://nisabmohd.vercel.app/og?title=${encodeURIComponent(
    blog.frontmatter.title
  )}`;
  return {
    title: blog.frontmatter.title,
    description: blog.frontmatter.description,
    openGraph: {
      title: blog.frontmatter.title,
      description: blog.frontmatter.description,
      type: "article",
      publishedTime: new Date(blog.frontmatter.published).toDateString(),
      url: `https://nisabmohd.vercel.app/blog/${slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.frontmatter.title,
      description: blog.frontmatter.description,
      images: [ogImage],
    },
  };
}
