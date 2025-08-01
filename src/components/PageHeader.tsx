interface PageHeaderProps {
  title: string;
  children?: React.ReactNode;
}

function PageHeader(props: PageHeaderProps) {
  const { title, children } = props;
  return (
    <header>
      <section className="w-full flex flex-col items-start justify-center gap-2 sm:flex-row sm:items-center sm:justify-between sm:flex-wrap">
        <h1 className="text-lg text-darkGreen font-semibold">{title}</h1>
        {children}
      </section>
      <hr className="border-lightTeal my-4 w-full" />
    </header>
  );
}
export default PageHeader;
