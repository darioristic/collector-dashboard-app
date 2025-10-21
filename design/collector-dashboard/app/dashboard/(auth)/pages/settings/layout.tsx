import { generateMeta } from "@/lib/utils";

export async function generateMetadata() {
  return generateMeta({
    title: "Settings Page",
    description:
      "Example of settings page and form created using react-hook-form and Zod validator. Built with Tailwind CSS and React.",
    canonical: "/pages/settings"
  });
}

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="mb-6 space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <div className="flex-1">
        {children}
      </div>
    </>
  );
}
