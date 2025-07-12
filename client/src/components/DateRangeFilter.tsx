import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onDateRangeChange: (startDate: string, endDate: string) => void;
}

export default function DateRangeFilter({ startDate, endDate, onDateRangeChange }: DateRangeFilterProps) {
  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localEndDate, setLocalEndDate] = useState(endDate);

  const handleApplyFilter = () => {
    onDateRangeChange(localStartDate, localEndDate);
  };

  const handleClearFilters = () => {
    setLocalStartDate("");
    setLocalEndDate("");
    onDateRangeChange("", "");
  };

  return (
    <Card className="shadow-lg border-gray-100">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Dashboard Analytics</h2>
            <p className="text-sm text-gray-600">
              {startDate && endDate ? 
                `Showing data from ${startDate} to ${endDate}` : 
                "Showing all data - apply date filter to narrow results"
              }
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="startDate" className="text-sm font-medium text-gray-700 w-20">Start Date:</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={localStartDate}
                  onChange={(e) => setLocalStartDate(e.target.value)}
                  className="text-sm flex-1"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="endDate" className="text-sm font-medium text-gray-700 w-20">End Date:</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={localEndDate}
                  onChange={(e) => setLocalEndDate(e.target.value)}
                  className="text-sm flex-1"
                />
              </div>
            </div>
            <div className="flex space-x-2 sm:ml-auto">
              <Button
                onClick={handleApplyFilter}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-sm flex-1 sm:flex-none"
              >
                Apply Filter
              </Button>
              {(startDate || endDate) && (
                <Button
                  onClick={handleClearFilters}
                  variant="outline"
                  className="text-sm flex-1 sm:flex-none"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
