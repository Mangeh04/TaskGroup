import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { JSX, ReactNode } from "react";
import { PlusIcon } from "lucide-react";

export type CustomDialog = {
  buttonString: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  confirmIcon: JSX.Element,
  onSubmit?: () => void;
};

export function CustomDialog({
  buttonString,
  title,
  subtitle,
  children,
  confirmIcon,
  onSubmit
}: CustomDialog) {
  return (
    <Dialog>
      <form onSubmit={onSubmit}>
        <DialogTrigger asChild>
          <Button > {confirmIcon} {buttonString} </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{subtitle}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              {children}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{confirmIcon}</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
