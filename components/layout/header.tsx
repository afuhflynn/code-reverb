"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "../ui/sidebar";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();
  return (
    <header className="flex h-16 items-center shrink-0 justify-between border-b bg-sidebar px-6 sticky z-40 backdrop-blur-2xl top-0 left-0 right-0">
      <SidebarTrigger className="-ml-1" />
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search PRs, repos..."
            className="lg:w-96 w-full pl-9"
          />
        </div>
      </div>
    </header>
  );
}
