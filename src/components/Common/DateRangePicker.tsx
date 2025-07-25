import React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
      <div className="relative">
        <input
          type="date"
          value={startDate ? format(startDate, "yyyy-MM-dd") : ""}
          onChange={(e) => onStartDateChange(e.target.value ? new Date(e.target.value) : null)}
          className="px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600"
        />
        <CalendarIcon className="absolute right-2 top-2 h-5 w-5 text-gray-400 pointer-events-none" />
      </div>
      <span className="text-gray-500 dark:text-gray-400">até</span>
      <div className="relative">
        <input
          type="date"
          value={endDate ? format(endDate, "yyyy-MM-dd") : ""}
          onChange={(e) => onEndDateChange(e.target.value ? new Date(e.target.value) : null)}
          className="px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600"
        />
        <CalendarIcon className="absolute right-2 top-2 h-5 w-5 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
};

export default DateRangePicker;
