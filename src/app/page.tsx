import { MainDashboard } from "@/components/dashboard/main-dashboard";
import { AppLogo } from "@/components/icons";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background/95 px-4 md:px-6 z-50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <AppLogo className="h-8 w-8 text-primary" />
          <h1 className="text-xl md:text-2xl font-bold font-headline">
            SecureFlow AI
          </h1>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <MainDashboard />
      </main>
    </div>
  );
}
