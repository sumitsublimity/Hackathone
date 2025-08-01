import { Checkbox } from "@/components/ui/checkbox";
import { use, useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "lucide-react";

type CheckboxDropdownProps = {
  action: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  type?: string;
  disableDelete?: boolean;
  placeholder?: string;
};

export default function CheckboxDropdown({
  action,
  selected,
  onChange,
  disableDelete,
  placeholder = "Select action",
}: CheckboxDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v: any) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  //   useEffect(()=>{
  // selected
  //   },[action]);

  // console.log({ selected });

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="w-full border border-gray-200 rounded-md px-3 py-1.5 flex justify-between items-center bg-white"
        onClick={() => setOpen((p: any) => !p)}
      >
        <span
          className={`truncate text-sm ${
            selected.length === 0 ? "text-muted-foreground" : "text-foreground"
          }`}
        >
          {selected.length > 0 ? selected.join(", ") : placeholder}
        </span>
        <ChevronDownIcon className="size-4 opacity-50" />
      </button>

      {open && (
        <div className="absolute z-10 mt-1 w-full border-lightTeal bg-white shadow rounded">
          {action.map((opt: any) => (
            <label
              key={opt}
              className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100"
            >
              <Checkbox
                checked={selected.includes(opt)}
                onCheckedChange={() => toggleOption(opt)}
                className="!accent-lightTeal h-4 w-4"
              />
              <span className="ml-2 text-sm">{opt}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
