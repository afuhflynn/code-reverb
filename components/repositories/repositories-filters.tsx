"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X, MoreHorizontal } from "lucide-react";
import { useQueryStates, debounce } from "nuqs";
import { searchParamsSchema } from "@/nuqs";
import { Button } from "../ui/button";

export function RepositoriesFilters() {
  const [params, setParams] = useQueryStates(searchParamsSchema);
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 bg-muted/50 rounded-lg">
      <div className="flex flex-col sm:flex-row gap-2 flex-1">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search repositories..."
            className="pl-9"
            value={params.repoSearch || ""}
            onChange={(e) =>
              setParams(
                { repoSearch: e.target.value },
                { shallow: true, limitUrlUpdates: debounce(500) }
              )
            }
          />
        </div>
      </div>
      {/* Filters */}
      <div className="flex gap-2">
        <Select
          value={params.status}
          onValueChange={(v) => {
            setParams({ status: v }, { shallow: true });
          }}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="private">Private</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* View Options */}
      <div className="flex items-center gap-2">
        <Select
          value={params.viewMode}
          onValueChange={(v) => setParams({ ...params, viewMode: v })}
        >
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
