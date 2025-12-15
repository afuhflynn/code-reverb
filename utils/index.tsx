import { AlertCircle, CheckCircle, Clock, GitBranch } from "lucide-react";

export const getStatusColor = (status: string) => {
  switch (status) {
    case "connected":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-orange-100 text-orange-800";
    case "error":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getLanguageColor = (language: string) => {
  const colors: Record<string, string> = {
    TypeScript: "bg-blue-100 text-blue-800",
    Go: "bg-cyan-100 text-cyan-800",
    Python: "bg-yellow-100 text-yellow-800",
    "Node.js": "bg-green-100 text-green-800",
    Markdown: "bg-gray-100 text-gray-800",
  };
  return colors[language] || "bg-gray-100 text-gray-800";
};
