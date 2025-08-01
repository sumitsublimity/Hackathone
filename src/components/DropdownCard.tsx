import DropdownField from "./DropdownField";
import { Checkbox } from "./ui/checkbox";

interface DropdownCardProps {
  title: string;
  placeholder: string;
}
const DropdownCard = (props: DropdownCardProps) => {
  const { title, placeholder } = props;
  return (
    <article className="p-4 bg-white flex flex-col gap-3 rounded-2xl shadow hover:shadow-md">
      <div className="flex flex-row gap-2 items-center text-base">
        <Checkbox />
        <h3 className="text-darkGreen font-bold">{title}</h3>
      </div>
      <DropdownField
        name="opening-check"
        value=""
        contentClassName="w-full"
        placeholder={placeholder}
        options={["Further Action", "No Action Needed"]}
        onChange={() => {}}
      />
    </article>
  );
};
export default DropdownCard;
