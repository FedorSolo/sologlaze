export default function Loading() {
  return (
    <div className="container animate-pulse py-10 lg:py-14">
      <div className="mb-8 h-8 w-40 rounded bg-surface-muted" />
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[4/5] rounded-md bg-surface-muted" />
            <div className="mt-3 h-4 w-3/4 rounded bg-surface-muted" />
            <div className="mt-2 h-4 w-1/2 rounded bg-surface-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
