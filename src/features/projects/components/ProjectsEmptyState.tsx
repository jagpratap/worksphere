import { FolderKanban, SearchX } from "lucide-react";

type ProjectsEmptyStateProps = {
  type: "no-projects" | "no-results";
};

export function ProjectsEmptyState({ type }: ProjectsEmptyStateProps) {
  if (type === "no-results") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <SearchX className="size-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-sm font-medium">No projects found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Try adjusting your search or filter to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <FolderKanban className="size-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-sm font-medium">No projects yet</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Create your first project to get started.
      </p>
    </div>
  );
}
