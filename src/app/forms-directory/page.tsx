"use client";
import EditIcon from "@/../public/icons/edit-row.svg";
import RightArrow from "@/../public/icons/RightArrow.svg";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState } from "react";
import { DragArea } from "./_components/DragArea";
import { EditableCategoryDropdown } from "./_components/EditableCategoryDropdown";
import { showToast } from "@/utils/alert";
import { ALERT_TYPES, MESSAGES } from "@/utils/constants";

export type Category = { value: string; label: string };

const page = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [inputValue, setInputValue] = useState("");
  const [editingCategory, setEditingCategory] = useState<null | {
    value: string;
    label: string;
  }>(null);

  const handleEditCategory = (
    oldValue: string,
    newValue: string,
    newLabel: string,
  ) => {
    setCategories((prev: any) =>
      prev.map((cat: any) =>
        cat.value === oldValue
          ? { ...cat, value: newValue, label: newLabel }
          : cat,
      ),
    );

    // Update selected value if it was the edited one
    if (selectedCategory === oldValue) {
      setSelectedCategory(newValue);
    }
  };

  const handleDeleteCategory = (value: string) => {
    setCategories((prev: any) =>
      prev.filter((cat: any) => cat.value !== value),
    );

    // Clear selection if deleted category was selected
    if (selectedCategory === value) {
      setSelectedCategory("");
    }
  };

  const handleAddCategory = () => {
    const value = inputValue.trim().toLowerCase();
    const label = inputValue.trim();
    if (!value) {
      alert("Please enter a category value");
      return;
    }
    if (categories.some((cat: any) => cat.value === value)) {
      alert("Category value already exists!");
      return;
    }
    setCategories((prev: any) => [...prev, { value, label }]);
    setInputValue("");
    showToast(MESSAGES.ADD_CATEGORY_SUCCESS, ALERT_TYPES.SUCCESS);
  };

  const handleRequestEdit = (option: { value: string; label: string }) => {
    setEditingCategory(option);
    setInputValue(option.label);
  };

  const handleSaveEdit = () => {
    if (!inputValue.trim() || !editingCategory) return;
    handleEditCategory(
      editingCategory.value,
      inputValue.trim().toLowerCase(),
      inputValue.trim(),
    );
    setEditingCategory(null);
    setInputValue("");
    showToast(MESSAGES.EDIT_CATEGORY_SUCCESS, ALERT_TYPES.SUCCESS);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setInputValue("");
  };
  return (
    <main className="bg-offWhite min-h-[calc(100vh-72px)] p-6 overflow-auto">
      <article className="bg-white w-full min-h-[calc(100vh-120px)] rounded-2xl p-6 flex flex-col">
        <div className="mb-6 pb-4 flex justify-between items-center">
          <input
            type="text"
            placeholder="Add Form Title"
            className="w-full text-lg font-medium text-gray-400 bg-transparent pb-2 outline-none focus:text-gray-900 placeholder-gray-400 border-b border-peach"
          />

          <Image src={EditIcon} alt="Edit" className="text-black" />
        </div>

        <div className="grid grid-cols-3 gap-2 my-2 w-[95%]">
          <div className="flex flex-col justify-end gap-2">
            <label htmlFor="question">Add Category</label>
            <Input
              className="h-10"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                editingCategory ? "Edit category" : "Add new category"
              }
            />
          </div>

          <div className="flex items-end justify-center gap-3">
            {editingCategory ? (
              <>
                <button
                  className="bg-darkGreen text-white px-3 py-1 rounded"
                  onClick={handleSaveEdit}
                  disabled={!inputValue.trim()}
                >
                  Save
                </button>
                <button
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                className="bg-darkGreen text-white flex items-center gap-2 px-3 py-1 rounded"
                onClick={handleAddCategory}
                // disabled={!inputValue.trim()}
              >
                Add
                <Image src={RightArrow} alt="Edit" className="text-black" />
              </button>
            )}
          </div>

          <div className="flex flex-col justify-end gap-2">
            <label className="block font-medium text-gray-700">
              Choose a Category
            </label>
            <EditableCategoryDropdown
              options={categories}
              value={selectedCategory}
              placeholder="Choose a Category"
              onChange={(value) => setSelectedCategory(value as string)}
              onEditCategory={handleEditCategory}
              onDeleteCategory={handleDeleteCategory}
              allowEdit={true}
              allowDelete={true}
              allowAdd={false}
              onRequestEdit={handleRequestEdit}
            />
          </div>
        </div>

        <DragArea categories={categories} />
      </article>
    </main>
  );
};

export default page;
