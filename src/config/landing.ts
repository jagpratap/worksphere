import type { LucideIcon } from "lucide-react";

import {
  Atom,
  Briefcase,
  Clock,
  Component,
  Database,
  FileCode,
  FolderKanban,
  FolderPlus,
  FormInput,
  Globe,
  GripVertical,
  Kanban,
  Paintbrush,
  RefreshCw,
  Rocket,
  Route,
  Shield,
  ShieldCheck,
  User,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";

// ── Types ───────────────────────────────────────────────────────────────────

export type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
};

export type SocialProofStat = {
  value: string;
  label: string;
};

export type HowItWorksStep = {
  step: number;
  icon: LucideIcon;
  title: string;
  description: string;
};

export type RoleCard = {
  role: string;
  icon: LucideIcon;
  description: string;
  capabilities: string[];
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  initials: string;
};

export type PricingTier = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
  badge?: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type TechStackItem = {
  name: string;
  icon: LucideIcon;
};

export type FooterLinkGroup = {
  title: string;
  links: string[];
};

// ── Data ────────────────────────────────────────────────────────────────────

export const FEATURES: Feature[] = [
  {
    icon: FolderKanban,
    title: "Project Management",
    description:
      "Create and manage projects with team members, statuses, and detailed overviews.",
    iconBg: "bg-blue-100 dark:bg-blue-950",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: Kanban,
    title: "Kanban Board",
    description:
      "Drag-and-drop task management with real-time status updates across columns.",
    iconBg: "bg-purple-100 dark:bg-purple-950",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    icon: Zap,
    title: "Sprint Planning",
    description:
      "Time-boxed iterations with goals, progress tracking, and completion stats.",
    iconBg: "bg-amber-100 dark:bg-amber-950",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    icon: Clock,
    title: "Time Tracking",
    description:
      "Log hours against tasks with daily and weekly summaries at a glance.",
    iconBg: "bg-emerald-100 dark:bg-emerald-950",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: Users,
    title: "Team Workload",
    description:
      "Visualize task distribution across team members with status breakdowns.",
    iconBg: "bg-rose-100 dark:bg-rose-950",
    iconColor: "text-rose-600 dark:text-rose-400",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description:
      "Admin, Manager, and Member roles with granular permission controls.",
    iconBg: "bg-indigo-100 dark:bg-indigo-950",
    iconColor: "text-indigo-600 dark:text-indigo-400",
  },
];

export const SOCIAL_PROOF_STATS: SocialProofStat[] = [
  { value: "500+", label: "Teams Using WorkSphere" },
  { value: "10,000+", label: "Tasks Managed" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "4.9/5", label: "User Satisfaction" },
];

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    step: 1,
    icon: UserPlus,
    title: "Sign Up",
    description:
      "Create your account in seconds. Pick a role and explore the full demo with pre-loaded data.",
  },
  {
    step: 2,
    icon: FolderPlus,
    title: "Create a Project",
    description:
      "Set up your first project, invite team members, and organize your backlog on the kanban board.",
  },
  {
    step: 3,
    icon: Rocket,
    title: "Ship Faster",
    description:
      "Plan sprints, track time, and monitor workload. Everything you need to deliver on schedule.",
  },
];

export const ROLE_CARDS: RoleCard[] = [
  {
    role: "Admin",
    icon: ShieldCheck,
    description: "Full platform control with system-wide visibility.",
    capabilities: [
      "Manage all users and roles",
      "Access billing and audit logs",
      "View all projects and workload",
      "System-wide dashboard analytics",
    ],
  },
  {
    role: "Manager",
    icon: Briefcase,
    description: "Lead projects and coordinate team delivery.",
    capabilities: [
      "Create and manage projects",
      "Plan sprints and set goals",
      "Monitor team workload",
      "Assign tasks and members",
    ],
  },
  {
    role: "Member",
    icon: User,
    description: "Focus on your tasks and track your time.",
    capabilities: [
      "View assigned tasks",
      "Update task status via kanban",
      "Log time against tasks",
      "Manage personal profile",
    ],
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "WorkSphere replaced three different tools for our team. The kanban board and sprint planning are exactly what we needed.",
    name: "Sarah Chen",
    role: "Engineering Manager",
    company: "TechFlow Inc.",
    initials: "SC",
  },
  {
    quote:
      "The role-based access is a game changer. My team only sees what they need, and I get the full picture as a manager.",
    name: "Marcus Johnson",
    role: "Product Lead",
    company: "BuildRight Co.",
    initials: "MJ",
  },
  {
    quote:
      "We onboarded our entire team in under an hour. The interface is clean and intuitive — no training needed.",
    name: "Priya Patel",
    role: "Startup Founder",
    company: "LaunchPad Labs",
    initials: "PP",
  },
  {
    quote:
      "Time tracking integrated directly into the task workflow saves us hours every week on reporting.",
    name: "David Kim",
    role: "Senior Developer",
    company: "CodeCraft Studio",
    initials: "DK",
  },
];

