import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import React, { ReactNode } from "react";
import { redirect } from "next/navigation";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import Logo from "@/components/Logo";

const DASHBOARD_HEADER_HEIGHT_CLASS = "h-[90px]";

async function Layout({ children }: { children: ReactNode }) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="flex flex-col min-h-screen min-w-full bg-background max-h-screen">
      <nav
        className={`flex items-center justify-between border-b border-border px-4 py-2 ${DASHBOARD_HEADER_HEIGHT_CLASS}`}
      >
        <Logo />
        <div className="flex gap-4 items-center">
          <ThemeSwitcher />
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </nav>

      <main className="flex min-h-0 w-full grow overflow-hidden">
        {children}
      </main>
    </div>
  );
}

export default Layout;
