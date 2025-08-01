"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Matcher } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import { format } from "date-fns";

interface DatePickerProps {
  label?: string;
  placeholder?: string;
  iconRight?: string;
  errorMessage?: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  disabled?: Matcher | Matcher[];
  startMonth?: Date;
  endMonth?: Date;
  dateFormat: string;
}

export function DatePicker({
  label,
  placeholder,
  iconRight,
  errorMessage,
  value,
  onChange,
  startMonth,
  endMonth,
  disabled,
  dateFormat,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div className="flex flex-col">
        {label && (
          <label className="px-1 text-darkGreen font-medium mb-3">
            {label}
          </label>
        )}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            asChild
            tabIndex={0}
            className={`cursor-pointer hover:bg-transparent hover:text-lightSlateGreen text-sm text-lightSlateGreen rounded-lg px-4 py-3 h-12 flex items-center gap-2 justify-between w-full  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lightTeal $${
              errorMessage ? "border border-red-500" : "border border-lightTeal"
            }`}
          >
            <Button
              variant="outline"
              id="date"
              className={`justify-between font-normal ${
                value ? "text-black hover:text-black" : "text-lightSlateGreen"
              }`}
            >
              {value ? format(value, dateFormat) : placeholder}
              {iconRight ? (
                <Image src={iconRight} alt="icon" height={18} width={18} />
              ) : (
                <ChevronDownIcon />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden border-none p-0"
            align="end"
          >
            <Calendar
              captionLayout="dropdown"
              mode="single"
              selected={value}
              startMonth={startMonth}
              endMonth={endMonth}
              disabled={disabled}
              onSelect={(selectedDate) => {
                onChange?.(selectedDate);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
        {errorMessage && (
          <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
        )}
      </div>
    </>
  );
}
