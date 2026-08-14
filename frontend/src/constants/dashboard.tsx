import { MessageSquareMore, Settings2Icon, Users, LayoutDashboard } from "lucide-react";

export const data = {
  sidebarUser: {
    name: "Admin User",
    email: "admin@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  sidebarItems: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: <LayoutDashboard />,
    },
    {
      title: "Interviews",
      url: "/admin/interviews",
      icon: <MessageSquareMore />,
      isActive: true,
    },
    {
      title: "Candidates",
      url: "/admin/candidates",
      icon: <Users />,
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: <Settings2Icon />,
    },
  ],
};