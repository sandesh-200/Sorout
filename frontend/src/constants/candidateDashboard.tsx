import { Briefcase, Settings2Icon, User } from "lucide-react";

export const candidateDashboardData = {
  sidebarUser: {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/avatars/candidate.jpg",
  },
  sidebarItems: [
    {
      title: "My Interviews",
      url: "/candidate/interviews", // Matches the layout path
      icon: <Briefcase className="h-4 w-4" />,
    },
    {
      title: "Profile",
      url: "/candidate/profile",
      icon: <User className="h-4 w-4" />,
    },
    {
      title: "Settings",
      url: "/candidate/settings",
      icon: <Settings2Icon className="h-4 w-4" />,
    },
  ],
};