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
};

export function EmptyPage({
  title,
  buttonString,
  imageSrc,
  imageAlt,
}: EmptyPageProps) {
  return (
    <Empty className="flex flex-col items-center justify-center text-center gap-6">
      <EmptyHeader className="flex flex-col items-center gap-4">
        <Image
          src={imageSrc}
          alt={imageAlt}
          height={120}
          width={120}
          className="opacity-80"
        />
        <EmptyTitle className="text-2xl font-semibold text-gray-800">
          {title}
        </EmptyTitle>
      </EmptyHeader>

      <EmptyContent className="flex justify-center">
        <CustomDialog
          buttonString={buttonString}
          title="Create a new Project"
          subtitle="Create your new projects here. Click save when you're done"
          confirmIcon={<PlusIcon />}
        >
          <Label htmlFor="project-name">Project Name</Label>
          <Input id="project-name" name="Project Name" placeholder="Incredible Project" />
        </CustomDialog>
      </EmptyContent>
    </Empty>
  );
}
