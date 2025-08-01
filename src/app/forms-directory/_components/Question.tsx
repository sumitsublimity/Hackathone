// components/QuestionItem.tsx

"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Trash2, Copy, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const dropDownOptions = [
  { value: "empty", label: "Choose Answer Type" },
  { value: "text", label: "Text Field" },
  { value: "checkbox", label: "Checkbox" },
  { value: "radio", label: "Radio Button" },
  { value: "dropdown", label: "Dropdown" },
  { value: "checkboxWithTextField", label: "Checkbox with text field" },
  { value: "radioWithTextField", label: "Radio Button with text field" },
  { value: "dropdownWithDropdown", label: "Dropdown with dropdown" },
];

interface QuestionItemProps {
  question: {
    id: string;
    text?: string;
    answerType?: string;
    options?: string[];
    category?: string;
    required?: boolean;
  };
  index: number;
  categories: any;
  onCopy: (question: any) => void;
  onDelete: (id: string) => void;
  disableDelete?: boolean;
  active?: boolean;
  onClick?: () => void;
  onDataChange?: (id: string, data: any) => void;
  validationErrors?: string[];
}

export const QuestionItem: React.FC<QuestionItemProps> = ({
  question,
  index,
  categories,
  onCopy,
  onDelete,
  disableDelete = false,
  active,
  onClick,
  onDataChange,
  validationErrors = [],
}) => {
  const [questionText, setQuestionText] = useState(question.text || "");
  const [answerType, setAnswerType] = useState(question.answerType || "empty");
  const [options, setOptions] = useState(
    question.options || ["Option 1", "Option 2"],
  );
  const [category, setCategory] = useState(question.category || "");
  const [required, setRequired] = useState(question.required || false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setQuestionText(question.text || "");
    setAnswerType(question.answerType || "empty");
    setOptions(question.options || ["Option 1", "Option 2"]);
    setCategory(question.category || "");
    setRequired(question.required || false);
  }, [question]);

  // Function to notify parent of data changes
  const notifyDataChange = () => {
    if (onDataChange) {
      onDataChange(question.id, {
        id: question.id,
        text: questionText,
        answerType,
        options,
        category,
        required,
      });
    }
  };

  // Call notifyDataChange whenever any field changes
  useEffect(() => {
    notifyDataChange();
  }, [questionText, answerType, options, category, required]);

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const isMultiOption = [
    "checkbox",
    "radio",
    "dropdown",
    "checkboxWithTextField",
    "radioWithTextField",
    "dropdownWithDropdown",
  ].includes(answerType);

  console.log({ validationErrors });

  return (
    <li
      onClick={onClick}
      className={`border flex flex-col gap-4 !z-10 border-gray-300 rounded-md p-4 bg-white shadow hover:shadow-md transition-shadow ${active ? "ring-2 ring-green-200" : ""}`}
      data-id={question.id}
      key={question.id}
    >
      <div className="flex items-start gap-4">
        <div className="mt-2">Q{index + 1}</div>
        <Input
          type="text"
          placeholder="Question"
          className="w-full text-lg font-medium text-gray-700"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
        />
        <Select value={answerType} onValueChange={setAnswerType}>
          <SelectTrigger className="w-60">
            <SelectValue placeholder="Choose Answer Type" />
          </SelectTrigger>
          <SelectContent className="border w-60 border border-lightTeal">
            {dropDownOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {answerType === "text" && (
        <Input
          type="text"
          className="w-full text-lg font-medium text-gray-700"
          placeholder="Enter answer..."
        />
      )}

      {isMultiOption && (
        <div className=" flex flex-col gap-2">
          {options.map((opt, idx) => (
            <div key={idx} className="flex items-center gap-2">
              {answerType === "dropdown" ||
              answerType === "dropdownWithDropdown" ? (
                <></>
              ) : (
                <input
                  type={answerType.includes("radio") ? "radio" : "checkbox"}
                  disabled
                  className="w-4 h-4"
                />
              )}
              <Input
                value={opt}
                placeholder={`Option ${idx + 1}`}
                onChange={(e) => updateOption(idx, e.target.value)}
                className="w-full"
              />
              {((answerType === "dropdown" && options.length > 2) ||
                (answerType !== "dropdown" && options.length > 1)) && (
                <button
                  onClick={() => removeOption(idx)}
                  className="text-xl cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button onClick={addOption} className="text-green-600 text-sm ml-6">
            Add Another option
          </button>
        </div>
      )}

      {(answerType === "checkboxWithTextField" ||
        answerType === "radioWithTextField" ||
        answerType === "dropdownWithDropdown") && (
        <Input
          type="text"
          className=" mt-2 text-sm"
          placeholder="Answer Hint"
        />
      )}
      <hr className="border-t border-gray-300 my-4" />

      <div className="flex items-center justify-between gap-4 ">
        <div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-64" disabled={!categories.length}>
              <SelectValue placeholder="Choose a Category" />
            </SelectTrigger>
            <SelectContent className="border border-lightTeal w-full">
              {categories.map((cat: any) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between gap-5">
          <button
            onClick={() =>
              onCopy({
                id: `q${Date.now()}`,
                text: questionText,
                answerType,
                options,
                category,
                required,
              })
            }
          >
            <Copy className="cursor-pointer text-peach" />
          </button>

          {!disableDelete && (
            <button onClick={() => onDelete(question.id)}>
              <Trash2
                className="cursor-pointer "
                style={{
                  color: "#FF5050",
                }}
              />
            </button>
          )}

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Required</span>
            <Switch checked={required} onCheckedChange={setRequired} />
          </div>

          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="h-10"
                onClick={() => {
                  setMenuOpen((prev) => !prev);
                }}
              >
                <MoreVertical className="cursor-pointer" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              side="top"
              className="w-26 border-lightTeal p-1 z-"
              sideOffset={4}
              avoidCollisions={false}
              forceMount
            >
              <DropdownMenuItem onSelect={() => console.log("Create Rules")}>
                Create Rules
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
          {validationErrors.map((error, idx) => (
            <div
              key={idx}
              className="text-red-600 text-sm flex items-center gap-1"
            >
              <span className="text-red-500">•</span>
              {error}
            </div>
          ))}
        </div>
      )}
    </li>
  );
};
