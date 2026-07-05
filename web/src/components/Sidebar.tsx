import {
  CheckCircle,
  PlusCircle,
  TrendingUp,
  MessageSquare,
  Users,
  Eye,
  Bell,
  BarChart3,
  Send,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/lib/types";

export interface NavItem {
  page: string;
  icon: LucideIcon;
  label: string;
  shortLabel: string;
}

export const NAV_MAP: Record<Role, NavItem[]> = {
  individual: [
    { page: "my-commits", icon: CheckCircle, label: "My commits", shortLabel: "Commits" },
    { page: "log-achievement", icon: PlusCircle, label: "Log achievement", shortLabel: "Log" },
    { page: "my-impact", icon: TrendingUp, label: "My impact", shortLabel: "Impact" },
    { page: "messages", icon: MessageSquare, label: "Messages", shortLabel: "Messages" },
  ],
  hr: [
    { page: "people", icon: Users, label: "People", shortLabel: "People" },
    { page: "drilldown", icon: Eye, label: "Individual view", shortLabel: "View" },
    { page: "reminders", icon: Bell, label: "Reminders", shortLabel: "Reminders" },
  ],
  ceo: [
    { page: "dashboard", icon: BarChart3, label: "Dashboard", shortLabel: "Dashboard" },
    { page: "people", icon: Users, label: "People", shortLabel: "People" },
    { page: "heatmap", icon: TrendingUp, label: "Impact heatmap", shortLabel: "Heatmap" },
    { page: "message", icon: Send, label: "Send message", shortLabel: "Message" },
  ],
};

interface SidebarProps {
  activeRole: Role;
  activePage: string;
  onPageChange: (page: string) => void;
}

function Sidebar({ activeRole, activePage, onPageChange }: SidebarProps) {
  const navItems = NAV_MAP[activeRole];

  return (
    <div className="hidden w-[200px] shrink-0 border-r border-[#e0e0e0] bg-white py-4 md:block">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activePage === item.page;
        return (
          <button
            key={item.page}
            onClick={() => onPageChange(item.page)}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-[13px] text-black transition-colors"
            style={{ backgroundColor: isActive ? "#f5f5f5" : "transparent" }}
          >
            <Icon size={18} strokeWidth={1.5} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default Sidebar;
