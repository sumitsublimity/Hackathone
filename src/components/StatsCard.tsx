import Image from "next/image";
interface CardProps {
  title: string;
  description: string;
  footerLeftText: string;
  footerRightText: string;
  iconPath: string;
  cardClassName?: string;
}
const StatsCard = (props: CardProps) => {
  const {
    title,
    description,
    footerLeftText,
    footerRightText,
    iconPath,
    cardClassName,
  } = props;

  return (
    <section
      className={`p-6 rounded-2xl shadow hover:shadow-md min-w-50 w-full min-h-50 flex flex-col justify-between ${cardClassName}`}
    >
      {/*++++++++++++++ Card Title ++++++++++++++  */}
      <h3 className="text-darkGreen font-bold text-base">{title}</h3>

      {/*++++++++++++++ Card Description ++++++++++++++  */}
      <p className="text-sm">{description}</p>

      {/*++++++++++++++ Card Footer ++++++++++++++  */}
      <section className="flex justify-between items-center">
        {/*++++++++++++++ Footer Text ++++++++++++++  */}
        <p className="text-2xl font-bold">{footerLeftText}</p>
        <p className="flex flex-row items-center gap-1">
          <span>{footerRightText}</span>
          {/*++++++++++++++ Icon ++++++++++++++  */}
          <Image src={iconPath} alt="icon" width={16} height={16} />
        </p>
      </section>
    </section>
  );
};
export default StatsCard;
