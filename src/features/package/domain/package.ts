import type { Service } from "@/features/content/domain/content";
import type { MotionTier } from "@/features/motion/domain/tier";

export type ServiceVideo = NonNullable<Service["video"]>;

export interface FeaturedPackage {
  service: Service;
  catalogUrl: string;
  video: ServiceVideo & { loop: string };
}

/** The featured section exists only when a service has a catalog listing AND a video with a loop. */
export function featuredPackage(services: Service[]): FeaturedPackage | null {
  for (const service of services) {
    const { catalogUrl, video } = service;
    if (catalogUrl && video?.loop) return { service, catalogUrl, video: { ...video, loop: video.loop } };
  }
  return null;
}

export interface TierCopy {
  name: string;
  items: string[];
}

/** Tiers are cumulative: every tier after the first reads "plus ...". */
export function tierRows(tiers: TierCopy[], plus: string): Array<{ name: string; summary: string }> {
  return tiers.map((t, i) => ({ name: t.name, summary: i === 0 ? t.items.join(", ") : `${plus} ${t.items.join(", ")}` }));
}

export interface PreviewPolicy {
  /** A looping <video>, or just the poster image. */
  render: "video" | "poster";
  /** Show a play/pause button (the visitor starts it). */
  control: boolean;
  /** Should the video be playing right now. */
  play: boolean;
}

/** full: autoplay while in view. calm: poster + play button. static: poster only. */
export function previewPolicy(tier: MotionTier, inView: boolean): PreviewPolicy {
  switch (tier) {
    case "full":
      return { render: "video", control: false, play: inView };
    case "calm":
      return { render: "video", control: true, play: false };
    case "static":
      return { render: "poster", control: false, play: false };
  }
}
