// Framework imports:
import Image from "next/image";
// Local imports:
import Button from "./Button";
import InputField from "./InputField";
import Search from "@/../public/icons/Search.svg";
import Cross from "@/../public/icons/cross.svg";
import { TableActionBarType } from "@/utils/interface";
import SectionTitle from "./SectionTitle";

const TableActionBar = ({
  pageTitle,
  searchTerm,
  onSearch,
  isButtonRequired,
  buttonText,
  onButtonClick,
  clearSearchBar,
}: TableActionBarType) => {
  return (
    <>
      <article className="flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-center">
        <SectionTitle title={pageTitle} />
        {/* Search + Button */}
        <section className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-[200px]">
            <InputField
              name="search"
              value={searchTerm}
              onChange={onSearch}
              placeholder="Search..."
              icon={Search}
              type="text"
              className="w-full"
            />

            {/* Clear button */}
            {searchTerm && (
              <button
                onClick={clearSearchBar}
                className="absolute right-2 top-1/2 -translate-y-1/2"
                aria-label="Clear search"
              >
                <Image src={Cross} alt="Clear" height={20} />
              </button>
            )}
          </div>

          {/* Add Button */}
          {isButtonRequired && (
            <Button
              type="button"
              variant="default"
              text={buttonText}
              className="h-[44px] w-full sm:w-auto text-base bg-slateGreen hover:bg-slateGreen text-[var(--font-white)] hover:brightness-110"
              onClick={onButtonClick}
            />
          )}
        </section>
      </article>
      <hr className="border-lightTeal my-4 w-full" />
    </>
  );
};
export default TableActionBar;
