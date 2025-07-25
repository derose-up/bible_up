import { useEffect } from "react";

interface KeyboardNavigationOptions {
  itemCount: number;
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export function useKeyboardNavigation({
  itemCount,
  selectedIndex,
  onSelect,
}: KeyboardNavigationOptions) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        onSelect((selectedIndex + 1) % itemCount);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        onSelect((selectedIndex - 1 + itemCount) % itemCount);
      } else if (e.key === "Enter") {
        e.preventDefault();
        onSelect(selectedIndex); // Ou você pode executar outra ação aqui
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [itemCount, selectedIndex, onSelect]);
}
