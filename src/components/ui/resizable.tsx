"use client";

import * as React from "react";
import { GripVerticalIcon } from "lucide-react";
import { Group, Panel, Separator } from "react-resizable-panels"; // NOVOS nomes

import { cn } from "./utils";

/* =========================
   PANEL GROUP
========================= */
function ResizablePanelGroup({
  className,
  ...props
}: React.ComponentProps<typeof Group> & { orientation?: "horizontal" | "vertical" }) {
  return (
    <Group
      data-slot="resizable-panel-group"
      className={cn(
        "flex h-full w-full aria-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    />
  );
}

/* =========================
   PANEL
========================= */
function ResizablePanel({
  className,
  ...props
}: React.ComponentProps<typeof Panel>) {
  return <Panel data-slot="resizable-panel" className={cn(className)} {...props} />;
}

/* =========================
   HANDLE
========================= */
function ResizableHandle({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof Separator> & { withHandle?: boolean }) {
  return (
    <Separator
      data-slot="resizable-handle"
      className={cn(
        "relative flex items-center justify-center bg-border focus-visible:ring-ring focus-visible:ring-1 focus-visible:ring-offset-1",
        "aria-[orientation=horizontal]:w-px aria-[orientation=horizontal]:h-full",
        "aria-[orientation=vertical]:h-px aria-[orientation=vertical]:w-full",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className="bg-border z-10 flex h-4 w-3 items-center justify-center rounded-xs border">
          <GripVerticalIcon className="size-2.5" />
        </div>
      )}
    </Separator>
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
