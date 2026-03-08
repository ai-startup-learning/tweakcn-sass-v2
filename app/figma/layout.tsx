import { siteConfig } from "@/config/site";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply Your SaaS Kit Theme to Shadcraft Figma UI Kit | Professional Design System",
  description:
    "Transform your SaaS Kit themes into stunning Figma designs with Shadcraft's premium UI kit. 51 components, 44 blocks, dark mode support, and 1500+ icons. Professional Figma design system for shadcn/ui themes.",
  keywords:
    "figma ui kit, shadcn ui figma, SaaS Kit themes, figma design system, ui components figma, design tokens figma, figma plugin, shadcraft, figma templates, design system integration",
  authors: [{ name: siteConfig.creator }],
  openGraph: {
    title: "Apply Your SaaS Kit Theme to Shadcraft Figma UI Kit",
    description:
      "Professional Figma UI kit with 51 components, 44 blocks, and seamless SaaS Kit theme integration. Get the ultimate design system for your projects.",
    url: `${siteConfig.url}/figma`,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/figma-onboarding/shadcraft-preview.jpg`,
        width: 1200,
        height: 630,
        alt: "Shadcraft Figma UI Kit Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Apply Your SaaS Kit Theme to Shadcraft Figma UI Kit",
    description:
      "Professional Figma UI kit with 51 components, 44 blocks, and seamless SaaS Kit theme integration.",
    images: [`${siteConfig.url}/figma-onboarding/shadcraft-preview.jpg`],
  },
  robots: "index, follow",
  alternates: {
    canonical: `${siteConfig.url}/figma`,
  },
};

export default function FigmaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
