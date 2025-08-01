"use client";

import PageHeader from "@/components/PageHeader";
import AddEnquiryForm from "../_components/AddEnquiryForm";
import { useParams } from "next/navigation";

export default function page() {
  const params = useParams();
  const enquiryId = params.id as string;

  return (
    <main className="bg-offWhite min-h-[calc(100vh-72px)] p-6 overflow-auto">
      <article className="bg-white w-full min-h-[calc(100vh-120px)] rounded-2xl p-6 flex flex-col">
        <PageHeader
          title={enquiryId === "0" ? "Add Enquiries" : "Edit Enquiries"}
        />
        <AddEnquiryForm id={enquiryId} />
      </article>
    </main>
  );
}
