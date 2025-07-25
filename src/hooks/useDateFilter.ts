import { useState, useMemo } from "react";

interface UseDateFilterOptions<T> {
  dateField: keyof T;
}

export function useDateFilter<T>(
  data: T[],
  options: UseDateFilterOptions<T>
) {
  const { dateField } = options;
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const filteredData = useMemo(() => {
    if (!startDate || !endDate) return data;

    return data.filter((item) => {
      const date = new Date(item[dateField] as any);
      return date >= startDate && date <= endDate;
    });
  }, [data, startDate, endDate, dateField]);

  const clearDateFilter = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const hasDateFilter = !!startDate && !!endDate;

  return {
    filteredData,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    clearDateFilter,
    hasDateFilter,
  };
}
