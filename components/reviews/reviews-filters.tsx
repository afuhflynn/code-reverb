import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, Calendar } from "lucide-react";

export function ReviewsFilters() {
  return (
    <div className="bg-muted/50 rounded-lg p-4 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search reviews, PRs, repositories..."
            className="pl-9"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Repository" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Repositories</SelectItem>
              <SelectItem value="web-app">web-app</SelectItem>
              <SelectItem value="api-service">api-service</SelectItem>
              <SelectItem value="mobile-app">mobile-app</SelectItem>
              <SelectItem value="docs">docs</SelectItem>
              <SelectItem value="data-pipeline">data-pipeline</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="AI Persona" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Personas</SelectItem>
              <SelectItem value="code-quality">Code Quality</SelectItem>
              <SelectItem value="security">Security Expert</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="balanced">Balanced</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Quality Score" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Scores</SelectItem>
              <SelectItem value="excellent">9-10 (Excellent)</SelectItem>
              <SelectItem value="good">7-8.9 (Good)</SelectItem>
              <SelectItem value="fair">5-6.9 (Fair)</SelectItem>
              <SelectItem value="poor">0-4.9 (Poor)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active filters and bulk actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="gap-1">
            Completed
            <X className="h-3 w-3 cursor-pointer" />
          </Badge>
          <Badge variant="secondary" className="gap-1">
            web-app
            <X className="h-3 w-3 cursor-pointer" />
          </Badge>
          <Badge variant="secondary" className="gap-1">
            Code Quality
            <X className="h-3 w-3 cursor-pointer" />
          </Badge>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
            Clear All
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-3 w-3" />
            Save Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="h-3 w-3" />
            Schedule Report
          </Button>
        </div>
      </div>
    </div>
  );
}
