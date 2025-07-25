import React from "react";

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const SearchInput = React.memo<SearchInputProps>(({ value, onChange, placeholder }) => {
  return (
    <input
      type="search"
      aria-label="Buscar lições"
      value={value}
      onChange={onChange}
      placeholder={placeholder || "Buscar lições..."}
      className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-gray-800 dark:text-white"
    />
  );
}, (prev, next) => (
  prev.value === next.value && prev.placeholder === next.placeholder
));

export default SearchInput;
