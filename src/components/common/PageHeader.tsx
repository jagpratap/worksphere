type PageHeaderProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

/**
 * Page header with title, optional description, and an actions slot.
 * Used on every page for consistent layout.
 *
 * @example
 * <PageHeader title="Dashboard" description="Overview of your workspace">
 *   <Button>Create Project</Button>
 * </PageHeader>
 */
export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 pb-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
