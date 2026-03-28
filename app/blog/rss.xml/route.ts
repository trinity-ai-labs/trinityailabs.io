import { Feed } from "feed";
import { getAllPosts } from "@/lib/blog";

const BASE_URL = "https://trinityailabs.com";

export async function GET() {
  const posts = getAllPosts();

  const feed = new Feed({
    title: "Trinity AI Labs Blog",
    description:
      "Insights on AI-powered development, autonomous coding agents, and shipping software faster.",
    id: `${BASE_URL}/blog`,
    link: `${BASE_URL}/blog`,
    language: "en",
    image: `${BASE_URL}/logo.png`,
    copyright: `${new Date().getFullYear()} Trinity AI Labs`,
    feedLinks: {
      rss: `${BASE_URL}/blog/rss.xml`,
    },
    author: {
      name: "Trinity AI Labs",
      link: BASE_URL,
    },
  });

  for (const post of posts) {
    feed.addItem({
      title: post.title,
      id: `${BASE_URL}/blog/${post.slug}`,
      link: `${BASE_URL}/blog/${post.slug}`,
      description: post.description,
      date: new Date(post.date),
      author: [{ name: post.author.name }],
      category: [{ name: post.category }],
    });
  }

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
