import { Bot, Settings } from "lucide-react";
import { FaHome, FaUserShield, FaGithub, FaBookOpen } from "react-icons/fa";

export const navigation = [
  { name: "Dashboard", href: "/app", icon: FaHome },
  { name: "Repositories", href: "/repositories", icon: FaGithub },
  { name: "Reviews", href: "/reviews", icon: FaBookOpen },
  { name: "Personas", href: "/personas", icon: Bot },
  { name: "Settings", href: "/settings", icon: Settings },
];
