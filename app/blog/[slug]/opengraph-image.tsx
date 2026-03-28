import { ImageResponse } from "next/og";
import { getPostBySlug, getAllPosts } from "@/lib/blog";

export const alt = "Blog post preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  const title = post?.title ?? "Trinity AI Labs Blog";
  const category = post?.category ?? "Blog";
  const author = post?.author.name ?? "Trinity AI Labs";
  const date = post
    ? new Date(post.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "60px 80px",
        background: "#1a1a1a",
        fontFamily: "sans-serif",
      }}
    >
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "-0.02em",
          }}
        >
          trinity
        </div>
        <div
          style={{
            width: "1px",
            height: "20px",
            background: "rgba(255,255,255,0.2)",
          }}
        />
        <div
          style={{
            fontSize: "14px",
            color: "rgba(255,255,255,0.5)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Blog
        </div>
      </div>

      {/* Content */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Category badge */}
        <div
          style={{
            display: "flex",
            fontSize: "13px",
            fontWeight: 600,
            color: "#34d399",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          {category}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: title.length > 60 ? "40px" : "48px",
            fontWeight: 800,
            color: "#fff",
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            maxWidth: "900px",
          }}
        >
          {title}
        </div>

        {/* Gradient line */}
        <div
          style={{
            width: "80px",
            height: "4px",
            borderRadius: "2px",
            background: "linear-gradient(to right, #10b981, #06b6d4)",
          }}
        />
      </div>

      {/* Bottom */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          fontSize: "15px",
          color: "rgba(255,255,255,0.5)",
        }}
      >
        <span style={{ color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>
          {author}
        </span>
        {date && (
          <>
            <span>·</span>
            <span>{date}</span>
          </>
        )}
      </div>
    </div>,
    { ...size },
  );
}
