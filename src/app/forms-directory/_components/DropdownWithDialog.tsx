"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, XIcon } from "lucide-react";
import { useState, useEffect } from "react";
import CheckboxDropdown from "./CheckboxDropdown";
import { showToast } from "@/utils/alert";
import { ALERT_TYPES } from "@/utils/constants";
import SelectComponent from "./SelectComponent";
import Button from "@/components/Button";
import { Input } from "@/components/ui/input";
import { v4 as uuidv4 } from "uuid";
import { Rule } from "./DragArea";

type DropdownWithDialogProps = {
  action: string[];
  type: string;
  questions: any[];
  disableDelete?: boolean;
  question?: any;
  onRulesChange?: (questionId: string, newRules: Rule[]) => void;
};

export function DropdownWithDialog({
  action,
  type,
  questions,
  disableDelete,
  question,
  onRulesChange,
}: DropdownWithDialogProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [localRules, setLocalRules] = useState<Rule[]>([]);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, Partial<Record<keyof Rule, string>>>
  >({});

  const actionDefault = [
    { value: "mandatory", label: "Mandatory" },
    { value: "noneMandatory", label: "None Mandatory" },
    { value: "disable", label: "Disable" },
  ];

  const ruleType = [
    { value: "is", label: "Is" },
    { value: "isNot", label: "Is Not" },
  ];

  const relationOptions = [
    { value: "or", label: "Or" },
    { value: "and", label: "And" },
  ];

  const ruleTypeWithText = [{ value: "contains", label: "Contains" }];

  const questionsList = questions
    .filter((q: any) => q.id !== question?.id && q.text?.trim() !== "")
    .map((q: any) => q.text);

  useEffect(() => {
    if (dialogOpen) {
      if (question?.rules && question.rules.length > 0) {
        setLocalRules(question.rules);
      } else {
        setLocalRules([
          {
            id: uuidv4(),
            action: "",
            type: "",
            value: type === "text" ? "" : [],
            questions: [],
            relation: "",
          },
        ]);
      }
      setFieldErrors({});
    }
  }, [dialogOpen, question?.id, type]);

  const handleRuleChange = (
    id: string,
    field: keyof Rule,
    value: string | string[],
  ) => {
    const updated = localRules.map((r) =>
      r.id === id ? { ...r, [field]: value } : r,
    );

    setLocalRules(updated);
    setFieldErrors((prev) => ({ ...prev, [id]: { ...prev[id], [field]: "" } }));
  };

  const handleAddRule = () => {
    const newRule: Rule = {
      id: uuidv4(),
      action: "",
      type: "",
      value: type === "text" ? "" : [],
      questions: [],
      relation: "",
    };
    setLocalRules([...localRules, newRule]);
  };

  const handleDeleteRule = (id: string) => {
    setLocalRules(localRules.filter((r) => r.id !== id));
    setFieldErrors((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleClear = () => {
    setLocalRules(
      localRules.map((r) => ({
        ...r,
        action: "",
        type: "",
        value: type === "text" ? "" : [],
        questions: [],
        relation: "",
      })),
    );
    setFieldErrors({});
  };

  const handleSubmit = () => {
    let hasErrors = false;
    const newErrors: Record<string, Partial<Record<keyof Rule, string>>> = {};

    for (const rule of localRules) {
      const errors: Partial<Record<keyof Rule, string>> = {};

      if (!rule.type) errors.type = "Please select a type.";
      if (!rule.action) errors.action = "Please select an action.";
      if (
        (type === "text" &&
          (!rule.value ||
            (typeof rule.value === "string" && rule.value.trim() === ""))) ||
        (type !== "text" &&
          Array.isArray(rule.value) &&
          rule.value.length === 0)
      ) {
        errors.value =
          type === "text"
            ? "Please enter a value."
            : "Please select at least one option.";
      }
      if (!rule.questions.length)
        errors.questions = "Please select at least one question.";
      if (
        Array.isArray(rule.value) &&
        rule.value.length >= 2 &&
        !rule.relation
      ) {
        errors.relation = "Please select a relation.";
      }

      if (Object.keys(errors).length > 0) {
        newErrors[rule.id] = errors;
        hasErrors = true;
      }
    }

    setFieldErrors(newErrors);
    if (hasErrors) {
      showToast(
        "Please fix validation errors before submitting.",
        ALERT_TYPES.ERROR,
      );
      return;
    }

    if (onRulesChange && question?.id) {
      onRulesChange(question.id, localRules);
    }

    showToast("Rules updated successfully!", ALERT_TYPES.SUCCESS);
    setDialogOpen(false);
  };

  const handleCreateRulesSelect = () => {
    const hasOtherText = questions.some(
      (q: any) => q.id !== question?.id && q.text?.trim() !== "",
    );

    if (question?.answerType === "") {
      showToast(
        "Please select QuestionType before adding rule",
        ALERT_TYPES.ERROR,
      );
      return;
    }
    if (question?.text === "" && questions.length === 1) {
      showToast(
        "Please add more questions with title before adding rule",
        ALERT_TYPES.ERROR,
      );
      return;
    }
    if (disableDelete) {
      showToast(
        "Please add more questions before adding rule",
        ALERT_TYPES.ERROR,
      );
      return;
    }
    if (!hasOtherText) {
      showToast(
        "Please add more questions with title before adding rule",
        ALERT_TYPES.ERROR,
      );
      return;
    }

    setDialogOpen(true);
    setMenuOpen(false);
  };

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="h-10 w-10 flex items-center justify-center relative"
            aria-label="Open menu"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <MoreVertical className="cursor-pointer" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          side="top"
          className="w-40 border border-lightTeal p-1"
          sideOffset={4}
          avoidCollisions={false}
          forceMount
        >
          <DropdownMenuItem onSelect={handleCreateRulesSelect}>
            {question?.rules && question.rules.length > 0
              ? "Edit Rules"
              : "Create Rules"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="!max-w-[85vw] max-h-[500px] overflow-y-auto border-gray-300">
          <DialogHeader>
            <DialogTitle>
              Rules for: {question?.text || "Untitled Question"}
              {question?.rules?.length > 0 && (
                <span className="text-sm text-gray-500 ml-2">
                  ({question.rules.length} rule
                  {question.rules.length !== 1 ? "s" : ""})
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          <Button className="w-auto max-w-[200px]" onClick={handleAddRule}>
            Add Another Rule
          </Button>

          {localRules.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No rules defined. Click "Add Another Rule" to create one.
            </div>
          ) : (
            localRules.map((rule, index) => {
              const showRelation =
                Array.isArray(rule.value) && rule.value.length >= 2;
              return (
                <div key={index}>
                  <div
                    key={rule.id}
                    className="flex relative flex-wrap items-start justify-between gap-3 mb-4 rounded-sm my-1 bg-offWhite px-6 pb-6 pt-8"
                  >
                    <div className="absolute top-2 left-2 text-xs text-gray-500 font-medium">
                      Rule {index + 1}
                    </div>

                    <div className="min-w-auto flex flex-col">
                      <p className="mt-1">Answer If</p>
                      <div className="text-xs text-red-600  min-h-[1rem]"></div>
                    </div>
                    <div className="min-w-[160px] flex flex-col">
                      <SelectComponent
                        options={type === "text" ? ruleTypeWithText : ruleType}
                        value={rule.type}
                        onChange={(val) =>
                          handleRuleChange(rule.id, "type", val)
                        }
                        placeholder="Choose a Type"
                      />
                      <div className="text-xs text-red-600 mt-1 min-h-[1rem]">
                        {fieldErrors[rule.id]?.type}
                      </div>
                    </div>

                    <div className="flex-1 min-w-[200px] flex flex-col">
                      {type === "text" ? (
                        <>
                          <Input
                            placeholder="Enter text"
                            className="w-full bg-white"
                            value={
                              typeof rule.value === "string" ? rule.value : ""
                            }
                            onChange={(e) =>
                              handleRuleChange(rule.id, "value", e.target.value)
                            }
                          />
                          <div className="text-xs text-red-600 mt-1 min-h-[1rem]">
                            {fieldErrors[rule.id]?.value}
                          </div>
                        </>
                      ) : (
                        <>
                          <CheckboxDropdown
                            action={action}
                            selected={
                              Array.isArray(rule.value) ? rule.value : []
                            }
                            onChange={(val) =>
                              handleRuleChange(rule.id, "value", val)
                            }
                            placeholder="Select Options"
                          />
                          <div className="text-xs text-red-600 mt-1 min-h-[1rem]">
                            {fieldErrors[rule.id]?.value}
                          </div>
                        </>
                      )}
                    </div>

                    {showRelation && (
                      <div className="flex-1 min-w-[120px] flex flex-col">
                        <SelectComponent
                          options={relationOptions}
                          value={rule.relation || ""}
                          onChange={(val) =>
                            handleRuleChange(rule.id, "relation", val)
                          }
                          placeholder="Choose a Relation"
                        />
                        <div className="text-xs text-red-600 mt-1 min-h-[1rem]">
                          {fieldErrors[rule.id]?.relation}
                        </div>
                      </div>
                    )}

                    <div className="min-w-[160px] flex flex-col">
                      <SelectComponent
                        options={actionDefault}
                        value={rule.action}
                        onChange={(val) =>
                          handleRuleChange(rule.id, "action", val)
                        }
                        placeholder="Choose an Action"
                      />
                      <div className="text-xs text-red-600 mt-1 min-h-[1rem]">
                        {fieldErrors[rule.id]?.action}
                      </div>
                    </div>

                    <div className="flex-1 min-w-[200px] flex flex-col">
                      <CheckboxDropdown
                        action={questionsList}
                        disableDelete={disableDelete}
                        placeholder="Select Question"
                        selected={rule.questions}
                        onChange={(val) =>
                          handleRuleChange(rule.id, "questions", val)
                        }
                      />
                      <div className="text-xs text-red-600 mt-1 min-h-[1rem]">
                        {fieldErrors[rule.id]?.questions}
                      </div>
                    </div>

                    {localRules.length > 1 && (
                      <div className="absolute -top-1 -right-1 bg-gray-400 rounded-full p-1">
                        <XIcon
                          color="white"
                          onClick={() => handleDeleteRule(rule.id)}
                          className="cursor-pointer w-3 h-3"
                        />
                      </div>
                    )}
                  </div>
                  {/* {previewText && (
                    <div className="text-xs text-blue-700 font-semibold italic mb-2 px-2">
                      {previewText}
                    </div>
                  )} */}
                </div>
              );
            })
          )}

          <div className="flex items-center justify-end gap-3 mt-4 p-2 w-full">
            <Button className="bg-peach" onClick={handleClear}>
              Clear
            </Button>
            <Button className="bg-darkGreen" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
