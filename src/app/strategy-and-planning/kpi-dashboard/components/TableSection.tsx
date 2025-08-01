export function TableSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-max space-y-6">{children}</div>
    </div>
  );
}
