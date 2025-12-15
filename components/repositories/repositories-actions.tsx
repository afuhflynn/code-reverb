import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

export function RepositoriesActions() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t">
      {/* Bulk Actions */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          6 repositories selected
        </span>
        <Select>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Bulk actions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="enable-reviews">Enable AI Reviews</SelectItem>
            <SelectItem value="disable-reviews">Disable AI Reviews</SelectItem>
            <SelectItem value="sync-data">Sync Repository Data</SelectItem>
            <SelectItem value="update-settings">Update Settings</SelectItem>
            <SelectItem value="disconnect">Disconnect</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm">
          Apply
        </Button>
      </div>

      {/* Pagination */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          Showing 1-6 of 24 repositories
        </span>

        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" disabled>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Select defaultValue="6">
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6</SelectItem>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="24">24</SelectItem>
              <SelectItem value="48">48</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* View Options */}
      <div className="flex items-center gap-2">
        <Select defaultValue="grid">
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="grid">Grid</SelectItem>
            <SelectItem value="list">List</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
