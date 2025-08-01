import { SectionTitleProps } from "@/utils/interface";

const SectionTitle = ({ title, className = "" }: SectionTitleProps) => {
  return (
    <div
      className={`h-10 border-0 flex flex-row justify-between items-center ${className}`}
    >
      <div
        className={`h-6.5 font-semibold tracking-normal leading-relaxed text-[var(--font-black)]`}
      >
        <h2 className="text-lg text-darkGreen">{title}</h2>
      </div>
    </div>
  );
};
export default SectionTitle;
