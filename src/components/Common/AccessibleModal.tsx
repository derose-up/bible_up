// src/components/Common/AccessibleModal.tsx
import React, { useEffect, ReactNode } from "react";

type AccessibleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

const AccessibleModal = ({ isOpen, onClose, children }: AccessibleModalProps) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKey);
    }
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded p-6 max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default AccessibleModal;
