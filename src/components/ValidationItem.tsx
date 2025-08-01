"use client";

import Image, { StaticImageData } from "next/image";
import React from "react";
import validBullet from "@/../public/icons/valid-bullet.svg";
import neutralBullet from "@/../public/icons/neutral-bullet.svg";
import errorBullet from "@/../public/icons/error-bullet.svg";
import { ValidationItemProps } from "@/utils/interface";

const ValidationItem: React.FC<ValidationItemProps> = ({
  showColor,
  isValid,
  label,
}) => {
  let textColor = "";
  let bulletIcon: StaticImageData;

  if (!showColor) {
    // Initial state:
    textColor = "text-slateGreen";
    bulletIcon = neutralBullet;
  } else {
    if (isValid) {
      //   Valid state:
      textColor = "text-teal";
      bulletIcon = validBullet;
    } else {
      // Invalid state:
      textColor = "text-red-500";
      bulletIcon = errorBullet;
    }
  }

  return (
    <div className={textColor}>
      <p className="flex gap-1 items-center">
        <span>
          <Image src={bulletIcon} alt="bullet icon" />
        </span>
        <span>{label}</span>
      </p>
    </div>
  );
};

export default ValidationItem;
