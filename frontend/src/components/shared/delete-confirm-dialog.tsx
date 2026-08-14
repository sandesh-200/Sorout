// "use client";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Loader2 } from "lucide-react";

// interface DeleteConfirmDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onConfirm: () => void;
//   title?: string;
//   description?: string;
//   isLoading?: boolean;
// }

// export default function DeleteConfirmDialog({
//   open,
//   onOpenChange,
//   onConfirm,
//   title = "Delete Interview Session",
//   description = "Are you sure you want to delete this session? This action cannot be undone.",
//   isLoading = false,
// }: DeleteConfirmDialogProps) {
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>{title}</DialogTitle>
//           <DialogDescription>{description}</DialogDescription>
//         </DialogHeader>
        
//         <DialogFooter className="mt-4 gap-2 sm:gap-0">
//           <Button
//             type="button"
//             variant="outline"
//             onClick={() => onOpenChange(false)}
//             disabled={isLoading}
//             className="cursor-pointer"
//           >
//             Cancel
//           </Button>
//           <Button
//             type="button"
//             variant="destructive"
//             onClick={onConfirm}
//             disabled={isLoading}
//             className="min-w-24 cursor-pointer"
//           >
//             {isLoading ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Deleting...
//               </>
//             ) : (
//               "Delete"
//             )}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }


"use client";


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  /** Optional specific item name to provide clear context (e.g. "Senior Frontend Mock") */
  itemName?: string;
  isLoading?: boolean;
}

export default function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Delete Interview Session",
  description,
  itemName,
  isLoading = false,
}: DeleteConfirmDialogProps) {
  // Construct dynamic description if itemName is present and custom description is omitted
  const finalDescription =
    description ??
    (itemName
      ? `Are you sure you want to delete "${itemName}"? This action cannot be undone and will permanently remove all associated logs and scores.`
      : "Are you sure you want to delete this session? This action cannot be undone.");

  const handleOpenChange = (nextOpen: boolean) => {
    // Block closing dialog while async deletion is processing
    if (isLoading) return;
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="sm:max-w-md gap-0 border-border/80 shadow-lg p-0 overflow-hidden"
        onEscapeKeyDown={(e) => isLoading && e.preventDefault()}
        onPointerDownOutside={(e) => isLoading && e.preventDefault()}
      >
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-base font-semibold text-foreground">
            {title}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
            {finalDescription}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex items-center justify-end border-t border-border/60 px-6 py-3 space-x-2 bg-muted/20 sm:space-x-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onConfirm}
            disabled={isLoading}
            className="min-w-24"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                <span>Deleting...</span>
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}