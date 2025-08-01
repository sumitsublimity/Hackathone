import SectionTitle from "@/components/SectionTitle";
import { AddSiteForm } from "./_components/AddSiteForm";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const awaitedParams = await params;

  return (
    <div className="w-full  bg-offWhite overflow-auto">
      <div className="rounded-xl gap-6 m-6 ">
        <div className="h-10 pb-4 border-b border-[var(--font-slate)]">
          <div className="h-6 font-bold tracking-normal leading-relaxed text-base text-darkGreen">
            <SectionTitle
              title={awaitedParams.id != "0" ? "Edit Site" : "Add Site"}
            />
          </div>
        </div>
        <AddSiteForm ID={awaitedParams.id} />
      </div>
    </div>
  );

};

export default Page;
