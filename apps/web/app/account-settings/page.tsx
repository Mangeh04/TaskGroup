import { Suspense } from "react";
import { SettingsPage } from "@/app/account-settings/components/settingsPage";

export default function AccountSettingsWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SettingsPage />
    </Suspense>
  );
}
