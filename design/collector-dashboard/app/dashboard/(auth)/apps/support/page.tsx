import { generateMeta } from "@/lib/utils";
import AppRender from "@/app/dashboard/(auth)/apps/support/app-render";

export async function generateMetadata() {
  return generateMeta({
    title: "Chat App",
    description:
      "A template you can use to create applications that allow you to chat with artificial intelligence. Built with shadcn/ui, Next.js and Tailwind CSS.",
    canonical: "/apps/support"
  });
}

export default function Page() {
  return (
    <div className="m-auto flex h-[calc(100vh-var(--header-height)-3rem)] w-full max-w-(--breakpoint-md) items-center justify-center">
      <AppRender />
    </div>
  );
}
