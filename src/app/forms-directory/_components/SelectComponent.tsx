import { ChevronDownIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectComponentProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SelectComponent: React.FC<SelectComponentProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Click outside to close dropdown
  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Current label or placeholder
  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || placeholder;

  const toggleOpen = () => setOpen((prev) => !prev);

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setOpen(false);
  };

  return (
    <div className="relative w-full max-w-xs" ref={ref}>
      <button
        type="button"
        onClick={toggleOpen}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full bg-white border border-gray-300 rounded-md px-3 py-1.5 flex justify-between items-center focus:outline-none"
      >
        <span
          className={`truncate text-sm ${
            value === "" ? "text-muted-foreground" : "text-foreground"
          }`}
        >
          {selectedLabel}
        </span>
        <ChevronDownIcon className="size-4 opacity-50" />
      </button>

      {open && (
        <ul
          role="listbox"
          tabIndex={-1}
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white border border-gray-300 shadow-lg focus:outline-none"
        >
          {/* Placeholder option */}
          <li
            role="option"
            aria-selected={value === ""}
            onClick={() => handleSelect("")}
            className={`cursor-pointer select-none px-3 py-2 text-sm !z-20 hover:bg-gray-100`}
          >
            {placeholder}
          </li>

          {/* Other options */}
          {options.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              onClick={() => handleSelect(opt.value)}
              className={`cursor-pointer px-3 py-2 text-sm !z-20 hover:bg-gray-100`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectComponent;
