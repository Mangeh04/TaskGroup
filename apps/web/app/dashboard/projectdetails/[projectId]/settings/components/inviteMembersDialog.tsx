import { CustomDialog } from "@/components/custom/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import buttonIcon from "@/public/images/add-member.webp";

export function InviteMemberDialog() {
  return (
    <CustomDialog
      buttonString="Invite Members"
      title="Invite a new User"
      subtitle="Invite a person here. Introduce his email to invite."
      confirmIcon={
        <Image
          src={buttonIcon}
          width={15}
          height={15}
          alt="Add new members to the project"
          className="dark:invert dark:brightness-100"
        />
      }
    >
      <Label htmlFor="user-email-inv">Task Name</Label>
      <Input id="user-email-inv" name="User Email Invitation" placeholder="a@example.com" />
    </CustomDialog>
  );
}
