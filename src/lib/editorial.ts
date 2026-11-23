import heights from "../../data/heights.json" with { type: "json" };
import spaces from "../../data/spaces.json" with { type: "json" };
import guides from "../../data/guides.json" with { type: "json" };

export { heights, spaces, guides };

export type SlugPageProps = { params: Promise<{ slug: string }> };

export const sections = [
  { href: "/", label: "Calculator" },
  { href: "/desk-height-calculator", label: "Desk height" },
  { href: "/chair-fit-finder", label: "Chair fit" },
  { href: "/height", label: "By height" },
  { href: "/space", label: "Small spaces" },
  { href: "/guides", label: "Guides" },
];

export const trustPages = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/affiliate-disclosure", label: "Affiliate disclosure" },
  { href: "/privacy-policy", label: "Privacy policy" },
  { href: "/terms", label: "Terms" },
  { href: "/legal-disclaimer", label: "Sizing disclaimer" },
];

export const editorialPaths = [
  ...sections.map(({ href }) => href),
  ...trustPages.map(({ href }) => href),
  ...heights.map(({ slug }) => `/height/${slug}`),
  ...spaces.map(({ slug }) => `/space/${slug}`),
  ...guides.map(({ slug }) => `/guides/${slug}`),
];
