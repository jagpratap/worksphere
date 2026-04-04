import { ArrowRight, Check, ListChecks, Quote } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  FAQ_ITEMS,
  FEATURES,
  FOOTER_LINKS,
  HOW_IT_WORKS_STEPS,
  PRICING_TIERS,
  ROLE_CARDS,
  SOCIAL_PROOF_STATS,
  TECH_STACK,
  TESTIMONIALS,
} from "@/config/landing";
import { paths } from "@/config/paths";
import { ROLE_HOME_ROUTE } from "@/config/roles";
import { selectCurrentUserRole, selectIsAuthenticated } from "@/features/auth";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store";

// ── Motion helpers ──────────────────────────────────────────────────────────

const MotionCard = motion.create(Card);
const MotionButton = motion.create(Button);

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

const slideLeft = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0 },
};

const slideRight = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const staggerContainerFast = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

// ── Component ───────────────────────────────────────────────────────────────

export default function LandingRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const role = useAppSelector(selectCurrentUserRole);

  return (
    <main className="flex-1">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center gap-6 overflow-hidden px-page-x py-24 text-center">
        {/* Background decoration */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute inset-x-0 -top-20 h-[600px] bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,oklch(from_var(--primary)_l_c_h/0.12),oklch(from_var(--primary)_l_c_h/0.04)_60%,transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle,var(--muted-foreground)_0.75px,transparent_0.75px)] bg-size-[20px_20px] opacity-15" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-sm text-muted-foreground"
        >
          <ListChecks className="size-3.5" />
          Open-source project management demo
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-3xl text-5xl font-bold tracking-tight sm:text-6xl"
        >
          Manage projects,
          <br />
          <span className="text-primary">not chaos.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-lg text-lg text-muted-foreground"
        >
          A lightweight, role-based project management tool for teams that want
          clarity without the complexity. Built with React, TypeScript, and
          modern tooling.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {isAuthenticated && role
            ? (
                <Button size="lg" asChild>
                  <Link to={ROLE_HOME_ROUTE[role]}>
                    Go to Dashboard
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              )
            : (
                <div className="flex gap-3">
                  <MotionButton
                    size="lg"
                    asChild
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link to={paths.auth.signin.path}>
                      Try the Demo
                      <ArrowRight className="size-4" />
                    </Link>
                  </MotionButton>
                  <Button size="lg" variant="outline" asChild>
                    <Link to={paths.auth.signup.path}>Create Account</Link>
                  </Button>
                </div>
              )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-xs text-muted-foreground"
        >
          No server required — runs entirely in your browser with mock data
        </motion.p>

        {/* Dashboard Preview Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto mt-8 w-full max-w-5xl overflow-hidden rounded-xl border border-border/60 bg-card shadow-2xl ring-1 ring-black/5 dark:ring-white/10"
        >
          <div className="flex" style={{ aspectRatio: "16/10" }}>
            {/* Sidebar mock */}
            <div className="hidden w-14 shrink-0 border-r bg-muted/60 p-2 sm:block">
              <div className="mb-3 h-6 w-full rounded bg-primary/20" />
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-3 w-full rounded bg-muted-foreground/10" />
                ))}
              </div>
            </div>
            {/* Main area */}
            <div className="flex flex-1 flex-col">
              {/* Header mock */}
              <div className="flex h-8 items-center gap-3 border-b bg-muted/30 px-4">
                <div className="h-3 w-20 rounded bg-muted-foreground/15" />
                <div className="ml-auto h-3 w-12 rounded bg-muted-foreground/10" />
                <div className="h-5 w-5 rounded-full bg-muted-foreground/10" />
              </div>
              {/* Kanban columns */}
              <div className="grid flex-1 grid-cols-4 gap-3 p-4">
                {["bg-blue-500/20", "bg-amber-500/20", "bg-purple-500/20", "bg-emerald-500/20"].map(
                  (color, colIdx) => (
                    <div key={color} className="flex flex-col gap-2">
                      <div className={cn("h-2 w-16 rounded-full", color)} />
                      {Array.from({ length: 3 - (colIdx % 2) }, (_, k) => `${color}-card-${k}`).map(id => (
                        <div
                          key={id}
                          className="rounded-lg border bg-background p-2 shadow-sm"
                        >
                          <div className="mb-1.5 h-2 w-3/4 rounded bg-muted-foreground/15" />
                          <div className="h-1.5 w-1/2 rounded bg-muted-foreground/10" />
                        </div>
                      ))}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
          {/* Fade overlay */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-background to-transparent" />
        </motion.div>
      </section>

      {/* ── Social Proof ──────────────────────────────────────────────── */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="border-y bg-muted/30 px-page-x py-14"
      >
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 sm:grid-cols-4">
          {SOCIAL_PROOF_STATS.map(stat => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-center"
            >
              <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Features Grid ─────────────────────────────────────────────── */}
      <section id="features" className="scroll-mt-(--header-h) px-page-x py-20">
        <div className="mx-auto max-w-5xl">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="mb-2 text-center text-3xl font-semibold tracking-tight"
          >
            Everything you need to ship
          </motion.h2>
          <motion.p
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mb-12 max-w-prose text-center text-lg text-muted-foreground"
          >
            From backlog to done — plan, track, and deliver with your team.
          </motion.p>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {FEATURES.map(feature => (
              <MotionCard
                key={feature.title}
                variants={fadeUp}
                transition={{ duration: 0.5, ease: "easeOut" }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="border shadow-sm"
              >
                <CardContent className="pt-6">
                  <div
                    className={cn(
                      "mb-4 inline-flex size-10 items-center justify-center rounded-lg",
                      feature.iconBg,
                    )}
                  >
                    <feature.icon className={cn("size-5", feature.iconColor)} />
                  </div>
                  <h3 className="mb-1 font-medium">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </MotionCard>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Product Screenshots ───────────────────────────────────────── */}
      <section className="border-y bg-muted/30 px-page-x py-20">
        <div className="mx-auto max-w-5xl">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="mb-2 text-center text-3xl font-semibold tracking-tight"
          >
            See it in action
          </motion.h2>
          <motion.p
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mb-12 max-w-prose text-center text-lg text-muted-foreground"
          >
            A glimpse at the core views that power your workflow.
          </motion.p>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid gap-6 md:grid-cols-3"
          >
            {/* Kanban Preview */}
            <MotionCard
              variants={scaleUp}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className="flex flex-col overflow-hidden"
            >
              <CardContent className="flex flex-1 flex-col p-0">
                <div className="flex-1 bg-muted/40 p-4">
                  <div className="grid grid-cols-3 gap-2">
                    {["bg-blue-400/30", "bg-amber-400/30", "bg-emerald-400/30"].map(
                      (color, col) => (
                        <div key={color} className="space-y-2">
                          <div className={cn("h-1.5 w-10 rounded-full", color)} />
                          {Array.from({ length: 2 + col }, (_, k) => `${color}-row-${k}`).map(id => (
                            <div
                              key={id}
                              className="h-8 rounded border bg-background shadow-sm"
                            />
                          ))}
                        </div>
                      ),
                    )}
                  </div>
                </div>
                <div className="mt-auto p-4">
                  <h3 className="font-medium">Kanban Board</h3>
                  <p className="text-sm text-muted-foreground">
                    Drag and drop tasks across columns
                  </p>
                </div>
              </CardContent>
            </MotionCard>

            {/* Sprint Preview */}
            <MotionCard
              variants={scaleUp}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className="flex flex-col overflow-hidden"
            >
              <CardContent className="flex flex-1 flex-col p-0">
                <div className="flex-1 space-y-3 bg-muted/40 p-4">
                  {[75, 45, 90].map(width => (
                    <div key={width} className="space-y-1">
                      <div className="flex justify-between">
                        <div className="h-2 w-16 rounded bg-muted-foreground/15" />
                        <div className="h-2 w-6 rounded bg-muted-foreground/10" />
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary/50"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-auto p-4">
                  <h3 className="font-medium">Sprint Planning</h3>
                  <p className="text-sm text-muted-foreground">
                    Plan iterations with goals and deadlines
                  </p>
                </div>
              </CardContent>
            </MotionCard>

            {/* Time Tracking Preview */}
            <MotionCard
              variants={scaleUp}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className="flex flex-col overflow-hidden"
            >
              <CardContent className="flex flex-1 flex-col p-0">
                <div className="flex-1 space-y-2 bg-muted/40 p-4">
                  {[60, 80, 40, 55].map(width => (
                    <div key={width} className="flex items-center gap-2">
                      <div className="h-2 w-12 shrink-0 rounded bg-muted-foreground/15" />
                      <div className="h-4 flex-1 rounded bg-muted">
                        <div
                          className="h-full rounded bg-emerald-500/40"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                      <div className="h-2 w-6 shrink-0 rounded bg-muted-foreground/10" />
                    </div>
                  ))}
                </div>
                <div className="mt-auto p-4">
                  <h3 className="font-medium">Time Tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    Log and review hours across tasks
                  </p>
                </div>
              </CardContent>
            </MotionCard>
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────── */}
      <section className="px-page-x py-20">
        <div className="mx-auto max-w-5xl">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="mb-2 text-center text-3xl font-semibold tracking-tight"
          >
            How it works
          </motion.h2>
          <motion.p
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mb-12 max-w-prose text-center text-lg text-muted-foreground"
          >
            Get up and running in three simple steps.
          </motion.p>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-8 md:grid-cols-3"
          >
            {HOW_IT_WORKS_STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                variants={i === 0 ? slideLeft : i === 2 ? slideRight : fadeUp}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10">
                  <step.icon className="size-6 text-primary" />
                </div>
                <span className="mb-2 text-sm font-medium text-primary">
                  Step
                  {" "}
                  {step.step}
                </span>
                <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Roles ─────────────────────────────────────────────────────── */}
      <section className="border-y bg-muted/30 px-page-x py-20">
        <div className="mx-auto max-w-5xl">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="mb-2 text-center text-3xl font-semibold tracking-tight"
          >
            Three roles, one workflow
          </motion.h2>
          <motion.p
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mb-12 max-w-prose text-center text-lg text-muted-foreground"
          >
            Each role sees exactly what they need — no more, no less.
          </motion.p>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid gap-6 md:grid-cols-3"
          >
            {ROLE_CARDS.map(card => (
              <MotionCard
                key={card.role}
                variants={fadeUp}
                transition={{ duration: 0.5, ease: "easeOut" }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <CardContent className="pt-6">
                  <div className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <card.icon className="size-5 text-primary" />
                  </div>
                  <h3 className="mb-1 text-lg font-semibold">{card.role}</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {card.description}
                  </p>
                  <ul className="space-y-2">
                    {card.capabilities.map(cap => (
                      <li key={cap} className="flex items-center gap-2 text-sm">
                        <Check className="size-3.5 shrink-0 text-primary" />
                        {cap}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </MotionCard>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────── */}
      <section className="px-page-x py-20">
        <div className="mx-auto max-w-5xl">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="mb-2 text-center text-3xl font-semibold tracking-tight"
          >
            Loved by teams
          </motion.h2>
          <motion.p
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mb-12 max-w-prose text-center text-lg text-muted-foreground"
          >
            See what others are saying about WorkSphere.
          </motion.p>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid gap-6 sm:grid-cols-2"
          >
            {TESTIMONIALS.map((t, i) => (
              <MotionCard
                key={t.name}
                variants={i % 2 === 0 ? slideLeft : slideRight}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <CardContent className="pt-6">
                  <Quote className="mb-3 size-5 text-primary/40" />
                  <p className="mb-4 text-sm leading-relaxed">{t.quote}</p>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                        {t.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.role}
                        ,
                        {" "}
                        {t.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </MotionCard>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────── */}
      <section id="pricing" className="scroll-mt-(--header-h) border-y bg-muted/30 px-page-x py-20">
        <div className="mx-auto max-w-5xl">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="mb-2 text-center text-3xl font-semibold tracking-tight"
          >
            Simple, transparent pricing
          </motion.h2>
          <motion.p
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mb-12 max-w-prose text-center text-lg text-muted-foreground"
          >
            Start free and scale as your team grows.
          </motion.p>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid gap-6 md:grid-cols-3"
          >
            {PRICING_TIERS.map(tier => (
              <MotionCard
                key={tier.name}
                variants={fadeUp}
                transition={{ duration: 0.5, ease: "easeOut" }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={cn(
                  "relative flex flex-col",
                  tier.highlighted && "overflow-visible border-primary ring-1 ring-primary",
                )}
              >
                {tier.badge && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    {tier.badge}
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{tier.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-4xl font-bold tracking-tight">
                      {tier.price}
                    </span>
                    <span className="ml-1 text-sm text-muted-foreground">
                      {tier.period}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {tier.description}
                  </p>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-2">
                    {tier.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Check className="size-3.5 shrink-0 text-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={tier.highlighted ? "default" : "outline"}
                    asChild
                  >
                    <Link to={paths.auth.signup.path}>{tier.cta}</Link>
                  </Button>
                </CardFooter>
              </MotionCard>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────── */}
      <motion.section
        id="faq"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="scroll-mt-(--header-h) px-page-x py-20"
      >
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-2 text-center text-3xl font-semibold tracking-tight">
            Frequently asked questions
          </h2>
          <p className="mx-auto mb-12 max-w-prose text-center text-lg text-muted-foreground">
            Everything you need to know about WorkSphere.
          </p>

          <Accordion type="single" collapsible>
            {FAQ_ITEMS.map(item => (
              <AccordionItem key={item.question} value={item.question}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </motion.section>

      {/* ── Tech Stack ────────────────────────────────────────────────── */}
      <section className="border-y bg-muted/30 px-page-x py-16">
        <div className="mx-auto max-w-3xl text-center">
          <motion.h2
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="mb-6 text-2xl font-semibold tracking-tight"
          >
            Built with
          </motion.h2>
          <motion.div
            variants={staggerContainerFast}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="flex flex-wrap justify-center gap-2"
          >
            {TECH_STACK.map(tech => (
              <motion.span
                key={tech.name}
                variants={scaleUp}
                transition={{ duration: 0.3 }}
                className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-sm"
              >
                <tech.icon className="size-3.5 text-muted-foreground" />
                {tech.name}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <motion.section
        variants={scaleUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="px-page-x py-20 text-center"
      >
        <h2 className="mb-3 text-3xl font-semibold tracking-tight">
          Ready to explore?
        </h2>
        <p className="mb-6 text-lg text-muted-foreground">
          Sign in with a test account and see it in action.
        </p>
        {!isAuthenticated && (
          <MotionButton
            size="lg"
            asChild
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link to={paths.auth.signin.path}>
              Get Started
              <ArrowRight className="size-4" />
            </Link>
          </MotionButton>
        )}
      </motion.section>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <motion.footer
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="border-t px-page-x py-12"
      >
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {FOOTER_LINKS.map(group => (
              <div key={group.title}>
                <h4 className="mb-3 text-sm font-semibold">{group.title}</h4>
                <ul className="space-y-2">
                  {group.links.map(link => (
                    <li key={link}>
                      <span className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                        {link}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Separator className="my-8" />

          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <p className="text-sm text-muted-foreground">
              WorkSphere Demo — No backend required. Data persists in
              localStorage.
            </p>
            <p className="text-xs text-muted-foreground">
              Built with React & TypeScript
            </p>
          </div>
        </div>
      </motion.footer>
    </main>
  );
}
