import Image from "next/image";
export type NoDataBannerProps = {
  bannerText?: string;
  button?: React.ReactNode;
  children?: React.ReactNode; // ✅ Add this line
};
export default function NoDataBanner({
  bannerText = "No Data Found",
  button,
  children,
}: NoDataBannerProps) {
  return (
    <section className="bg-offWhite w-1/2 m-auto rounded-2xl p-6 flex flex-col items-center gap-4 shadow-sm">
      <div className="flex flex-col items-center justify-center">
        <Image
          src="/logo/add-goal-banner.svg"
          alt="No data banner"
          height={200}
          width={200}
          priority
        />
      </div>

      <h2 className="text-lg sm:text-xl text-peach font-medium text-center">
        {bannerText}
      </h2>

      {button}

      {/* ✅ Support custom children below the button */}
      {children}
    </section>
  );
}
