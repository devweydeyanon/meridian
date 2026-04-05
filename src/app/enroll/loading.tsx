export default function Loading() {
  return (
    <div className="animate-pulse min-h-[70vh] bg-gray-50 flex items-center justify-center py-16">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-10 w-full max-w-[460px] mx-4">
        <div className="h-7 bg-gray-200 rounded w-[200px] mb-3" />
        <div className="h-4 bg-gray-100 rounded w-[260px] mb-8" />
        <div className="h-10 bg-gray-100 rounded mb-4" />
        <div className="h-10 bg-gray-100 rounded mb-4" />
        <div className="h-11 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
