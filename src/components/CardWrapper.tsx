interface CardWrapperProps {
  title: string;
  children?: React.ReactNode;
}
export const CardWrapper = (props: CardWrapperProps) => {
  const { title, children } = props;
  return (
    <article className="bg-white p-4 rounded-2xl w-full shadow hover:shadow-md flex flex-col justify-between">
      <div>
        <h3 className="text-darkGreen font-bold">{title}</h3>
        <hr className="text-lightTeal" />
      </div>
      {children}
    </article>
  );
};
