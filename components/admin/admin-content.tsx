import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  MoreHorizontal,
  UserCheck,
  UserX,
  Shield,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const mockUsers = [
  {
    id: "user_001",
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    status: "active",
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
    joinedAt: new Date("2023-06-15"),
    organizations: 2,
    reviews: 45,
  },
  {
    id: "user_002",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "admin",
    status: "active",
    lastActive: new Date(Date.now() - 30 * 60 * 1000),
    joinedAt: new Date("2023-08-20"),
    organizations: 1,
    reviews: 89,
  },
  {
    id: "user_003",
    name: "Bob Wilson",
    email: "bob@example.com",
    role: "user",
    status: "suspended",
    lastActive: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    joinedAt: new Date("2023-03-10"),
    organizations: 0,
    reviews: 12,
  },
  {
    id: "user_004",
    name: "Alice Brown",
    email: "alice@example.com",
    role: "user",
    status: "active",
    lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000),
    joinedAt: new Date("2024-01-05"),
    organizations: 3,
    reviews: 67,
  },
];

const getRoleColor = (role: string) => {
  switch (role) {
    case "admin":
      return "bg-red-100 text-red-800";
    case "moderator":
      return "bg-orange-100 text-orange-800";
    case "user":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "suspended":
      return "bg-red-100 text-red-800";
    case "inactive":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function AdminContent() {
  return (
    <div className="space-y-6">
      {/* User Management Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground">
            Manage platform users and their permissions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export Users</Button>
          <Button variant="outline">Bulk Actions</Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search users..." className="pl-9" />
            </div>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({mockUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{user.name}</span>
                      <Badge
                        variant="outline"
                        className={getRoleColor(user.role)}
                      >
                        {user.role}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={getStatusColor(user.status)}
                      >
                        {user.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Joined{" "}
                      {formatDistanceToNow(user.joinedAt, { addSuffix: true })}{" "}
                      • Last active{" "}
                      {formatDistanceToNow(user.lastActive, {
                        addSuffix: true,
                      })}{" "}
                      •{user.organizations} orgs • {user.reviews} reviews
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Shield className="h-3 w-3 mr-1" />
                    Manage
                  </Button>
                  {user.status === "active" ? (
                    <Button variant="outline" size="sm">
                      <UserX className="h-3 w-3 mr-1" />
                      Suspend
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm">
                      <UserCheck className="h-3 w-3 mr-1" />
                      Activate
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing 1-4 of 1,247 users
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
