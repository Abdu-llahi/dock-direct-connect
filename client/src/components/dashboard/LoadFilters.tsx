
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

interface LoadFiltersProps {
  searchRadius: string;
  setSearchRadius: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
}

const LoadFilters = ({ searchRadius, setSearchRadius, sortBy, setSortBy }: LoadFiltersProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Filter className="h-5 w-5" />
          <span>Search Filters</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Search Radius</label>
            <Select value={searchRadius} onValueChange={setSearchRadius}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="50">50 miles</SelectItem>
                <SelectItem value="100">100 miles</SelectItem>
                <SelectItem value="200">200 miles</SelectItem>
                <SelectItem value="500">500 miles</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Sort By</label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">Distance</SelectItem>
                <SelectItem value="rate">Rate (High to Low)</SelectItem>
                <SelectItem value="urgent">Urgent First</SelectItem>
                <SelectItem value="recent">Most Recent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Min Rate</label>
            <Input placeholder="$0" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadFilters;