export const PRICING_TIERS: PricingTier[] = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "For individuals and small teams getting started.",
    features: [
      "Up to 3 projects",
      "5 team members",
      "Basic kanban board",
      "Time tracking",
      "Community support",
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "per user / month",
    description: "For growing teams that need more power.",
    features: [
      "Unlimited projects",
      "Unlimited members",
      "Sprint planning",
      "Workload management",
      "Advanced analytics",
      "Priority support",
    ],
    cta: "Start Free Trial",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    price: "$39",
    period: "per user / month",
    description: "For organizations with advanced needs.",
    features: [
      "Everything in Pro",
      "SSO & SAML",
      "Audit logs",
      "Custom roles",
      "API access",
      "Dedicated account manager",
      "99.99% uptime SLA",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Is WorkSphere really free to use?",
    answer:
      "Yes! This is a fully functional demo that runs entirely in your browser. No server, no payment, no sign-up required. All data is stored in localStorage and resets when you clear your browser data.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "You can sign in with any of the pre-configured test accounts to explore different roles (Admin, Manager, Member). You can also create a new account — it will be stored locally in your browser.",
  },
  {
    question: "Where is my data stored?",
    answer:
      "All data lives in your browser using MSW (Mock Service Worker) and localStorage. Nothing is sent to any server. Your data persists across page refreshes but will be lost if you clear your browser data.",
  },
  {
    question: "Can I use this for my real projects?",
    answer:
      "WorkSphere is a demo/portfolio project showcasing modern React architecture. It's not intended for production use. However, the patterns and code are open-source and can serve as reference for building your own tool.",
  },
  {
    question: "What technologies power WorkSphere?",
    answer:
      "WorkSphere is built with React 19, TypeScript, Vite, Redux Toolkit with RTK Query, React Router v7, Tailwind CSS v4, shadcn/ui, React Hook Form, Zod, dnd-kit for drag-and-drop, and MSW for API mocking.",
  },
  {
    question: "How do the different roles work?",
    answer:
      "Admin has full system access including user management and audit logs. Manager can create projects, plan sprints, and monitor team workload. Member focuses on their assigned tasks and time tracking. Each role sees a tailored sidebar and dashboard.",
  },
  {
    question: "Can I reset the demo data?",
    answer:
      "Yes! Clear your browser's localStorage for this site, or open the developer console and clear storage. This resets all users, projects, tasks, sprints, and time entries to their defaults.",
  },
  {
    question: "Is this open source?",
    answer:
      "Yes, WorkSphere is fully open-source. You can view the source code, learn from the architecture decisions, and use the patterns in your own projects.",
  },
];

export const TECH_STACK: TechStackItem[] = [
  { name: "React 19", icon: Atom },
  { name: "TypeScript", icon: FileCode },
  { name: "Vite", icon: Zap },
  { name: "Redux Toolkit", icon: Database },
  { name: "RTK Query", icon: RefreshCw },
  { name: "React Router v7", icon: Route },
  { name: "Tailwind CSS v4", icon: Paintbrush },
  { name: "shadcn/ui", icon: Component },
  { name: "React Hook Form", icon: FormInput },
  { name: "Zod", icon: ShieldCheck },
  { name: "dnd-kit", icon: GripVertical },
  { name: "MSW 2.x", icon: Globe },
];

export const FOOTER_LINKS: FooterLinkGroup[] = [
  {
    title: "Product",
    links: ["Features", "Pricing", "Roadmap", "Changelog"],
  },
  {
    title: "Resources",
    links: ["Documentation", "API Reference", "Guides", "Blog"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Contact", "Press"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
  },
];
