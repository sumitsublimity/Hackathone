import React from "react";

interface AddIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
}

const AddIcon: React.FC<AddIconProps> = ({
  size = 17,
  color = "#ffff",
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        x="1.1"
        y="1.1"
        width="14.8"
        height="14.8"
        rx="7.4"
        stroke={color}
        strokeWidth="1.2"
      />
      <path
        d="M7.9256 12V5H9.0744V12H7.9256ZM5 9.06193V7.92202H12V9.06193H5Z"
        fill={color}
      />
    </svg>
  );
};

export default AddIcon;
