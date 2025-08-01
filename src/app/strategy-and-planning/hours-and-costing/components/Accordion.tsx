import Image from "next/image";
import { useState, useRef, useEffect } from "react";

interface AccordionProps {
  children: React.ReactNode;
  title: string;
  defaultOpen?: boolean;
}

export const Accordion = ({
  children,
  title,
  defaultOpen = false,
}: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [height, setHeight] = useState("0px");
  const contentRef = useRef<HTMLDivElement>(null);

  // ResizeObserver to watch dynamic height changes
  useEffect(() => {
    if (!contentRef.current) return;

    const observer = new ResizeObserver(() => {
      if (isOpen && contentRef.current) {
        setHeight(`${contentRef.current.scrollHeight}px`);
      }
    });

    observer.observe(contentRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isOpen]);

  // Initial height set
  useEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(`${contentRef.current.scrollHeight}px`);
    }
  }, [isOpen, children]); // very important: add `children` as dependency

  return (
    <article className="border border-lightTeal">
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="px-2 py-3 bg-offWhite flex items-center justify-between border cursor-pointer border-lightTeal"
      >
        <h3 className="text-slateGreen font-medium">{title}</h3>
        <Image
          src="/icons/accordion-icon.svg"
          alt="icon"
          height={20}
          width={20}
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
        />
      </div>

      <div
        ref={contentRef}
        style={{
          maxHeight: isOpen ? height : "0px",
          overflow: "hidden",
          transition: "max-height 0.3s ease",
        }}
      >
        <section>{children}</section>
      </div>
    </article>
  );
};
