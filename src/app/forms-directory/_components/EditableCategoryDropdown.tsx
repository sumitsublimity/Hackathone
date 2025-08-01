import React, { useState, useRef, useEffect } from "react";
import EditIcon from "@/../public/icons/edit-row.svg";
import DeleteIcon from "@/../public/icons/delete-row.svg";
import Image from "next/image";
import { DialogBox } from "@/components/DialogBox";
import { ChevronDownIcon } from "lucide-react";

interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface EditableCategoryDropdownProps {
  options: DropdownOption[];
  value?: string | string[];
  placeholder?: string;
  multiple?: boolean;
  disabled?: boolean;
  allowEdit?: boolean;
  allowDelete?: boolean;
  allowAdd?: boolean;
  className?: string;
  onChange: (value: string | string[]) => void;
  onEditCategory?: (
    oldValue: string,
    newValue: string,
    newLabel: string,
  ) => void;
  onDeleteCategory?: (value: string) => void;
  onAddCategory?: (value: string, label: string) => void;
  onRequestEdit?: (option: DropdownOption) => void;
}

export const EditableCategoryDropdown: React.FC<
  EditableCategoryDropdownProps
> = ({
  options,
  value,
  placeholder = "Select an option",
  multiple = false,
  disabled = false,
  allowEdit = true,
  allowDelete = true,
  allowAdd = true,
  className = "",
  onChange,
  onEditCategory,
  onDeleteCategory,
  onAddCategory,
  onRequestEdit,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editValue, setEditValue] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [addInput, setAddInput] = useState("");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  // Get selected option(s) for display
  const getSelectedDisplay = () => {
    if (!value) return placeholder;

    if (multiple && Array.isArray(value)) {
      if (value.length === 0) return placeholder;
      if (value.length === 1) {
        const option = options.find((opt) => opt.value === value[0]);
        return option?.label || value[0];
      }
      return `${value.length} items selected`;
    } else {
      const option = options.find((opt) => opt.value === value);
      return option?.label || value;
    }
  };

  // Handle option selection
  const handleOptionClick = (optionValue: string) => {
    if (multiple && Array.isArray(value)) {
      const newValue = value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue];
      onChange(newValue);
    } else {
      onChange(optionValue);
      setIsOpen(false);
    }
  };

  // Start editing an option
  const startEdit = (option: DropdownOption, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingOption(option.value);
    setEditLabel(option.label);
    setEditValue(option.value);
  };

  console.log(editingOption, "------");
  // Cancel editing
  const cancelEdit = () => {
    setEditingOption(null);
    setEditLabel("");
    setEditValue("");
  };

  // Delete option
  const deleteOption = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPendingDelete(optionValue);
  };

  const handleAdd = () => {
    if (!addInput.trim()) return;
    if (options.some((opt) => opt.value === addInput.trim().toLowerCase())) {
      alert("Category already exists!");
      return;
    }
    onAddCategory?.(addInput.trim().toLowerCase(), addInput.trim());
    setAddInput("");
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setShowAddForm(false);
        cancelEdit();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus edit input when editing starts
  useEffect(() => {
    if (editingOption && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingOption]);

  const isSelected = (optionValue: string) => {
    if (multiple && Array.isArray(value)) {
      return value.includes(optionValue);
    }
    return value === optionValue;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Main Trigger Button */}
      <button
        type="button"
        className={`
          w-full px-3 py-2 text-left text-sm bg-white border rounded-md shadow-sm 
          focus:outline-none  border-gray-200 focus:border-gray-200
          transition-colors duration-200
          ${disabled ? "bg-gray-100 cursor-not-allowed" : "hover:border-gray-400 cursor-pointer"}
          border-gray-300
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <div className="flex items-center justify-between">
          <span
            className={`block truncate ${!value ? "text-gray-500" : "text-gray-900"}`}
          >
            {getSelectedDisplay()}
          </span>
          <ChevronDownIcon className="size-4 opacity-50" />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-auto">
          {/* Options List */}
          <div className="py-1">
            {options.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                No categories found
              </div>
            ) : (
              options.map((option, index) => {
                const selected = isSelected(option.value);
                const isEditing = editingOption === option.value;

                return (
                  <div
                    key={option.value}
                    className={`
                      group px-3 py-2 flex text-sm items-center justify-between
                      transition-colors duration-150
                      ${selected ? "bg-blue-100 text-blue-900" : "text-gray-900 hover:bg-gray-50"}
                      ${option.disabled ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                  >
                    <>
                      <div
                        className="flex-1 flex items-center space-x-2 cursor-pointer"
                        onClick={() =>
                          !option.disabled && handleOptionClick(option.value)
                        }
                      >
                        {option.icon && (
                          <span className="flex-shrink-0">{option.icon}</span>
                        )}
                        {isEditing ? (
                          <div className="flex items-center gap-2 w-full">
                            <input
                              ref={editInputRef}
                              type="text"
                              className="flex-1 px-2 py-1 border border-gray-300 rounded"
                              value={editLabel}
                              onChange={(e) => setEditLabel(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  if (editLabel.trim() && editValue.trim()) {
                                    onEditCategory?.(
                                      option.value,
                                      editValue.trim().toLowerCase(),
                                      editLabel.trim(),
                                    );
                                    cancelEdit();
                                  }
                                } else if (e.key === "Escape") {
                                  cancelEdit();
                                }
                              }}
                            />
                          </div>
                        ) : (
                          <span className="block truncate pointer-events-none ">
                            {option.label}
                          </span>
                        )}
                      </div>

                      {/* Edit/Delete Actions */}
                      <div className="flex items-center space-x-2">
                        {allowEdit && (
                          <Image
                            src={EditIcon}
                            onClick={(e) => {
                              e.stopPropagation();
                              onRequestEdit?.(option);
                            }}
                            alt="Edit"
                            className="text-black"
                          />
                        )}
                        {allowDelete && (
                          <Image
                            src={DeleteIcon}
                            onClick={(e) => deleteOption(option.value, e)}
                            alt="delete"
                            className="text-black"
                          />
                        )}
                      </div>
                    </>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
      <DialogBox
        onSubmit={(e) => {
          e.preventDefault();
          if (pendingDelete) {
            onDeleteCategory?.(pendingDelete);
            setPendingDelete(null);
          }
        }}
        open={!!pendingDelete}
        onOpenChange={(isOpen) => {
          if (!isOpen) setPendingDelete(null);
        }}
        title={"Are you sure?"}
        modal={true}
        isSubmitting={false}
        triggerButton={null}
        submitBtnText="Confirm"
        contentClassName="sm:max-w-[425px]"
        description={"Do you want to delete this Category?"}
      />
    </div>
  );
};
