import SectionTitle from "@/components/SectionTitle";
import { AddStaffForm } from "./_components/AddStaffForm";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const awaitedParams = await params;

  return (
    <div className="w-full bg-offWhite overflow-auto">
      <div className="rounded-xl p-4 gap-6 m-6 bg-[var(--background)]">
        <SectionTitle
          title={awaitedParams.id != "0" ? "Edit Staff" : "Add Staff"}
        />
        <AddStaffForm ID={awaitedParams.id} />
      </div>
    </div>
  );
};

export default Page;
