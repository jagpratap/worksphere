import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type PageContainerProps = ComponentProps<"div">;

export function PageContainer({ className, ...props }: PageContainerProps) {
  return (
    <div
      className={cn(
        "flex min-h-svh flex-col items-center justify-center gap-group p-page-x",
        className,
      )}
      {...props}
    />
  );
}
