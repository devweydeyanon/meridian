export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 h-[280px] max-md:h-[200px]" />
      <div className="max-w-[1200px] mx-auto px-6 py-14 max-md:py-8">
        <div className="text-center mb-10">
          <div className="h-8 bg-gray-200 rounded-md w-[300px] mx-auto mb-3" />
          <div className="h-4 bg-gray-100 rounded w-[400px] mx-auto max-md:w-[250px]" />
        </div>
        <div className="grid grid-cols-3 gap-5 max-lg:grid-cols-2 max-md:grid-cols-1">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-[10px] border border-gray-200 p-6">
              <div className="w-11 h-11 bg-gray-200 rounded-xl mb-3" />
              <div className="h-4 bg-gray-200 rounded w-[60%] mb-2" />
              <div className="h-3 bg-gray-100 rounded w-full mb-1" />
              <div className="h-3 bg-gray-100 rounded w-[80%]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
