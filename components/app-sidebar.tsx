"use client";

import { signOut, useSession } from "@/lib/auth-client";
import { usePathname, useRouter } from "next/navigation";
import { navigation } from "@/constants";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubButton,
} from "./ui/sidebar";
import { FaGithub } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { ModeToggle } from "./theme-toggle";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

export const AppSidebar = () => {
  const pathName = usePathname();
  const { data: session } = useSession();
  const router = useRouter();

  const isActive = (href: string) => {
    return pathName === href || pathName?.startsWith(href + "/app");
  };

  const user = session?.user;
  const userName = user?.name || "User";
  const userEmail = user?.email || "";
  const userImage = session?.user.image || "";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex flex-col gap-4 px-2 py-6">
          <div className="flex items-center gap-4 px-3 py-4 rounded-lg bg-sidebar-accent/50 hover:bg-sidebar-accent/70 transition-colors">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground shrink-0">
              <FaGithub className="size-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-sidebar-foreground tracking-wide">
                {" "}
                Connected Account{" "}
              </p>
              <p className="text-sm font-medium text-sidebar-foreground/90">
                @{userName}
              </p>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-6 flex-col gap-1">
        <div className="mb-2">
          <p className="text-xs font-semibold text-sidebar-foreground/90 px-3 mb-3 uppercase tracking-widest">
            Menu
          </p>
        </div>
        <SidebarMenu className="gap-2">
          {navigation.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                tooltip={item.name}
                className={cn(
                  "h-11 px-4 rounded-lg transition-all  duration-200",
                  isActive(item.href)
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                    : "hover:bg-sidebar-accent/60 text-sidebar-foreground"
                )}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-3 w-full"
                >
                  <item.icon className="size-5 shrink-0" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t px-3 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <SidebarMenuSubButton
                  size="md"
                  className="h-12 px-4 rounded-lg w-full
              hover:bg-sidebar-accent/60
              data-[state=open]:bg-sidebar-accent
              data-[state=open]:text-sidebar-accent-foreground
              transition-colors"
                >
                  <Avatar className="h-9 w-9 rounded-lg shrink-0">
                    <AvatarImage src={userImage} alt={userName} />
                    <AvatarFallback className="rounded-lg">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="grid flex-1 text-left min-w-0 leading-tight">
                    <span className="truncate text-sm font-semibold">
                      {userName}
                    </span>
                    <span className="truncate text-xs text-sidebar-foreground/60">
                      {userEmail}
                    </span>
                  </div>
                </SidebarMenuSubButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-64 rounded-lg p-2"
                align="end"
                side="right"
                sideOffset={8}
              >
                {/* Theme Toggle */}
                <div className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-sidebar-accent/50 transition-colors">
                  <span className="text-sm font-medium">Theme</span>
                  <ModeToggle />
                </div>

                <div className="my-1 h-px bg-border" />

                {/* Logout */}
                <DropdownMenuItem
                  className="gap-2 text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer"
                  onClick={() =>
                    signOut({
                      fetchOptions: {
                        onSuccess() {
                          toast.success("Signed out successfully");
                          router.push("/auth");
                        },
                        onError() {
                          toast.error("Sign out failed. Try again.");
                        },
                      },
                    })
                  }
                >
                  <LogOut className="size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
