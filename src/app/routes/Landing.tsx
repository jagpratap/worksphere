import {
  ArrowRight,
  Clock,
  FolderKanban,
  Kanban,
  ListChecks,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { paths } from "@/config/paths";
import { ROLE_HOME_ROUTE } from "@/config/roles";
import { selectCurrentUserRole, selectIsAuthenticated } from "@/features/auth";
import { useAppSelector } from "@/store";

const features = [
  {
    icon: FolderKanban,
    title: "Project Management",
    description: "Create and manage projects with team members, statuses, and detailed overviews.",
  },
  {
    icon: Kanban,
    title: "Kanban Board",
    description: "Drag-and-drop task management with real-time status updates across columns.",
  },
  {
    icon: Zap,
    title: "Sprint Planning",
    description: "Time-boxed iterations with goals, progress tracking, and completion stats.",
  },
  {
    icon: Clock,
    title: "Time Tracking",
    description: "Log hours against tasks with daily and weekly summaries at a glance.",
  },
  {
    icon: Users,
    title: "Team Workload",
    description: "Visualize task distribution across team members with status breakdowns.",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description: "Admin, Manager, and Member roles with granular permission controls.",
  },
];

const roles = [
  { role: "Admin", access: "Full system access, user management, audit logs" },
  { role: "Manager", access: "Projects, sprints, workload, team management" },
  { role: "Member", access: "Personal tasks, time tracking, profile" },
];

export default function LandingRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const role = useAppSelector(selectCurrentUserRole);

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center gap-6 px-page-x py-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-sm text-muted-foreground">
          <ListChecks className="size-3.5" />
          Open-source project management demo
        </div>

        <h1 className="max-w-3xl text-5xl font-bold tracking-tight sm:text-6xl">
          Manage projects,
          <br />
          <span className="text-primary">not chaos.</span>
        </h1>

        <p className="max-w-lg text-lg text-muted-foreground">
          A lightweight, role-based project management tool for teams that want
          clarity without the complexity. Built with React, TypeScript, and modern tooling.
        </p>

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
                <Button size="lg" asChild>
                  <Link to={paths.auth.signin.path}>
                    Try the Demo
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to={paths.auth.signup.path}>Create Account</Link>
                </Button>
              </div>
            )}

        <p className="text-xs text-muted-foreground">
          No server required — runs entirely in your browser with mock data
        </p>
      </section>

      {/* Features Grid */}
      <section className="border-t bg-muted/30 px-page-x py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-2 text-center text-2xl font-semibold tracking-tight">
            Everything you need to ship
          </h2>
          <p className="mb-12 text-center text-muted-foreground">
            From backlog to done — plan, track, and deliver with your team.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(feature => (
              <Card key={feature.title} className="border-0 bg-background shadow-sm">
                <CardContent className="pt-6">
                  <feature.icon className="mb-3 size-5 text-primary" />
                  <h3 className="mb-1 font-medium">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="px-page-x py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-2 text-center text-2xl font-semibold tracking-tight">
            Three roles, one workflow
          </h2>
          <p className="mb-10 text-center text-muted-foreground">
            Each role sees exactly what they need — no more, no less.
          </p>

          <div className="space-y-3">
            {roles.map(({ role: name, access }) => (
              <div key={name} className="flex items-center gap-4 rounded-lg border px-4 py-3">
                <span className="w-20 shrink-0 text-sm font-semibold">{name}</span>
                <span className="text-sm text-muted-foreground">{access}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="border-t bg-muted/30 px-page-x py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">Built with</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "React 19",
              "TypeScript",
              "Vite",
              "Redux Toolkit",
              "RTK Query",
              "React Router v7",
              "Tailwind CSS v4",
              "shadcn/ui",
              "React Hook Form",
              "Zod",
              "dnd-kit",
              "MSW 2.x",
            ].map(tech => (
              <span
                key={tech}
                className="rounded-full border bg-background px-3 py-1 text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-page-x py-20 text-center">
        <h2 className="mb-3 text-2xl font-semibold tracking-tight">
          Ready to explore?
        </h2>
        <p className="mb-6 text-muted-foreground">
          Sign in with a test account and see it in action.
        </p>
        {!isAuthenticated && (
          <Button size="lg" asChild>
            <Link to={paths.auth.signin.path}>
              Get Started
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t px-page-x py-8 text-center text-xs text-muted-foreground">
        WorkSphere Demo — No backend required. Data persists in localStorage.
      </footer>
    </main>
  );
}
