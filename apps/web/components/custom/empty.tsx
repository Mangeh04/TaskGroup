import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { CustomDialog } from "@/components/custom/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import Image, { StaticImageData } from "next/image";
import { PlusIcon } from "lucide-react";

export type EmptyPageProps = {
  title: string;
  buttonString: string;
  imageSrc: StaticImageData;
  imageAlt: string;
  customDialog?: {
    title: string;
    subtitle: string;
  };
  children?: React.ReactNode;
};

export function EmptyPage({
                            title,
                            buttonString,
                            imageSrc,
                            imageAlt,
                            customDialog,
                            children
                          }: EmptyPageProps) {
  return (
    <Empty className="flex flex-col items-center justify-center text-center gap-6">
      <EmptyHeader className="flex flex-col items-center gap-4">
        <Image
          src={imageSrc}
          alt={imageAlt}
          height={120}
          width={120}
          className="dark:invert dark:brightness-100"
        />
        <EmptyTitle className="text-2xl font-semibold text-foreground">
          {title}
        </EmptyTitle>
      </EmptyHeader>

      {customDialog && (
        <EmptyContent className="flex justify-center">
          <CustomDialog
            buttonString={buttonString}
            title={customDialog.title}
            subtitle={customDialog.subtitle}
            confirmIcon={<PlusIcon />}
          >
            {children}
          </CustomDialog>
        </EmptyContent>
      )}
    </Empty>
  );
}

