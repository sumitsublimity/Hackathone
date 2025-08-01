import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { useState } from "react";
import FloatingAddButton from "./FloatingButton";
import { QuestionItem } from "./Question";

import Button from "@/components/Button";

interface Question {
  id: string;
  text: string;
}

export function DragArea({ categories }: any) {
  // Default questions array with objects
  const defaultQuestions: Question[] = [{ id: "q1", text: "" }];

  const [parent, questions, setQuestions] = useDragAndDrop<
    HTMLUListElement,
    Question
  >(defaultQuestions);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [questionData, setQuestionData] = useState<Record<string, any>>({});
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});

  const addNewQuestion = () => {
    const nextNum = questions.length + 1;
    const newQuestion: Question = {
      id: `q${Date.now()}`,
      text: "",
    };
    let newQuestions;
    if (activeQuestionId) {
      const idx = questions.findIndex((q) => q.id === activeQuestionId);
      if (idx !== -1) {
        newQuestions = [
          ...questions.slice(0, idx + 1),
          newQuestion,
          ...questions.slice(idx + 1),
        ];
      } else {
        newQuestions = [...questions, newQuestion];
      }
    } else {
      newQuestions = [...questions, newQuestion];
    }
    setQuestions(newQuestions);
    setActiveQuestionId(newQuestion.id);
  };

  const clearAllFields = () => {
    const clearedQuestions = questions.map((question) => ({
      ...question,
      text: "",
      answerType: "empty",
      options: ["Option 1", "Option 2"],
      category: "",
      required: false,
    }));
    setQuestions(clearedQuestions);
    setActiveQuestionId(null);
    console.log("heloo");
  };

  const handleQuestionDataChange = (id: string, data: any) => {
    setQuestionData((prev) => ({
      ...prev,
      [id]: data,
    }));
  };

  const validateForm = () => {
    const errors: Record<string, string[]> = {};

    questions.forEach((question) => {
      const data = questionData[question.id] || question;
      const questionErrors: string[] = [];

      // Check if question text is filled
      if (!data.text || data.text.trim() === "") {
        questionErrors.push("Question text is required");
      }

      // Check if answer type is selected
      if (!data.answerType || data.answerType === "empty") {
        questionErrors.push("Please select an answer type");
      }

      // Check if category is selected
      if (!data.category || data.category === "") {
        questionErrors.push("Please select a category");
      }

      // Check options for multi-option questions
      //   if (
      //     [
      //       "checkbox",
      //       "radio",
      //       "dropdown",
      //       "checkboxWithTextField",
      //       "radioWithTextField",
      //       "dropdownWithDropdown",
      //     ].includes(data.answerType)
      //   ) {
      //     if (!data.options || data.options.length < 2) {
      //       questionErrors.push("At least 2 options are required");
      //     } else {
      //       // Check if all options have text
      //       const emptyOptions = data.options.filter(
      //         (opt: string) => !opt || opt.trim() === "",
      //       );
      //       if (emptyOptions.length > 0) {
      //         questionErrors.push("All options must have text");
      //       }
      //     }
      //   }

      if (questionErrors.length > 0) {
        errors[question.id] = questionErrors;
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveFormData = () => {
    if (!validateForm()) {
      //   alert("Please fix the validation errors before saving.");
      return;
    }

    const formData = {
      questions: questions.map((q) => questionData[q.id] || q),
      questionData: questionData,
      timestamp: new Date().toISOString(),
      totalQuestions: questions.length,
    };

    // Save to localStorage
    localStorage.setItem("formData", JSON.stringify(formData));

    // Log to console for debugging
    console.log("Form data saved:", formData);

    // You can also send to API here
    // Example: await saveToAPI(formData);

    alert("Form data saved successfully!");
  };

  console.log({ questions });
  return (
    <>
      <div className="flex items-center flex-col justify-between mt-2">
        <ul
          ref={parent}
          className="grid grid-cols-1 gap-4 w-[95%]"
          style={{ listStyle: "none", padding: 0 }}
        >
          {questions.map((question, index) => (
            <QuestionItem
              key={question.id}
              question={question}
              index={index}
              categories={categories}
              onCopy={(copied) => {
                const newQuestions = [...questions];
                newQuestions.splice(index + 1, 0, copied);
                setQuestions(newQuestions);
              }}
              onDelete={(id) => {
                const filtered = questions.filter((q) => q.id !== id);
                setQuestions(filtered);
              }}
              disableDelete={questions.length === 1}
              active={question.id === activeQuestionId}
              onClick={() => setActiveQuestionId(question.id)}
              onDataChange={handleQuestionDataChange}
              //   validationErrors={validationErrors[question.id] || []}
            />
          ))}
        </ul>
        <div className="flex gap-2">
          <Button className="w-50px" onClick={clearAllFields}>
            Clear
          </Button>
          <Button className="w-50px" onClick={saveFormData}>
            Save
          </Button>
        </div>

        <div className="mt-4 text-center w-[5%]">
          <FloatingAddButton onClick={addNewQuestion} />
        </div>
      </div>
    </>
  );
}
