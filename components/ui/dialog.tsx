"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

let dialogOpenCount = 0;
let previousBodyOverflow = "";
let previousBodyPosition = "";
let previousBodyTop = "";
let previousBodyWidth = "";
let previousHtmlOverflow = "";
let previousPaddingRight = "";
let previousScrollY = 0;

const lockBodyScroll = () => {
  const root = document.documentElement;
  const body = document.body;
  if (dialogOpenCount === 0) {
    previousBodyOverflow = body.style.overflow;
    previousBodyPosition = body.style.position;
    previousBodyTop = body.style.top;
    previousBodyWidth = body.style.width;
    previousHtmlOverflow = root.style.overflow;
    previousPaddingRight = body.style.paddingRight;
    previousScrollY = window.scrollY;
    const scrollbarWidth = window.innerWidth - root.clientWidth;

    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${previousScrollY}px`;
    body.style.width = "100%";
    root.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }
  }

  dialogOpenCount += 1;
  root.dataset.dialogOpen = String(dialogOpenCount);
};

const unlockBodyScroll = () => {
  const root = document.documentElement;
  dialogOpenCount = Math.max(dialogOpenCount - 1, 0);
  root.dataset.dialogOpen = String(dialogOpenCount);

  if (dialogOpenCount === 0) {
    const body = document.body;
    body.style.overflow = previousBodyOverflow;
    body.style.position = previousBodyPosition;
    body.style.top = previousBodyTop;
    body.style.width = previousBodyWidth;
    body.style.paddingRight = previousPaddingRight;
    root.style.overflow = previousHtmlOverflow;
    window.scrollTo(0, previousScrollY);
  }
};

function Dialog({
  onOpenChange,
  open,
  defaultOpen,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  React.useEffect(() => {
    const isOpen = open ?? defaultOpen;
    if (isOpen) {
      lockBodyScroll();
      return () => unlockBodyScroll();
    }
    return;
  }, []);

  return (
    <DialogPrimitive.Root
      data-slot="dialog"
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          lockBodyScroll();
        } else {
          unlockBodyScroll();
        }
        onOpenChange?.(nextOpen);
      }}
      {...props}
    />
  );
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className,
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        data-lenis-prevent
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 outline-none sm:max-w-lg max-h-[calc(100vh-2rem)] overflow-y-auto overscroll-contain",
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
