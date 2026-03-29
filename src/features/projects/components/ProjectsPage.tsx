import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";

import type { ProjectStatus } from "@/constants";

import { PageHeader, PermissionGate } from "@/components/common";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { PERMISSIONS } from "@/config/permissions";
import { PROJECT_STATUS, PROJECT_STATUS_LABELS } from "@/constants";

import type { ProjectWithOwner } from "../types";

import { useGetProjectsQuery } from "../api";
import { CreateProjectSheet } from "./CreateProjectSheet";
import { ProjectCard, ProjectCardSkeleton } from "./ProjectCard";
import { ProjectsEmptyState } from "./ProjectsEmptyState";

type FilterTab = "all" | ProjectStatus;

const FILTER_TABS: { label: string; value: FilterTab }[] = [
  { label: "All", value: "all" },
  {
    label: PROJECT_STATUS_LABELS[PROJECT_STATUS.PLANNING],
    value: PROJECT_STATUS.PLANNING,
  },
  {
    label: PROJECT_STATUS_LABELS[PROJECT_STATUS.ACTIVE],
    value: PROJECT_STATUS.ACTIVE,
  },
  {
    label: PROJECT_STATUS_LABELS[PROJECT_STATUS.COMPLETED],
    value: PROJECT_STATUS.COMPLETED,
  },
  {
    label: PROJECT_STATUS_LABELS[PROJECT_STATUS.ARCHIVED],
    value: PROJECT_STATUS.ARCHIVED,
  },
];

export function ProjectsPage() {
  const { data: projects, isLoading } = useGetProjectsQuery();

  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");

  const filteredProjects = useMemo(() => {
    if (!projects)
      return [];

    return projects.filter((project) => {
      // Tab filter
      if (activeTab !== "all" && project.status !== activeTab)
        return false;

      // Search filter
      if (search) {
        const q = search.toLowerCase();
        return (
          project.name.toLowerCase().includes(q)
          || project.key.toLowerCase().includes(q)
          || project.description.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [projects, activeTab, search]);

  return (
    <>
      <PageHeader title="Projects" description="Manage your team's projects">
        <PermissionGate requires={PERMISSIONS.PROJECTS_CREATE}>
          <CreateProjectSheet />
        </PermissionGate>
      </PageHeader>

      {/* Filters */}
      <div className="flex items-center gap-3 pb-4">
        {/* Tab buttons */}
        <div className="flex items-center gap-1">
          {FILTER_TABS.map(tab => (
            <Button
              key={tab.value}
              variant={activeTab === tab.value ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Search */}
        <InputGroup className="ml-auto max-w-xs">
          <InputGroupAddon align="inline-start">
            <InputGroupText>
              <Search className="size-4" />
            </InputGroupText>
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search projects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-xs"
                variant="ghost"
                aria-label="Clear search"
                onClick={() => setSearch("")}
              >
                <X className="size-3.5" />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>
      </div>

      {/* Project list */}
      <div className="flex flex-col gap-2">
        {projectListContent(isLoading, projects, filteredProjects)}
      </div>
    </>
  );
}

function projectListContent(
  isLoading: boolean,
  projects: ProjectWithOwner[] | undefined,
  filteredProjects: ProjectWithOwner[],
) {
  if (isLoading) {
    return Array.from({ length: 4 }, (_, i) => <ProjectCardSkeleton key={i} />);
  }

  if (!projects?.length) {
    return <ProjectsEmptyState type="no-projects" />;
  }

  if (!filteredProjects.length) {
    return <ProjectsEmptyState type="no-results" />;
  }

  return filteredProjects.map(project => (
    <ProjectCard key={project.id} project={project} />
  ));
}
