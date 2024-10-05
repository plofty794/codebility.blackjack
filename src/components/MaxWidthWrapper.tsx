import { cn } from "@/lib/utils";
import { ReactNode } from "react";

function MaxWidthWrapper({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("max-w-screen-2xl mx-auto px-4 md:px-8", className)}>
      {children}
    </div>
  );
}

export default MaxWidthWrapper;
