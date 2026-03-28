import Image from "next/image";
import { Callout } from "./callout";
import { CodeBlock } from "./code-block";
import { ImageGallery } from "./image-gallery";
import { VideoEmbed } from "./video-embed";
import { Quote } from "./quote";
import { ComparisonTable } from "./comparison-table";
import { AuthorCard } from "./author-card";
import { StepList, Step } from "./step-list";
import { FeatureHighlight } from "./feature-highlight";

export const mdxComponents = {
  // Custom blog components
  Callout,
  ImageGallery,
  VideoEmbed,
  Quote,
  ComparisonTable,
  AuthorCard,
  StepList,
  Step,
  FeatureHighlight,

  // Override default HTML elements
  pre: (props: React.ComponentPropsWithoutRef<"pre">) => (
    <CodeBlock {...props} />
  ),
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <Image
      src={(props.src as string) ?? ""}
      alt={props.alt ?? ""}
      width={800}
      height={450}
      className="rounded-xl border border-[oklch(1_0_0/8%)] my-6 w-full h-auto"
    />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isExternal =
      props.href?.startsWith("http") || props.href?.startsWith("//");
    return (
      <a
        {...props}
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      />
    );
  },
};
