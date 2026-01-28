"use client";

import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ConfirmationAlert } from "@/components/ui/confirmation-alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ActionsMenuProps = {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function ActionsMenu({ onView, onEdit, onDelete }: ActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={onView}>
          <Eye className="size-4" />
          View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit}>
          <Pencil className="size-4" />
          Edit
        </DropdownMenuItem>
        {onDelete ? (
          <ConfirmationAlert
            title="Delete blog?"
            description="This action cannot be undone."
            confirmLabel="Delete"
            onConfirm={onDelete}
          >
            <DropdownMenuItem
              onSelect={(event) => event.preventDefault()}
              variant="destructive"
            >
              <Trash2 className="size-4" />
              Delete
            </DropdownMenuItem>
          </ConfirmationAlert>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
