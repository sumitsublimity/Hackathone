import React, { useEffect, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

export interface DropdownOption {
  label: string;
  value: string | number;
}

interface DropdownFieldProps {
  label?: string;
  name: string;
  value: string | number | undefined;
  onChange: (name: string, value: string) => void;
  options: string[] | DropdownOption[]; // or array of objects if needed
  placeholder?: string;
  icon?: string | React.ReactNode; // icon can be a string or a React component
  className?: string;
  contentClassName?: string;
  error?: string;
  iconRight?: string;
  autoFocus?: boolean;
  isMandatory?: boolean;
  height?: string;
  disabled?: boolean;
}

const DropdownField: React.FC<DropdownFieldProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "Select...",
  icon,
  className = "",
  contentClassName = "",
  error = "",
  iconRight,
  autoFocus,
  isMandatory,
  height = 12,
  disabled = false,
}) => {

  const triggerRef = useRef<HTMLDivElement>(null);
  const [triggerWidth, setTriggerWidth] = useState<number | null>(null);
  const [forceRing, setForceRing] = useState(false);

  const handleSelect = (selected: string | number) => {
    onChange(name, String(selected));
  };

  const selectedOption = options.find((opt) =>
    typeof opt === "object" && opt !== null
      ? opt.value === value
      : opt === value,
  );

  const selectedLabel =
    typeof selectedOption === "object" && selectedOption !== null
      ? selectedOption.label
      : (selectedOption ?? placeholder);

  useEffect(() => {
    if (autoFocus && triggerRef.current) {
      // Delay focus to ensure it's mounted
      setTimeout(() => {
        triggerRef.current?.focus();
        setForceRing(true);
      }, 0);
    }
  }, [autoFocus]);

  useEffect(() => {
    const node = triggerRef.current;
    if (!node) return;

    const updateWidth = () => setTriggerWidth(node.offsetWidth);
    updateWidth();

    const resizeObserver = new ResizeObserver(() => updateWidth());
    resizeObserver.observe(node);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className={`${className}`}>
      {label && (
        <div className="flex flex-row gap-1">
          <label className="mb-3 block text-base font-medium text-darkGreen">
            {label}
          </label>
          {isMandatory && <span className="text-red-500">*</span>}
        </div>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div
            ref={triggerRef}
            tabIndex={0}
            className={`cursor-pointer text-sm text-slateGreen rounded-lg px-4 py-3 ${height} flex items-center gap-2 justify-between w-full  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lightTeal !${className} ${forceRing && "ring-2 ring-lightTeal"} ${error ? "border border-red-500" : "border border-lightTeal"
              }`}
            onBlur={() => setForceRing(false)}
          >
            {/* RIGHT ICON IF PROVIDED ELSE NORMAL LEFT PADDING */}
            {icon && (
              <div>
                {typeof icon === "string" ? (
                  <Image src={icon} alt="icon" width={18} height={18} />
                ) : (
                  icon
                )}
              </div>
            )}

            {/* SELECTED TEXT OR PLACEHOLDER */}
            <div
              className={`truncate text-sm min-w-0 flex-1 ${value !== undefined && value !== ""
                ? "text-black"
                : "text-slateGreen"
                }`}
            >
              {selectedLabel}
            </div>

            {/* RIGHT ICON IF PROVIDED ELSE DEFAULT DOWN ARROW */}
            {iconRight ? (
              <div>
                {typeof iconRight === "string" ? (
                  <Image src={iconRight} alt="icon" width={18} height={18} />
                ) : (
                  iconRight
                )}
              </div>
            ) : (
              <div>
                <svg
                  className="w-4 h-4 text-slateGreen"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            )}
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          sideOffset={4}
          align="start"
          style={{ width: triggerWidth ? `${triggerWidth}px` : "auto" }}
          className={`border border-lightTeal ${contentClassName}`}
        >
          {options.length === 0 ? (
            <DropdownMenuItem
              disabled
              className="text-sm text-gray-400 cursor-default"
            >
              Nothing to select
            </DropdownMenuItem>
          ) : (
            options.map((option) => {
              const isObject = typeof option === "object" && option !== null;
              const label = isObject ? option.label : option;
              const val = isObject ? option.value : option;

              return (
                <DropdownMenuItem
                  key={val}
                  onSelect={() => handleSelect(val)}
                  className="text-sm cursor-pointer break-all"
                  disabled={disabled}
                >
                  {label}
                </DropdownMenuItem>
              );
            })
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default DropdownField;
