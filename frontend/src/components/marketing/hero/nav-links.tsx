import React from "react";
import {
  GlobeIcon,
  LayersIcon,
  BarChart3Icon,
  PlugIcon,
  CodeIcon,
  UsersIcon,
  BookOpenIcon,
  MailIcon,
  HelpCircleIcon,
  ShieldCheckIcon,
  StarIcon,
} from "lucide-react";

export type LinkItemType = {
  label: string;
  href: string;
  icon: React.ReactNode;
  description?: string;
};

// Main Product Dropdown Links
export const productLinks: LinkItemType[] = [
  {
    label: "Website Builder",
    href: "/products/builder",
    description: "Create responsive websites with ease",
    icon: <GlobeIcon />,
  },
  {
    label: "Cloud Platform",
    href: "/products/cloud",
    description: "Deploy and scale apps in the cloud",
    icon: <LayersIcon />,
  },
  {
    label: "Analytics",
    href: "/products/analytics",
    description: "Track and analyze your traffic",
    icon: <BarChart3Icon />,
  },
  {
    label: "Integrations",
    href: "/products/integrations",
    description: "Connect your favorite tools and services",
    icon: <PlugIcon />,
  },
  {
    label: "API",
    href: "/products/api",
    description: "Build custom integrations with our API",
    icon: <CodeIcon />,
  },
];

// Company Dropdown Links
export const companyLinks: LinkItemType[] = [
  {
    label: "About Us",
    href: "/about",
    description: "Learn more about our mission and team",
    icon: <UsersIcon />,
  },
  {
    label: "Customer Stories",
    href: "/customers",
    description: "See how we help our clients succeed",
    icon: <StarIcon />,
  },
  {
    label: "Contact",
    href: "/contact",
    description: "Get in touch with our sales & support team",
    icon: <MailIcon />,
  },
];

// Resources / Secondary Links
export const resourceLinks: LinkItemType[] = [
  {
    label: "Blog",
    href: "/blog",
    description: "Latest insights, news, and updates",
    icon: <BookOpenIcon />,
  },
  {
    label: "Help Center",
    href: "/help",
    description: "Documentation, FAQs, and guides",
    icon: <HelpCircleIcon />,
  },
  {
    label: "Privacy Policy",
    href: "/privacy",
    description: "How we manage and protect your data",
    icon: <ShieldCheckIcon />,
  },
];