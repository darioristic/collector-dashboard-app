"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar
} from "@/components/ui/sidebar";
import {
  ActivityIcon,
  ArchiveRestoreIcon,
  BadgeDollarSignIcon,
  Bell,
  BrainIcon,
  Building2Icon,
  CalendarIcon,
  ChartBarDecreasingIcon,
  ChartPieIcon,
  ChevronRight,
  ClipboardCheckIcon,
  ClipboardMinusIcon,
  ComponentIcon,
  CookieIcon,
  FingerprintIcon,
  FolderDotIcon,
  FolderIcon,
  GaugeIcon,
  GraduationCapIcon,
  ImagesIcon,
  KeyIcon,
  MailIcon,
  ProportionsIcon,
  SettingsIcon,
  ShoppingBagIcon,
  SquareCheckIcon,
  SquareKanbanIcon,
  StickyNoteIcon,
  UserIcon,
  UsersIcon,
  WalletMinimalIcon,
  type LucideIcon,
  GithubIcon,
  RedoDotIcon,
  BrushCleaningIcon
} from "lucide-react";
import Link from "next/link";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

type NavGroup = {
  title: string;
  items: NavItem;
};

type NavItem = {
  title: string;
  href: string;
  icon?: LucideIcon;
  isComing?: boolean;
  isDataBadge?: string;
  isNew?: boolean;
  newTab?: boolean;
  items?: NavItem;
}[];

export const navItems: NavGroup[] = [
  {
    title: "Sales & Business",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard/default",
        icon: ChartPieIcon
      },
      {
        title: "Contacts",
        href: "/dashboard/sales",
        icon: BadgeDollarSignIcon,
        items: [
          { title: "Dashboard", href: "/dashboard/sales" },
          { title: "Customer Dashboard", href: "/dashboard/sales/customer-dashboard" },
          { title: "Users List", href: "/dashboard/pages/users" }
        ]
      },
      {
        title: "Finance",
        href: "/dashboard/finance",
        icon: WalletMinimalIcon,
        items: [
          { title: "Dashboard", href: "/dashboard/finance" },
          { title: "Transactions", href: "/dashboard/finance/transactions" },
          { title: "Reports", href: "/dashboard/finance/reports" }
        ]
      },
      {
        title: "CRM",
        href: "/dashboard/crm",
        icon: UsersIcon,
        items: [
          { title: "Dashboard", href: "/dashboard/crm" },
          { title: "Sales CRM", href: "/dashboard/sales/crm" },
          { title: "Leads", href: "/dashboard/sales/crm" },
          { title: "Customers", href: "/dashboard/pages/users" }
        ]
      },
      {
        title: "Products",
        href: "#",
        icon: ShoppingBagIcon,
        items: [
          { title: "Dashboard", href: "/dashboard/ecommerce" },
          { title: "Product List", href: "/dashboard/pages/products" },
          { title: "Order List", href: "/dashboard/pages/orders" }
        ]
      },
      {
        title: "Management",
        href: "/dashboard/project-management",
        icon: FolderDotIcon
      }
    ]
  },

  {
    title: "Inbox",
    items: [
              { title: "Chat", href: "/dashboard/apps/support", icon: BrainIcon },
      { title: "Mail", href: "/dashboard/apps/mail", icon: MailIcon },
      {
        title: "Tasks",
        href: "/dashboard/apps/tasks",
        icon: ClipboardCheckIcon
      },
      { title: "Api Keys", href: "/dashboard/apps/api-keys", icon: KeyIcon }
    ]
  },
  {
    title: "Settings",
    items: [
      { title: "Profile", href: "/dashboard/pages/profile", icon: UserIcon },
      { title: "Account", href: "/dashboard/pages/settings/account", icon: SettingsIcon },
      { title: "Appearance", href: "/dashboard/pages/settings/appearance", icon: BrushCleaningIcon },
      { title: "Notifications", href: "/dashboard/pages/settings/notifications", icon: Bell }
    ]
  },

  {
    title: "Others",
    items: [
      {
        title: "Github",
        href: "https://github.com/bundui",
        icon: GithubIcon,
        newTab: true
      }
    ]
  }
];

export function NavMain() {
  const pathname = usePathname();
  const { isMobile } = useSidebar();

  return (
    <>
      {navItems.map((nav) => (
        <SidebarGroup key={nav.title}>
          <SidebarGroupLabel>{nav.title}</SidebarGroupLabel>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {nav.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {Array.isArray(item.items) && item.items.length > 0 ? (
                    <>
                      <div className="hidden group-data-[collapsible=icon]:block">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <SidebarMenuButton tooltip={item.title}>
                              {item.icon && <item.icon />}
                              <span>{item.title}</span>
                              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            side={isMobile ? "bottom" : "right"}
                            align={isMobile ? "end" : "start"}
                            className="min-w-56 rounded-lg">
                            <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                              {item.title}
                            </DropdownMenuLabel>
                            {item.items?.map((subItem) => (
                              <DropdownMenuItem
                                className="hover:text-foreground active:text-foreground hover:bg-[var(--primary)]/10! active:bg-[var(--primary)]/10! pl-4"
                                asChild
                                key={subItem.title}>
                                <a href={subItem.href} className="flex items-center gap-2">
                                  <div className="w-1 h-1 rounded-full bg-muted-foreground/50"></div>
                                  {subItem.title}
                                </a>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <Collapsible className="group/collapsible block group-data-[collapsible=icon]:hidden">
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            className="hover:text-foreground active:text-foreground hover:bg-[var(--primary)]/10 active:bg-[var(--primary)]/10"
                            tooltip={item.title}>
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item?.items?.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  className="hover:text-foreground active:text-foreground hover:bg-[var(--primary)]/10 active:bg-[var(--primary)]/10"
                                  isActive={pathname === subItem.href}
                                  asChild>
                                  <Link href={subItem.href} target={subItem.newTab ? "_blank" : ""}>
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </Collapsible>
                    </>
                  ) : (
                    <SidebarMenuButton
                      className="hover:text-foreground active:text-foreground hover:bg-[var(--primary)]/10 active:bg-[var(--primary)]/10"
                      isActive={pathname === item.href}
                      tooltip={item.title}
                      asChild>
                      <Link href={item.href} target={item.newTab ? "_blank" : ""}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                  {!!item.isComing && (
                    <SidebarMenuBadge className="peer-hover/menu-button:text-foreground opacity-50">
                      Coming
                    </SidebarMenuBadge>
                  )}
                  {!!item.isNew && (
                    <SidebarMenuBadge className="border border-green-400 text-green-600 peer-hover/menu-button:text-green-600">
                      New
                    </SidebarMenuBadge>
                  )}
                  {!!item.isDataBadge && (
                    <SidebarMenuBadge className="peer-hover/menu-button:text-foreground">
                      {item.isDataBadge}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}
