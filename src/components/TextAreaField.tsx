import { Textarea } from "@/components/ui/textarea";

interface TextAreaFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function TextAreaField({
  label,
  error = "",
  ...props
}: TextAreaFieldProps) {
  return (
    <div>
      {label && (
        <label className="mb-3 block text-base font-medium text-darkGreen">
          {label}
        </label>
      )}
      <Textarea
        {...props}
        className={`border-lightTeal placeholder:text-lightSlateGreen  focus-visible:ring-lightTeal ${error ? "border border-red-500" : "border border-lightTeal"}`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
